import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class CommunicationService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const auth = {
      user: this.configService.get<string>("google.userEmail"),
      pass: this.configService.get<string>("google.apiKey")
    };

    console.log("auth =>", auth);
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth,
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
