import { StringManipulation } from "./../../utils/string-manipulation";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

const stringUtils = new StringManipulation();

export type CredScoreDocument = HydratedDocument<CredScore> & {
  _id: string;
};

@Schema({ collection: "cred-scores", timestamps: true })
export class CredScore {
  @Prop({ default: () => stringUtils.generateCustomID() })
  _id: string;

  @Prop({ type: String, ref: "users", required: true })
  userId: string;

  // 📊 Payments
  @Prop({ default: 0 }) onTimePayments: number;
  @Prop({ default: 0 }) latePayments: number;
  @Prop({ default: 0 }) missedPayments: number;

  // ⚖️ Claims
  @Prop({ default: 0 }) activeClaims: number;
  @Prop({ default: 0 }) resolvedClaims: number;
  @Prop({ default: 0 }) withdrawnClaims: number;

  // 📅 Consistency
  @Prop({ default: 0 }) consistentPeriods: number;

  // 🔥 Streak tracking
  @Prop({ default: 0 }) currentStreak: number;
  @Prop({ default: 0 }) longestStreak: number;

  // ⭐ Final Score
  @Prop({ default: 100 }) credScore: number;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}

export const CredScoreSchema = SchemaFactory.createForClass(CredScore);
