import { DatabaseModule } from "./../../libs/common/src/database/database.module";
import { MongooseModule } from "@nestjs/mongoose";
import { StokvelMembership, StokvelMembershipSchema } from "./../../libs/common/src/database/schemas/stokvel-membership.schema";
import { StokvelMembershipRepository } from "./stokvel-membership.repository";
import { Module } from "@nestjs/common";
import { StokvelMembershipService } from "./stokvel-membership.service";
import { StokvelMembershipController } from "./stokvel-membership.controller";

@Module({
  imports: [DatabaseModule, MongooseModule.forFeature([{ name: StokvelMembership.name, schema: StokvelMembershipSchema }])],
  controllers: [StokvelMembershipController],
  providers: [StokvelMembershipService, StokvelMembershipRepository],
  exports: [StokvelMembershipService, StokvelMembershipRepository]
})
export class StokvelMembershipModule {}
