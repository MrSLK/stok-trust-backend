import { StringManipulation } from "./../../utils/string-manipulation";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

const stringUtils = new StringManipulation();

export type StokvelDocument = HydratedDocument<Stokvel> & {
  _id: string;
};

@Schema({ collection: "stokvels", timestamps: true })
export class Stokvel {
  @Prop({ default: () => stringUtils.generateCustomID() })
  _id: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  location: string;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: Number, required: true })
  monthlyContribution: number;

  @Prop({ type: String, default: null })
  nasasaRegistrationNumber?: string;

  @Prop({ type: String, ref: "users", required: true })
  createdBy: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}

// Generate Mongoose schema from NestJS schema
export const StokvelSchema = SchemaFactory.createForClass(Stokvel);
