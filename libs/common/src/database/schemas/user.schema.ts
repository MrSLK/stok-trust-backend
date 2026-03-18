import { StringManipulation } from "@common/utils/string-manipulation";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

const stringUtils = new StringManipulation();

export type UserDocument = HydratedDocument<User>;

@Schema({ _id: false })
class Profile {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true })
  cellNumber: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: Boolean, default: false })
  cellNumberVerified?: boolean;

  @Prop({ type: String, default: null })
  idNumber?: string;

  @Prop({ type: String, default: null })
  passportNumber?: string;

  @Prop({ type: String, default: null })
  businessRegistrationNumber?: string;

  @Prop({ type: [String], default: null })
  secondaryEmails?: string[];
}

@Schema({ _id: false })
class Password {
  @Prop({ type: String, required: true })
  bcrypt: string;
}

@Schema({ _id: false })
export class Resume {
  @Prop([String])
  loginTokens: string[];
}

@Schema({ _id: false })
export class Email {
  @Prop({
    type: String,
    lowercase: true,
    required: true
  })
  address: string;

  @Prop()
  verified: boolean;
}

@Schema({ _id: false })
class Otp {
  @Prop({ type: String })
  code: string;

  @Prop({ type: Date })
  expiresIn: Date;

  @Prop({ type: String, enum: ["ACCOUNT-RECOVERY-VERIFICATION", "EMAIL-VERIFICATION", "CELL-NUMBER-VERIFICATION"] })
  purpose: string;
}

@Schema({ collection: "users", timestamps: true })
export class User {
  @Prop({ default: () => stringUtils.generateCustomID() })
  _id: string;

  @Prop([Email])
  emails: Email[];

  @Prop()
  profile: Profile;
  
  @Prop({ type: Password })
  Password: Password;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  isDisabled: boolean;

  @Prop()
  roles: string[];

  @Prop({ type: Otp, default: null })
  otp?: Otp;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}

// Generate Mongoose schema from NestJS schema
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual("id").get(function () {
  return this._id;
});
