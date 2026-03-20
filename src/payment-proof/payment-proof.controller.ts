import { Controller } from "@nestjs/common";
import { PaymentProofService } from "./payment-proof.service";

@Controller("payment-proof")
export class PaymentProofController {
  constructor(private readonly paymentProofService: PaymentProofService) {}
}
