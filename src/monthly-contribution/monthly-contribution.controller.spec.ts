import { Test, TestingModule } from "@nestjs/testing";
import { MonthlyContributionController } from "./monthly-contribution.controller";
import { MonthlyContributionService } from "./monthly-contribution.service";

describe("MonthlyContributionController", () => {
  let controller: MonthlyContributionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonthlyContributionController],
      providers: [MonthlyContributionService]
    }).compile();

    controller = module.get<MonthlyContributionController>(MonthlyContributionController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
