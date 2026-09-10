import { StringManipulation } from "./../../utils/string-manipulation";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { PaymentStatus } from "@common/enums/payment-status.enum";
import { MonthlyContribution } from "./monthly-contribution.schema";
import { User } from "./user.schema";

const stringUtils = new StringManipulation();

export type PaymentProofDocument = HydratedDocument<PaymentProof> & {
  _id: string;
};

@Schema({ collection: "payment-proofs", timestamps: true })
export class PaymentProof {
  @Prop({ default: () => stringUtils.generateCustomID() })
  _id: string;

  @Prop({ type: String, ref: MonthlyContribution.name, required: true })
  MonthlyContributionId: string;

  @Prop({ type: String, ref: User.name, required: true })
  uploadedBy: string;

  @Prop({ type: String, required: true })
  fileUrl: string;

  @Prop({
    required: true,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING
  })
  status: PaymentStatus;

  @Prop({ type: String, default: null })
  note?: string;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}

// Generate Mongoose schema from NestJS schema
export const PaymentProofSchema = SchemaFactory.createForClass(PaymentProof);
