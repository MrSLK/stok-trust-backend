import { StokvelMembershipModule } from "./../stokvel-membership/stokvel-membership.module";
import { DatabaseModule } from "./../../libs/common/src/database/database.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Stokvel, StokvelSchema } from "./../../libs/common/src/database/schemas/stokvel.schema";
import { StokvelPolicy, StokvelPolicySchema } from "./../../libs/common/src/database/schemas/stokvel-policy.schema";
import { MonthlyContribution, MonthlyContributionSchema } from "./../../libs/common/src/database/schemas/monthly-contribution.schema";
import { StokvelMembership, StokvelMembershipSchema } from "./../../libs/common/src/database/schemas/stokvel-membership.schema";
import { StokvelInvite, StokvelInviteSchema } from "./../../libs/common/src/database/schemas/stokvel-invite.schema";
import { StokvelRepository } from "./stokvel.repository";
import { Module } from "@nestjs/common";
import { StokvelService } from "./stokvel.service";
import { StokvelController } from "./stokvel.controller";
import { ConfigService } from "@nestjs/config";
import { CommunicationService } from "./../../libs/common/src/utils/send-communication";

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
