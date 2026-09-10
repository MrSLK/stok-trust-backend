import { StringManipulation } from "./../../utils/string-manipulation";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { ClaimStatus } from "../../enums/claim-status.enum";

const stringUtils = new StringManipulation();

export type ClaimDocument = HydratedDocument<Claim> & {
  _id: string;
};

@Schema({ _id: false })
class RejectionDetails {
  @Prop({ type: String, required: true })
  reason: string;

  @Prop({ type: String, ref: "users", required: true })
  rejectedBy: string;

  @Prop({ type: Date, default: new Date() })
  rejectedAt: Date;
}

@Schema({ collection: "claims", timestamps: true })
@Schema({ timestamps: true })
export class Claim {
  @Prop({ default: () => stringUtils.generateCustomID() })
  _id: string;

  @Prop({ type: String, ref: "stokvels", required: true })
  stokvelId: string;

  @Prop({ type: String, ref: "users", required: true })
  createdBy: string;

  @Prop({ type: String, ref: "users", required: true })
  defendantId: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ enum: ClaimStatus, default: ClaimStatus.OPEN })
  status: ClaimStatus;

  @Prop({ type: RejectionDetails, default: null })
  RejectionDetails?: RejectionDetails;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}

// Generate Mongoose schema from NestJS schema
export const ClaimSchema = SchemaFactory.createForClass(Claim);
