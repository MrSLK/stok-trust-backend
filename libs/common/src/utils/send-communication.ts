/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: this.configService.get<string>("google.userEmail"),
        pass: this.configService.get<string>("google.apiKey")
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendEmail({
    to,
    html,
    subject,
    cc = "",
    attachment = ""
  }: {
    to: string | string[];
    html: string;
    subject: string;
    cc?: string | string[];
    attachment?: any;
  }): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>("email.user"),
      to,
      subject,
      html,
      cc,
      attachments: attachment ? [attachment] : []
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      throw new Error(`Unable to send email: ${error?.message}`);
    }
  }
}
