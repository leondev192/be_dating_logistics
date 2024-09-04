// src/modules/auth/controllers/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dtos/register/register.dto';
import { VerifyOtpDto } from '../dtos/register/verify-otp.dto';
import { LoginDto } from '../dtos/login/login.dto';
import { ForgotPasswordDto } from '../dtos/forgotpassword/forgot-password.dto';
import { VerifyOtpResetDto } from '../dtos/forgotpassword/verify-otp-reset.dto';
import { ResetPasswordDto } from '../dtos/forgotpassword/reset-password.dto';

@ApiTags('Auth') // Tag giúp phân loại các nhóm API
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'OTP has been sent to your email.' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto.email, registerDto.password);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP' })
  @ApiResponse({
    status: 200,
    description: 'User has been verified successfully.',
  })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Access token returned' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }
  @Post('forgot-password')
  @ApiOperation({ summary: 'Quên mật khẩu' })
  @ApiResponse({
    status: 200,
    description: 'OTP đã được gửi đến email của bạn.',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('verify-otp-forgot-password')
  @ApiOperation({ summary: 'Xác minh OTP để đặt lại mật khẩu' })
  @ApiResponse({
    status: 200,
    description: 'OTP xác minh thành công, mã token được tạo.',
  })
  async verifyOtpReset(@Body() verifyOtpResetDto: VerifyOtpResetDto) {
    return this.authService.verifyOtpReset(
      verifyOtpResetDto.email,
      verifyOtpResetDto.otp,
    );
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Đặt lại mật khẩu' })
  @ApiResponse({
    status: 200,
    description: 'Mật khẩu đã được đặt lại thành công.',
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }
}
