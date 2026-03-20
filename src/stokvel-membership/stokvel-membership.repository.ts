import { StokvelMembership, StokvelMembershipDocument } from "../../libs/common/src/database/schemas/stokvel-membership.schema";
import { Injectable, Logger } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { AbstractRepository } from "../../libs/common/src/database/abstract.repository";

@Injectable()
export class StokvelMembershipRepository extends AbstractRepository<StokvelMembershipDocument> {
  protected readonly logger = new Logger(StokvelMembershipRepository.name);

  constructor(
    @InjectModel(StokvelMembership.name)
    stokvelMembershipModel: Model<StokvelMembershipDocument>
  ) {
    super(stokvelMembershipModel);
  }
}
