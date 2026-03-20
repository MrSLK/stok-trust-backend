import { Test, TestingModule } from "@nestjs/testing";
import { StokvelMembershipController } from "./stokvel-membership.controller";
import { StokvelMembershipService } from "./stokvel-membership.service";

describe("StokvelMembershipController", () => {
  let controller: StokvelMembershipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StokvelMembershipController],
      providers: [StokvelMembershipService]
    }).compile();

    controller = module.get<StokvelMembershipController>(StokvelMembershipController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
