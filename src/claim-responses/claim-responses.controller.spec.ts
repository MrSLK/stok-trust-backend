import { Test, TestingModule } from "@nestjs/testing";
import { ClaimResponsesController } from "./claim-responses.controller";
import { ClaimResponsesService } from "./claim-responses.service";

describe("ClaimResponsesController", () => {
  let controller: ClaimResponsesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClaimResponsesController],
      providers: [ClaimResponsesService]
    }).compile();

    controller = module.get<ClaimResponsesController>(ClaimResponsesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
