import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { StokvelModule } from "./stokvel/stokvel.module";
import { ClaimResponsesModule } from "./claim-responses/claim-responses.module";
import { ClaimModule } from "./claim/claim.module";
import { MonthlyContributionModule } from "./monthly-contribution/monthly-contribution.module";
import { PaymentProofModule } from "./payment-proof/payment-proof.module";
import { StokvelMembershipModule } from "./stokvel-membership/stokvel-membership.module";
import { JwtAuthModule } from "./../libs/common/src/jwt-auth/jwt-auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtAuthModule,
    UsersModule,
    AuthModule,
    StokvelModule,
    ClaimResponsesModule,
    ClaimModule,
    MonthlyContributionModule,
    PaymentProofModule,
    StokvelMembershipModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
