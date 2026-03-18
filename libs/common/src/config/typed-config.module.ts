import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import EnvConfiguration from "./env.config";
import { TypedConfigService } from "./typed-config.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfiguration],
      envFilePath: ".env"
    })
  ],
  providers: [TypedConfigService],
  exports: [TypedConfigService]
})
export class TypedConfigModule {}
