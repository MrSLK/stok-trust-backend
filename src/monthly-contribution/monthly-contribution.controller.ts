import { Controller } from "@nestjs/common";
import { MonthlyContributionService } from "./monthly-contribution.service";

@Controller("monthly-contribution")
export class MonthlyContributionController {
  constructor(private readonly monthlyContributionService: MonthlyContributionService) {}
}
