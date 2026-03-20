import { Controller } from "@nestjs/common";
import { StokvelMembershipService } from "./stokvel-membership.service";

@Controller("stokvel-membership")
export class StokvelMembershipController {
  constructor(private readonly stokvelMembershipService: StokvelMembershipService) {}
}
