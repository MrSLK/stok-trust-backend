import { Claim, ClaimDocument } from "../../libs/common/src/database/schemas/claims.schema";
import { Injectable, Logger } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { AbstractRepository } from "../../libs/common/src/database/abstract.repository";

@Injectable()
export class ClaimRepository extends AbstractRepository<ClaimDocument> {
  protected readonly logger = new Logger(ClaimRepository.name);

  constructor(
    @InjectModel(Claim.name)
    claimModel: Model<ClaimDocument>
  ) {
    super(claimModel);
  }
}
