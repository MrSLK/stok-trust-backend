import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TypedConfigModule } from "@common/config/typed-config.module";
import { TypedConfigService } from "@common/config/typed-config.service";

@Module({
  imports: [
    TypedConfigModule,
    MongooseModule.forRootAsync({
      imports: [TypedConfigModule], // 👈 Add this too, ensures proper DI context
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
