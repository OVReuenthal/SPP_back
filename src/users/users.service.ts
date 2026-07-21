import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as stats from 'simple-statistics';

@Injectable()
export class UsersService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    const sql = `INSERT INTO usuarios (user_name, password, rol) VALUES ($1, $2, $3) RETURNING *`;
    return await this.dataSource.query(sql, [
      createUserDto.user_name,
      hashedPassword,
      createUserDto.rol,
    ]);
  }

  async login(loginDto: LoginDto) {
    // 1. Fetch user by user_name only
    const sql = `SELECT * FROM usuarios WHERE user_name = $1`;
    const result = await this.dataSource.query(sql, [loginDto.user_name]);

    if (result.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = result[0];

    // 2. Compare the provided password with the hashed password from the DB
    const isPasswordMatching = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      username: user.user_name,
      id: user.user_id,
      rol: user.rol,
    };
    const token = await this.jwtService.signAsync(payload);

    // 3. Remove the password before returning the user object
    const { password, ...safeUser } = user;

    return { message: 'Login successful', user: safeUser, token };
  }

  async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return { valid: true, user: payload };
    } catch (error) {
      return { valid: false };
    }
  }

  async logout() {
    return { message: 'Logout successful' };
  }

  async findAll() {
    const sql = `SELECT user_name, rol FROM usuarios`;
    return await this.dataSource.query(sql);
  }
}
