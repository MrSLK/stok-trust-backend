import { Controller } from "@nestjs/common";
import { ClaimResponsesService } from "./claim-responses.service";

@Controller("claim-responses")
export class ClaimResponsesController {
  constructor(private readonly claimResponsesService: ClaimResponsesService) {}
}
