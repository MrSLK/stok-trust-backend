import { StokvelMembershipModule } from "./../stokvel-membership/stokvel-membership.module";
import { DatabaseModule } from "./../../libs/common/src/database/database.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Stokvel, StokvelSchema } from "./../../libs/common/src/database/schemas/stokvel.schema";
import { StokvelRepository } from "./stokvel.repository";
import { Module } from "@nestjs/common";
import { StokvelService } from "./stokvel.service";
import { StokvelController } from "./stokvel.controller";

@Module({
  imports: [DatabaseModule, MongooseModule.forFeature([{ name: Stokvel.name, schema: StokvelSchema }]), StokvelMembershipModule],
  controllers: [StokvelController],
  providers: [StokvelService, StokvelRepository],
  exports: [StokvelService, StokvelRepository]
})
export class StokvelModule {}
