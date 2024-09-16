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
import { OtpForgotPasswordService } from '../services/otp-forgot-password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
    private readonly otpForgotPasswordService: OtpForgotPasswordService,
  ) {}

  // Đăng ký người dùng
  async register(email: string, password: string) {
    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException({
        status: 'error',
        message: 'Email đã được đăng ký',
        data: null,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const [hashedPassword, hashedOtp] = await Promise.all([
      bcrypt.hash(password, 8),
      bcrypt.hash(otp, 8),
    ]);

    // Tạo OTP và gửi email không đồng bộ
    await Promise.all([
      this.otpService.createOtp(email, hashedOtp, hashedPassword),
      this.emailService.sendVerificationEmail(email, otp),
    ]);

    return {
      status: 'success',
      message: 'OTP đã được gửi đến email của bạn.',
      data: null,
    };
  }

  // Xác minh OTP và tạo người dùng
  async verifyOtp(email: string, otp: string) {
    const otpRecord = await this.otpService.findOtp(email);

    if (!otpRecord) {
      throw new BadRequestException({
        status: 'error',
        message: 'OTP không hợp lệ',
        data: null,
      });
    }

    if (this.otpService.isOtpExpired(otpRecord.expiresAt)) {
      throw new BadRequestException({
        status: 'error',
        message: 'OTP đã hết hạn',
        data: null,
      });
    }

    if (!(await this.otpService.isOtpValid(otp, otpRecord.otp))) {
      throw new BadRequestException({
        status: 'error',
        message: 'OTP không khớp, vui lòng thử lại',
        data: null,
      });
    }

    // Đặt link ảnh demo tạm thời
    const profilePictureUrl = 'https://www.gravatar.com/avatar/?d=mp'; // Link ảnh icon người dùng demo

    // Tạo người dùng mới với dữ liệu từ bảng OTP và ảnh demo
    const newUser = await this.userService.createUser(
      email,
      otpRecord.password,
      profilePictureUrl,
    );

    // Xóa OTP sau khi tạo tài khoản người dùng
    await this.otpService.deleteOtp(email);

    return {
      status: 'success',
      message: 'Người dùng đã được xác minh và đăng ký thành công.',
      data: { userId: newUser.id, email: newUser.email },
    };
  }

  async login(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('Email không tồn tại');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Mật khẩu không hợp lệ, vui lòng thử lại');
    }

    // Tạo payload cho token
    const payload = {
      sub: user.id,
      email: user.email,
    };

    // Tạo token JWT
    const token = this.jwtService.sign(payload);

    // Trả về token và thông tin chi tiết của người dùng
    return {
      status: 'success',
      message: 'Đăng nhập thành công.',
      data: {
        token: token,
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          companyName: user.companyName,
          address: user.address,
          businessCode: user.businessCode,
          taxCode: user.taxCode,
          representativeName: user.representativeName,
          representativeUrl: user.representativeUrl,
          profilePictureUrl: user.profilePictureUrl,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException({
        status: 'error',
        message: 'Email không tồn tại trong hệ thống',
        data: null,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.otpForgotPasswordService.createOtp(email, otp);
    await this.emailService.sendForgotPasswordEmail(email, otp);

    return {
      status: 'success',
      message: 'OTP đã được gửi đến email của bạn.',
      data: null,
    };
  }

  // Xác thực OTP để đặt lại mật khẩu
  async verifyOtpReset(email: string, otp: string) {
    const otpRecord = await this.otpForgotPasswordService.findOtp(email);

    if (!otpRecord) {
      throw new BadRequestException({
        status: 'error',
        message: 'OTP không hợp lệ',
        data: null,
      });
    }

    if (this.otpForgotPasswordService.isOtpExpired(otpRecord.expiresAt)) {
      throw new BadRequestException({
        status: 'error',
        message: 'OTP đã hết hạn',
        data: null,
      });
    }

    if (!(await this.otpForgotPasswordService.isOtpValid(otp, otpRecord.otp))) {
      throw new BadRequestException({
        status: 'error',
        message: 'OTP không khớp, vui lòng thử lại',
        data: null,
      });
    }

    const token = this.jwtService.sign({ email });

    await this.otpForgotPasswordService.deleteOtp(email);

    return {
      status: 'success',
      message: 'OTP xác minh thành công, mã token đã được tạo.',
      token,
    };
  }

  // Đặt lại mật khẩu
  async resetPassword(token: string, newPassword: string) {
    const decoded = this.jwtService.verify(token);
    const email = decoded.email;

    if (!email) {
      throw new BadRequestException({
        status: 'error',
        message: 'Mã token không hợp lệ hoặc đã hết hạn.',
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 8);
    await this.userService.updatePasswordByEmail(email, hashedPassword);

    return {
      status: 'success',
      message: 'Mật khẩu đã được đặt lại thành công.',
      data: null,
    };
  }
}
