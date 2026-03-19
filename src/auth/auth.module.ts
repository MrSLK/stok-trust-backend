import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt"; // 1. Add this import
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        // Ensure "JWT_SECRET" matches your .env file key exactly
        secret: configService.get<string>("jwtSecret"),
        signOptions: { expiresIn: "48h" }
      })
    })
  ] as any[], // 3. Cast as any[] to fix the "Unsafe assignment" lint error
  controllers: [AuthController],
  providers: [AuthService] // 2. Remove ConfigService from here
})
export class AuthModule {}
