import { Module } from "@nestjs/common";
import { PaymentProofService } from "./payment-proof.service";
import { PaymentProofController } from "./payment-proof.controller";

@Module({
  controllers: [PaymentProofController],
  providers: [PaymentProofService]
})
export class PaymentProofModule {}
