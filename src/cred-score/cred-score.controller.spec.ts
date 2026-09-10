import { Test, TestingModule } from "@nestjs/testing";
import { CredScoreController } from "./cred-score.controller";
import { CredScoreService } from "./cred-score.service";

describe("CredScoreController", () => {
  let controller: CredScoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CredScoreController],
      providers: [CredScoreService]
    }).compile();

    controller = module.get<CredScoreController>(CredScoreController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
