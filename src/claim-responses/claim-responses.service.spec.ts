import { Test, TestingModule } from "@nestjs/testing";
import { ClaimResponsesService } from "./claim-responses.service";

describe("ClaimResponsesService", () => {
  let service: ClaimResponsesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClaimResponsesService]
    }).compile();

    service = module.get<ClaimResponsesService>(ClaimResponsesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
