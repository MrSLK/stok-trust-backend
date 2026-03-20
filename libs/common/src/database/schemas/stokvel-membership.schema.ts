import { MemberRole } from "./../../enums/member-role.enum";
import { StringManipulation } from "./../../utils/string-manipulation";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

const stringUtils = new StringManipulation();

export type StokvelMembershipDocument = HydratedDocument<StokvelMembership> & {
  _id: string;
};

@Schema({ collection: "stokvel-memberships", timestamps: true })
export class StokvelMembership {
  @Prop({ default: () => stringUtils.generateCustomID() })
  _id: string;

  @Prop({ type: String, ref: "users", required: true })
  userId: string;

  @Prop({ type: String, ref: "stokvels", required: true })
  stokvelId: string;

  @Prop({ enum: MemberRole, default: MemberRole.MEMBER })
  role: MemberRole;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Date, default: new Date() })
  joinedAt: Date;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}

// Generate Mongoose schema from NestJS schema
export const StokvelMembershipSchema = SchemaFactory.createForClass(StokvelMembership);
