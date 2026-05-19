import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import express from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
      
      const { token, ...responseData } = result;
      return responseData;
    }
    
    return result;
  }

  @Get('validate')
  async validateSession(@Req() req: express.Request) {
    const token = req.cookies?.Authentication;
    if (!token) {
      return { valid: false };
    }
    return this.usersService.verifyToken(token);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
