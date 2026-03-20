import { Test, TestingModule } from "@nestjs/testing";
import { MonthlyContributionService } from "./monthly-contribution.service";

describe("MonthlyContributionService", () => {
  let service: MonthlyContributionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonthlyContributionService]
    }).compile();

    service = module.get<MonthlyContributionService>(MonthlyContributionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
