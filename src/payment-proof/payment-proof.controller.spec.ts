import { Test, TestingModule } from "@nestjs/testing";
import { PaymentProofController } from "./payment-proof.controller";
import { PaymentProofService } from "./payment-proof.service";

describe("PaymentProofController", () => {
  let controller: PaymentProofController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentProofController],
      providers: [PaymentProofService]
    }).compile();

    controller = module.get<PaymentProofController>(PaymentProofController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
