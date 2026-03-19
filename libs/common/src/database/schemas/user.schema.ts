import { StringManipulation } from "@common/utils/string-manipulation";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

const stringUtils = new StringManipulation();

export type UserDocument = HydratedDocument<User> & {
  _id: string;
};

@Schema({ _id: false })
class Profile {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true })
  cellNumber: string;

  @Prop({ type: String, required: true, lowercase: true, unique: true })
  email: string;

  @Prop({ type: Boolean, default: false })
  cellNumberVerified?: boolean;

  @Prop({ type: String, default: null })
  idNumber?: string;

  @Prop({ type: String, default: null })
  passportNumber?: string;
}

@Schema({ _id: false })
class Services {
  @Prop({ type: String, required: true })
  password: string;
}

@Schema({ _id: false })
class Verifications {
  @Prop({ type: Boolean, default: false })
  email?: boolean;

  @Prop({ type: Boolean, default: false })
  cellNumber?: boolean;
}

@Schema({ collection: "users", timestamps: true })
export class User {
  @Prop({ default: () => stringUtils.generateCustomID() })
  _id: string;

  @Prop({ type: Services })
  services: Services;

  @Prop({ type: Profile })
  profile: Profile;

  @Prop({ type: Verifications })
  verifications?: Verifications;

  @Prop({ type: String, required: true, enum: ["admin", "user"] })
  role: string;

  @Prop({ type: Boolean, default: true })
  isAccountActive: boolean;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}

// Generate Mongoose schema from NestJS schema
export const UserSchema = SchemaFactory.createForClass(User);
