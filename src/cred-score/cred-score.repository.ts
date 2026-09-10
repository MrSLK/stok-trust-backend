import { CredScore, CredScoreDocument } from "../../libs/common/src/database/schemas/cred-score.schema";
import { Injectable, Logger } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { AbstractRepository } from "../../libs/common/src/database/abstract.repository";

@Injectable()
export class CredScoreRepository extends AbstractRepository<CredScoreDocument> {
  protected readonly logger = new Logger(CredScoreRepository.name);

  constructor(
    @InjectModel(CredScore.name)
    credScoreModel: Model<CredScoreDocument>
  ) {
    super(credScoreModel);
  }
}
