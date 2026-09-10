import { MemberRole } from "./../../enums/member-role.enum";
import { StringManipulation } from "./../../utils/string-manipulation";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { User } from "./user.schema";
import { Stokvel } from "./stokvel.schema";

const stringUtils = new StringManipulation();

export type StokvelMembershipDocument = HydratedDocument<StokvelMembership> & {
  _id: string;
};

@Schema({ collection: "stokvel-memberships", timestamps: true })
export class StokvelMembership {
  @Prop({ default: () => stringUtils.generateCustomID() })
  _id: string;

  @Prop({ required: true, type: String, ref: User.name })
  userId: string;

  @Prop({ required: true, type: String, ref: Stokvel.name })
  stokvelId: string;

  @Prop({
    required: true,
    enum: Object.values(MemberRole),
    default: MemberRole.MEMBER
  })
  role: MemberRole;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  joinedAt: Date;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}

// Generate Mongoose schema from NestJS schema
export const StokvelMembershipSchema = SchemaFactory.createForClass(StokvelMembership);
