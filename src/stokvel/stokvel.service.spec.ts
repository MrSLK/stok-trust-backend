import { Test, TestingModule } from "@nestjs/testing";
import { StokvelService } from "./stokvel.service";

describe("StokvelService", () => {
  let service: StokvelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StokvelService]
    }).compile();

    service = module.get<StokvelService>(StokvelService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
