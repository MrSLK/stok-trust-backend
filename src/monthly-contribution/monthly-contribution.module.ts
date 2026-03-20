import { Module } from "@nestjs/common";
import { MonthlyContributionService } from "./monthly-contribution.service";
import { MonthlyContributionController } from "./monthly-contribution.controller";

@Module({
  controllers: [MonthlyContributionController],
  providers: [MonthlyContributionService]
})
export class MonthlyContributionModule {}
