import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { MemberRole } from "./../../libs/common/src/enums/member-role.enum";
import { StokvelRepository } from "./stokvel.repository";
import { SystemRole } from "./../../libs/common/src/enums/system-role.enum";
import { AuthenticatedUser } from "./../../libs/common/src/interfaces/authenticated-user.interface";
import { StokvelDto } from "./dto/stokvel.dto";
import { StokvelMembershipService } from "src/stokvel-membership/stokvel-membership.service";

@Injectable()
export class StokvelService {
  private readonly log = new Logger(StokvelService.name);
  constructor(
    private readonly stokvelRepository: StokvelRepository,

    private stokvelMembershipService: StokvelMembershipService
  ) {}

  async create(createDto: StokvelDto, userId: string) {
    // 1. Create stokvel
    const stokvel = await this.stokvelRepository.create({ ...createDto, createdBy: userId });

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
    return stokvel;
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
}
