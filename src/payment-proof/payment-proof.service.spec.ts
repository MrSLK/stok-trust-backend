import { Test, TestingModule } from "@nestjs/testing";
import { PaymentProofService } from "./payment-proof.service";

describe("PaymentProofService", () => {
  let service: PaymentProofService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentProofService]
    }).compile();

    service = module.get<PaymentProofService>(PaymentProofService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
