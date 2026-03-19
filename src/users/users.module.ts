import { User, UserSchema } from "./../../libs/common/src/database/schemas/user.schema";
import { DatabaseModule } from "./../../libs/common/src/database/database.module";
import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { UserRepository } from "./users.repository";

@Module({
  imports: [DatabaseModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository]
})
export class UsersModule {}
