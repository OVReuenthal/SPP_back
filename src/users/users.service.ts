import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async create(createUserDto: CreateUserDto) {
    const sql = `INSERT INTO users (user_name, password) VALUES ($1, $2) RETURNING *`;
    return await this.dataSource.query(sql, [
      createUserDto.user_name,
      createUserDto.password,
    ]);
  }

  async login(loginDto: LoginDto) {
    const sql = `SELECT * FROM users WHERE user_name = $1 AND password = $2`;
    const result = await this.dataSource.query(sql, [loginDto.user_name, loginDto.password]);
    if (result.length === 0) {
      return { message: 'Invalid credentials' };
    }
    return { message: 'Login successful', user: result[0] };
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
