import { StringManipulation } from "./../../utils/string-manipulation";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export enum ContributionStatus {
  PENDING = "pending",
  PAID = "paid",
  OVERDUE = "overdue"
}

const stringUtils = new StringManipulation();

export type MonthlyContributionDocument = HydratedDocument<MonthlyContribution> & {
  _id: string;
};

@Schema({ collection: "monthly-contributions", timestamps: true })
export class MonthlyContribution {
  @Prop({ default: () => stringUtils.generateCustomID() })
  _id: string;

  @Prop({ type: String, ref: "users", required: true })
  userId: string;

  @Prop({ type: String, ref: "Stokvels", required: true })
  stokvelId: string;

  @Prop({ type: String, required: true })
  month: string;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ enum: ContributionStatus, default: ContributionStatus.PENDING })
  status: ContributionStatus;

  @Prop()
  paidAt?: Date;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}

// Generate Mongoose schema from NestJS schema
export const MonthlyContributionSchema = SchemaFactory.createForClass(MonthlyContribution);
