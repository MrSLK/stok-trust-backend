import { TypedConfigService } from "./../config/typed-config.service";
import { TypedConfigModule } from "./../config/typed-config.module";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    TypedConfigModule,
    MongooseModule.forRootAsync({
      imports: [TypedConfigModule],
      useFactory: (configService: TypedConfigService) => {
        const MONGODB_URI = configService.get("mongodb.database.MONGODB_URI");
        return {
          uri: MONGODB_URI
        };
      },
      inject: [TypedConfigService]
    })
  ],
  exports: [MongooseModule]
})
export class DatabaseModule {}
