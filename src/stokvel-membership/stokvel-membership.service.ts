import { StokvelMembershipDto } from "./dto/stokvel-membership.dto";
import { StokvelMembershipRepository } from "./stokvel-membership.repository";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class StokvelMembershipService {
  private readonly log = new Logger(StokvelMembershipService.name);
  constructor(private readonly stokvelMembershipRepository: StokvelMembershipRepository) {}

  async create(stokvelMembershipDto: StokvelMembershipDto) {
    return this.stokvelMembershipRepository.create(stokvelMembershipDto);
  }

  async findOne(values: { userId: string; stokvelId: string }) {
    return this.stokvelMembershipRepository.findOne(values);
  }

  async findByUserId(userId: string) {
    return this.stokvelMembershipRepository.find({
      userId,
      isActive: true
    });
  }
}
