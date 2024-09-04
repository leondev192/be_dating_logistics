import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendVerificationEmail(email: string, otp: string) {
    try {
      // Gửi email không đồng bộ để tránh chờ đợi lâu
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Mã OTP xác nhận tài khoản',
        text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 5 phút.`,
      });
      console.log(`Email sent successfully to ${email}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
  async sendForgotPasswordEmail(email: string, otp: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Quên mật khẩu - Mã xác thực',
        text: `Mã OTP để đặt lại mật khẩu của bạn là: ${otp}. Mã có hiệu lực trong 5 phút.`,
      });
      console.log('Email OTP đã được gửi.');
    } catch (error) {
      console.error('Gửi email thất bại:', error);
      throw new Error('Không thể gửi email OTP.');
    }
  }
}
