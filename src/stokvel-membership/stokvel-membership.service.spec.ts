import { Test, TestingModule } from "@nestjs/testing";
import { StokvelMembershipService } from "./stokvel-membership.service";

describe("StokvelMembershipService", () => {
  let service: StokvelMembershipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StokvelMembershipService]
    }).compile();

    service = module.get<StokvelMembershipService>(StokvelMembershipService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
