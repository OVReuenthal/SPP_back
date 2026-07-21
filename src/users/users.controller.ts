import { Controller, Get, Post, Body, Res, Req } from '@nestjs/common';
import express from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.usersService.login(loginDto);

    if (result.token) {
      res.cookie('Authentication', result.token, {
        httpOnly: true,
        // secure: true, // Enable in production over HTTPS
        sameSite: 'strict',
        maxAge: 43200000, // 12 hour to match JWT_EXPIRATION
      });

      return {
        message: result.message,
        user: result.user,
      };
    }

    return result;
  }

  @Get('validate')
  async validateSession(@Req() req: express.Request) {
    const token = req.cookies?.Authentication as string | undefined;
    if (!token) {
      return { valid: false };
    }
    return this.usersService.verifyToken(token);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('Authentication');
    return this.usersService.logout();
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
