import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { MemberRole } from "./../../libs/common/src/enums/member-role.enum";
import { StokvelRepository } from "./stokvel.repository";
import { SystemRole } from "./../../libs/common/src/enums/system-role.enum";
import { AuthenticatedUser } from "./../../libs/common/src/interfaces/authenticated-user.interface";
import { StokvelDto } from "./dto/stokvel.dto";
import { StokvelMembershipService } from "src/stokvel-membership/stokvel-membership.service";
import { CreateStokvelPolicyDto } from "./dto/create-stokvel-policy.dto";
import { StokvelPolicy, StokvelPolicyDocument } from "./../../libs/common/src/database/schemas/stokvel-policy.schema";
import { StokvelMembership, StokvelMembershipDocument } from "./../../libs/common/src/database/schemas/stokvel-membership.schema";
import { MonthlyContribution, MonthlyContributionDocument } from "./../../libs/common/src/database/schemas/monthly-contribution.schema";
import { StokvelInvite, StokvelInviteDocument } from "./../../libs/common/src/database/schemas/stokvel-invite.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Response } from "express";
import { randomBytes } from "crypto";
import { CreateStokvelInviteDto } from "./dto/create-stokvel-invite.dto";
import { CommunicationService } from "./../../libs/common/src/utils/send-communication";
import PDFDocument from "pdfkit";
import moment from "moment-timezone";
import { sendStokvelInviteTemplate } from "./templates/send-stokvel-invite";
import { ConfigService } from "@nestjs/config";
import { ConfigProps } from "@common/config/config.interface";

@Injectable()
export class StokvelService {
  private readonly log = new Logger(StokvelService.name);
  constructor(
    private readonly stokvelRepository: StokvelRepository,

    private stokvelMembershipService: StokvelMembershipService,

    @InjectModel(StokvelPolicy.name)
    private readonly stokvelPolicyModel: Model<StokvelPolicyDocument>,

    @InjectModel(StokvelMembership.name)
    private readonly stokvelMembershipsModel: Model<StokvelMembershipDocument>,

    @InjectModel(MonthlyContribution.name)
    private readonly monthlyContributionModel: Model<MonthlyContributionDocument>,

    @InjectModel(StokvelInvite.name)
    private readonly stokvelInviteModel: Model<StokvelInviteDocument>,

    private readonly configService: ConfigService,
    private readonly communicationService: CommunicationService
  ) {}

  async create(createDto: StokvelDto, userId: string) {
    // 1. Create stokvel

    const inviteCode = await this.generateStokvelInviteCode();
    const stokvel = await this.stokvelRepository.create({
      ...createDto,
      adminIds: [userId],
      createdBy: userId,
      inviteCode
    });

    // 2. Create membership (creator = admin)
    await this.stokvelMembershipService.create({
      userId,
      stokvelId: stokvel._id,
      role: MemberRole.ADMINISTRATOR
    });

    return stokvel;
  }

  async findAll(page: number, size: number, searchText: string, user: AuthenticatedUser) {
    const filter = {};

    if (searchText) {
      filter["$or"] = [{ name: { $regex: searchText, $options: "i" } }, { description: { $regex: searchText, $options: "i" } }];
    }

    if (user.role === SystemRole.ADMIN) {
      return this.stokvelRepository.findAndPaginate(filter, {
        page,
        limit: size
      });
    }

    const memberships = await this.stokvelMembershipService.findByUserId(user._id);
    const stokvelIds = memberships.map(m => m.stokvelId);

    if (!stokvelIds.length) {
      return {
        data: [],
        meta: {
          total: 0,
          page,
          size,
          totalPages: 0
        }
      };
    }

    // 3. Apply filter
    filter["_id"] = { $in: stokvelIds };

    return this.stokvelRepository.findAndPaginate(filter, {
      page,
      limit: size
    });
  }

  async findOne(id: string) {
    const stokvel = await this.stokvelRepository.findById(id);
    if (!stokvel) throw new NotFoundException("Stokvel not found");

    if (!stokvel.inviteCode) {
      const inviteCode = await this.generateStokvelInviteCode();
      stokvel.inviteCode = inviteCode;
      await stokvel.save();
    }

    const members = await this.stokvelMembershipsModel.countDocuments({ stokvelId: id }).exec();
    const totalContributions = await this.monthlyContributionModel.countDocuments({ stokvelId: id }).exec();
    const totalPolicies = await this.stokvelPolicyModel.countDocuments({ stokvelId: id }).exec();
    // total payouts made
    // trust score
    return { stokvel, members, totalContributions, totalPolicies };
  }

  async update(id: string, updateDto: Partial<StokvelDto>) {
    const stokvel = await this.findOne(id);
    if (!stokvel) throw new NotFoundException("Stokvel not found");
    return await this.stokvelRepository.findByIdAndUpdate(id, updateDto);
  }

  async remove(id: string) {
    const stokvel = await this.findOne(id);
    if (!stokvel) throw new NotFoundException("Stokvel not found");
    return await this.stokvelRepository.findByIdAndDelete(id);
  }

  async createpolicy(userId: string, dto: CreateStokvelPolicyDto) {
    const existingPolicy = await this.stokvelPolicyModel.findOne({
      stokvelId: dto.stokvelId,
      isActive: true
    });

    const nextVersion = existingPolicy ? existingPolicy.version + 1 : 1;

    if (existingPolicy) {
      existingPolicy.isActive = false;
      await existingPolicy.save();
    }

    const createdPolicy = await this.stokvelPolicyModel.create({
      stokvelId: dto.stokvelId,
      purpose: dto.purpose,
      membershipRules: dto.membershipRules,
      contributionRules: dto.contributionRules,
      payoutRules: dto.payoutRules,
      meetingRules: dto.meetingRules,
      disputeRules: dto.disputeRules,
      constitutionAmendmentRules: dto.constitutionAmendmentRules,
      createdBy: userId,
      version: nextVersion,
      isActive: true
    });

    return createdPolicy;
  }

  async findActivePolicy(stokvelId: string) {
    const policy = await this.stokvelPolicyModel.findOne({
      stokvelId,
      isActive: true
    });

    if (!policy) {
      throw new NotFoundException("Active stokvel policy not found");
    }

    return policy;
  }

  async findPolicyHistory(stokvelId: string) {
    return await this.stokvelPolicyModel.find({ stokvelId });
  }

  async findPolicyVersion(stokvelId: string, version: number) {
    const policy = await this.stokvelPolicyModel.findOne({
      stokvelId,
      version
    });

    if (!policy) {
      throw new NotFoundException("Policy version not found");
    }

    return policy;
  }

  async generateConstitutionPdf(stokvelId: string, version: number | undefined, res: Response): Promise<void> {
    let query: Record<string, unknown>;

    if (version !== undefined) {
      query = { stokvelId, version };
    } else {
      query = { stokvelId, isActive: true };
    }

    const policy = await this.stokvelPolicyModel
      .findOne(query)
      .sort({ version: -1 })
      .populate("stokvelId", "name")
      .populate("createdBy", "profile.firstName profile.lastName profile.email")
      .exec();

    if (!policy) {
      throw version !== undefined
        ? new NotFoundException(`No constitution version ${version} found for this stokvel`)
        : new NotFoundException("No active constitution found for this stokvel");
    }

    const stokvel = policy.stokvelId as any;
    const creator = policy.createdBy as any;

    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 60, bottom: 60, left: 60, right: 60 },
      info: {
        Title: `${stokvel?.name ?? "Stokvel"} Constitution`,
        Author: creator?.email ?? "Stokvel App",
        Subject: "Stokvel Constitution"
      },
      bufferPages: true
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="constitution-v${policy.version}.pdf"`);
    doc.pipe(res as any);

    // Header
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .text(stokvel?.name ?? "Stokvel", { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(16).font("Helvetica").text("CONSTITUTION", { align: "center" });
    doc.moveDown(0.5);
    doc
      .fontSize(10)
      .fillColor("gray")
      .text(`Version ${policy.version}${policy.isActive ? "" : " (superseded)"}  |  Generated on ${moment().format("YYYY MMM DD")}`, {
        align: "center"
      });
    doc.fillColor("black").moveDown(1.5);

    // Sections
    const sections: Array<{ title: string; body: string }> = [
      { title: "1. Purpose", body: policy.purpose },
      { title: "2. Membership Rules", body: policy.membershipRules },
      { title: "3. Contribution Rules", body: policy.contributionRules },
      { title: "4. Payout Rules", body: policy.payoutRules },
      { title: "5. Meeting Rules", body: policy.meetingRules },
      { title: "6. Dispute Resolution", body: policy.disputeRules },
      { title: "7. Amendment of the Constitution", body: policy.constitutionAmendmentRules }
    ];

    for (const section of sections) {
      this.addSection(doc, section.title, section.body);
    }

    // Footer with page numbers (margins.bottom = 0 trick to avoid blank pages)
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      const oldBottom = doc.page.margins.bottom;
      doc.page.margins.bottom = 0;
      doc
        .fontSize(9)
        .fillColor("gray")
        .text(`Page ${i + 1} of ${range.count}  —  Constitution v${policy.version}`, 60, doc.page.height - 45, {
          align: "center",
          width: doc.page.width - 120,
          lineBreak: false
        });
      doc.page.margins.bottom = oldBottom;
    }

    doc.end();
  }

  async createInvite(stokvelId: string, dto: CreateStokvelInviteDto, invitedBy: string): Promise<StokvelInvite> {
    const stokvel = await this.stokvelRepository.findById(stokvelId);
    if (!stokvel) throw new NotFoundException("Stokvel not found");

    const email = dto.email.toLowerCase().trim();

    const pending = await this.stokvelInviteModel.findOne({
      stokvelId,
      email,
      inviteAccepted: false
    });
    if (pending) {
      throw new BadRequestException("An invite is already pending for this email address");
    }

    // Ensure the invite code is always unique (in case of a collision)

    const invite = await this.stokvelInviteModel.create({
      ...dto,
      email,
      stokvelId,
      invitedBy,
      inviteCode: stokvel.inviteCode
    });

    const { frontendBaseUrl } = this.configService.get<ConfigProps["systemLinks"]>("systemLinks");

    const inviteLink = `${frontendBaseUrl}/join/${stokvel.inviteCode}`;

    await this.communicationService.sendEmail({
      to: email,
      subject: `You've been invited to join ${stokvel.name}`,
      html: sendStokvelInviteTemplate({
        firstName: dto.firstName,
        stokvelName: stokvel.name,
        inviteCode: stokvel.inviteCode,
        inviteLink
      })
    });

    return invite;
  }

  private addSection(doc: PDFKit.PDFDocument, title: string, body: string) {
    if (doc.y > doc.page.height - 160) doc.addPage();
    doc.fontSize(13).font("Helvetica-Bold").text(title);
    doc.moveDown(0.4);
    doc.fontSize(11).font("Helvetica").text(body, { align: "justify", lineGap: 3 });
    doc.moveDown(1.2);
  }

  private async generateStokvelInviteCode(): Promise<string> {
    let inviteCode = randomBytes(4).toString("hex").toUpperCase();
    let existingInvite = await this.stokvelInviteModel.findOne({ inviteCode });
    while (existingInvite) {
      inviteCode = randomBytes(4).toString("hex").toUpperCase();
      existingInvite = await this.stokvelInviteModel.findOne({ inviteCode });
    }
    return inviteCode;
  }
}
