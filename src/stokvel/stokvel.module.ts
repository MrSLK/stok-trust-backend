import { StokvelMembershipModule } from "./../stokvel-membership/stokvel-membership.module";
import { DatabaseModule } from "./../../libs/common/src/database/database.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Stokvel, StokvelSchema } from "./../../libs/common/src/database/schemas/stokvel.schema";
import { StokvelRepository } from "./stokvel.repository";
import { Module } from "@nestjs/common";
import { StokvelService } from "./stokvel.service";
import { StokvelController } from "./stokvel.controller";
import {
  StokvelPolicy,
  StokvelPolicySchema,
  StokvelMembership,
  StokvelMembershipSchema,
  MonthlyContribution,
  MonthlyContributionSchema,
  StokvelInvite,
  StokvelInviteSchema
} from "@common/database";
import { CommunicationService } from "@common/utils/send-communication";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Stokvel.name, schema: StokvelSchema },
      { name: StokvelPolicy.name, schema: StokvelPolicySchema },
      { name: MonthlyContribution.name, schema: MonthlyContributionSchema },
      { name: StokvelMembership.name, schema: StokvelMembershipSchema },
      { name: StokvelInvite.name, schema: StokvelInviteSchema }
    ]),
    StokvelMembershipModule
  ],
  controllers: [StokvelController],
  providers: [StokvelService, StokvelRepository, ConfigService, CommunicationService],
  exports: [StokvelService, StokvelRepository]
})
export class StokvelModule {}
