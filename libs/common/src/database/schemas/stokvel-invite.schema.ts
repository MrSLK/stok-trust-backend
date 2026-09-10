import { StringManipulation } from "./../../utils/string-manipulation";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Stokvel } from "./stokvel.schema";
import { User } from "./user.schema";

const stringUtils = new StringManipulation();

export type StokvelInviteDocument = HydratedDocument<StokvelInvite> & {
  _id: string;
};

@Schema({ collection: "stokvel-invites", timestamps: true })
export class StokvelInvite {
  @Prop({ default: () => stringUtils.generateCustomID() })
  _id: string;

  @Prop({ type: String, required: true, trim: true })
  firstName: string;

  @Prop({ type: String, required: true, trim: true })
  lastName: string;

  @Prop({ type: String, required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ type: String, required: true, trim: true })
  cellNumber: string;

  // Shown in the UI and embedded in the invite link
  @Prop({ type: String, required: true })
  inviteCode: string;

  @Prop({ type: String, ref: Stokvel.name, required: true })
  stokvelId: string;

  @Prop({ type: Boolean, default: false })
  inviteAccepted: boolean;

  // null until the invitee registers / uses the link
  @Prop({ type: String, ref: User.name, default: null })
  userId: string | null;

  @Prop({ type: String, ref: User.name })
  invitedBy: string;
}

export const StokvelInviteSchema = SchemaFactory.createForClass(StokvelInvite);

// Fast lookup when checking for duplicate pending invites
StokvelInviteSchema.index({ stokvelId: 1, email: 1 });
