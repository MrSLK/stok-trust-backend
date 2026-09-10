import { Module } from "@nestjs/common";
import { ClaimService } from "./claim.service";
import { ClaimController } from "./claim.controller";
import { DatabaseModule } from "./../../libs/common/src/database/database.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Claim, ClaimSchema } from "./../../libs/common/src/database/schemas/claims.schema";
import { StokvelMembershipModule } from "./../stokvel-membership/stokvel-membership.module";
import { ClaimRepository } from "./claim.repository";

@Module({
  imports: [DatabaseModule, MongooseModule.forFeature([{ name: Claim.name, schema: ClaimSchema }]), StokvelMembershipModule],
  controllers: [ClaimController],
  providers: [ClaimService, ClaimRepository]
})
export class ClaimModule {}
