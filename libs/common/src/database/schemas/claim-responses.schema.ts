import { StringManipulation } from "./../../utils/string-manipulation";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

const stringUtils = new StringManipulation();

export type ClaimResponseDocument = HydratedDocument<ClaimResponse> & {
  _id: string;
};

@Schema({ collection: "claim-responses", timestamps: true })
export class ClaimResponse {
  @Prop({ default: () => stringUtils.generateCustomID() })
  _id: string;
  @Prop({ type: String, ref: "claims", required: true })
  claimId: string;

  @Prop({ type: String, ref: "users", required: true })
  userId: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}

// Generate Mongoose schema from NestJS schema
export const ClaimResponseSchema = SchemaFactory.createForClass(ClaimResponse);
