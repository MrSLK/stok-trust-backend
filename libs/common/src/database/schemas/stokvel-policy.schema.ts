import { StringManipulation } from "./../../utils/string-manipulation";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Stokvel } from "./stokvel.schema";
import { User } from "./user.schema";

const stringUtils = new StringManipulation();

export type StokvelPolicyDocument = HydratedDocument<StokvelPolicy> & {
  _id: string;
};

@Schema({ collection: "stokvel-policies", timestamps: true })
export class StokvelPolicy {
  @Prop({ default: () => stringUtils.generateCustomID() })
  _id: string;

  @Prop({ type: String, required: true })
  purpose: string;

  @Prop({ type: String, ref: Stokvel.name, required: true })
  stokvelId: string;

  @Prop({ type: String, required: true })
  membershipRules: string;

  @Prop({ type: String, required: true })
  contributionRules: string;

  @Prop({ type: String, required: true })
  payoutRules: string;

  @Prop({ type: String, required: true })
  meetingRules: string;

  @Prop({ type: String, required: true })
  disputeRules: string;

  @Prop({ type: String, required: true })
  constitutionAmendmentRules: string;

  // 🔥 Versioning
  @Prop({ default: 1 })
  version: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: String, ref: User.name })
  createdBy: string;
}

export const StokvelPolicySchema = SchemaFactory.createForClass(StokvelPolicy);
