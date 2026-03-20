import { StringManipulation } from "./../../utils/string-manipulation";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

const stringUtils = new StringManipulation();

export type PaymentProofDocument = HydratedDocument<PaymentProof> & {
  _id: string;
};

@Schema({ collection: "payment-proofs", timestamps: true })
export class PaymentProof {
  @Prop({ default: () => stringUtils.generateCustomID() })
  _id: string;

  @Prop({ type: String, ref: "monthly-contributions", required: true })
  MonthlyContributionId: string;

  @Prop({ type: String, ref: "users", required: true })
  uploadedBy: string;

  @Prop({ type: String, required: true })
  fileUrl: string;

  @Prop({ type: String, default: null })
  note?: string;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}

// Generate Mongoose schema from NestJS schema
export const PaymentProofSchema = SchemaFactory.createForClass(PaymentProof);
