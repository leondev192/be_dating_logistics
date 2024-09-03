// src/modules/auth/services/auth.service.ts
import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OtpService } from './otp.service';
import { EmailService } from './email.service';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
  ) {}

  // Đăng ký người dùng
  async register(email: string, password: string) {
    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email đã được đăng ký');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await this.otpService.createOtp(email, hashedOtp, hashedPassword);
    await this.emailService.sendVerificationEmail(email, otp);

    return { message: 'OTP đã được gửi đến email của bạn.' };
  }

  // Xác minh OTP
  async verifyOtp(email: string, otp: string) {
    const otpRecord = await this.otpService.findOtp(email);

    if (!otpRecord) {
      throw new BadRequestException('OTP không hợp lệ');
    }

    if (this.otpService.isOtpExpired(otpRecord.expiresAt)) {
      throw new BadRequestException('OTP đã hết hạn');
    }

    if (!(await this.otpService.isOtpValid(otp, otpRecord.otp))) {
      throw new BadRequestException('OTP không khớp, vui lòng thử lại');
    }

    await this.userService.createUser(email, otpRecord.password);
    await this.otpService.deleteOtp(email);

    return { message: 'Người dùng đã được xác minh và đăng ký thành công.' };
  }

  // Đăng nhập người dùng
  async login(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Thông tin đăng nhập không hợp lệ');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}
