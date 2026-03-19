import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { DatabaseModule, User, UserSchema } from "@common/database";
import { MongooseModule } from "@nestjs/mongoose";
import { UserRepository } from "./users.repository";

@Module({
  imports: [DatabaseModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository]
})
export class UsersModule {}
