import { Test, TestingModule } from "@nestjs/testing";
import { StokvelController } from "./stokvel.controller";
import { StokvelService } from "./stokvel.service";

describe("StokvelController", () => {
  let controller: StokvelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StokvelController],
      providers: [StokvelService]
    }).compile();

    controller = module.get<StokvelController>(StokvelController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
