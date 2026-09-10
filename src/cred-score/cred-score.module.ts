import { Module } from "@nestjs/common";
import { CredScoreService } from "./cred-score.service";
import { CredScoreController } from "./cred-score.controller";
import { DatabaseModule } from "./../../libs/common/src/database/database.module";
import { MongooseModule } from "@nestjs/mongoose";
import { CredScoreRepository } from "./cred-score.repository";
import { CredScore, CredScoreSchema } from "./../../libs/common/src/database/schemas/cred-score.schema";
import { CredScoreCalculator } from "./../../libs/common/src/utils/cred-score-calculator";

@Module({
  imports: [DatabaseModule, MongooseModule.forFeature([{ name: CredScore.name, schema: CredScoreSchema }])],
  providers: [CredScoreService, CredScoreCalculator, CredScoreRepository],
  controllers: [CredScoreController],
  exports: [CredScoreService, CredScoreRepository]
})
export class CredScoreModule {}
