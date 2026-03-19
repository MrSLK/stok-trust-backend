import { User, UserDocument } from "./../../libs/common/src/database/schemas/user.schema";
import { Injectable, Logger } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { AbstractRepository } from "@common/database";

@Injectable()
export class UserRepository extends AbstractRepository<UserDocument> {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectModel(User.name)
    userModel: Model<UserDocument>
  ) {
    super(userModel);
  }
}
