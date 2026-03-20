import { StringManipulation } from "./../../utils/string-manipulation";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

const stringUtils = new StringManipulation();

export enum ClaimStatus {
  OPEN = "open",
  UNDER_REVIEW = "under-review",
  RESOLVED = "resolved",
  REJECTED = "rejected"
}

export type ClaimDocument = HydratedDocument<Claim> & {
  _id: string;
};

@Schema({ collection: "claims", timestamps: true })
@Schema({ timestamps: true })
export class Claim {
  @Prop({ default: () => stringUtils.generateCustomID() })
  _id: string;

  @Prop({ type: String, ref: "monthly-contributions", required: true })
  MonthlyContributionId: string;

  @Prop({ type: String, ref: "stokvels", required: true })
  stokvelId: string;

  @Prop({ type: String, ref: "users", required: true })
  uploadedBy: string;

  @Prop({ required: true })
  reason: string;

  @Prop({ enum: ClaimStatus, default: ClaimStatus.OPEN })
  status: ClaimStatus;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}

// Generate Mongoose schema from NestJS schema
export const ClaimSchema = SchemaFactory.createForClass(Claim);
