import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ClaimRepository } from "./claim.repository";
import { ClaimStatus } from "../../libs/common/src/enums/claim-status.enum";

@Injectable()
export class ClaimService {
  private readonly log = new Logger(ClaimService.name);
  constructor(private readonly claimRepository: ClaimRepository) {}

  async findOne(claimId: string) {
    this.log.log(`Fetching claim with ID: ${claimId}`);
    const claim = await this.claimRepository.findOne({ _id: claimId });

    if (!claim) {
      this.log.error(`Claim with ID ${claimId} not found`);
      throw new NotFoundException("Claim not found");
    }
    return { claim };
  }

  async create(dto: { stokvelId: string; title: string; description: string; defendantId: string }, userId: string) {
    const claim = await this.claimRepository.create({ ...dto, createdBy: userId });
    // await this.credScoreService.handleClaimCreated(userId);
    return { claim };
  }

  async update(values: { claimId: string; status: ClaimStatus; reason?: string }, userId: string) {
    const { claimId, status, reason } = values;
    const claim = await this.claimRepository.findOne({ _id: claimId });

    if (!claim) {
      this.log.error(`Claim with ID ${claimId} not found`);
      throw new NotFoundException("Claim not found");
    }

    const updateBody = { status, RejectionDetails: null };

    if (status === ClaimStatus.REJECTED) {
      // await this.credScoreService.handleClaimWithdrawn(userId);
      updateBody.RejectionDetails = {
        reason: reason || "Claim rejected by admin",
        rejectedBy: userId,
        rejectedAt: new Date()
      };
    } else if (status === ClaimStatus.RESOLVED) {
      // await this.credScoreService.handleClaimResolved(userId);
    }

    await this.claimRepository.updateOne({ _id: claimId }, updateBody);
    return { message: "Claim status updated successfully" };
  }
}
