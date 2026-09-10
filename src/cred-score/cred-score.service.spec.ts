import { Test, TestingModule } from "@nestjs/testing";
import { CredScoreService } from "./cred-score.service";

describe("CredScoreService", () => {
  let service: CredScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CredScoreService]
    }).compile();

    service = module.get<CredScoreService>(CredScoreService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
