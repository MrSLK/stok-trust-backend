import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { TypedConfigModule } from "../config/typed-config.module";
import { TypedConfigService } from "../config/typed-config.service";

@Module({
  imports: [
    TypedConfigModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [TypedConfigModule],
      inject: [TypedConfigService],
      useFactory: (configService: TypedConfigService) => ({
        secret: configService.get("jwt.jwtSecret"),
        signOptions: { expiresIn: "7d" }
      })
    })
  ],
  providers: [JwtStrategy],
  exports: [JwtModule, PassportModule, JwtStrategy]
})
export class JwtAuthModule {}
