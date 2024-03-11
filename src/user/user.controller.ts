import {
  HttpException,
  Param,
  Put,
  Get,
  HttpStatus,
  ValidationPipe,
  Post,
  Body,
  Delete,
  Controller,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { UpdatePasswordDTO } from './dto/password.dto';
import { User } from './user.interface';
import { CreateUserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.getUserById(id);
    return this.mapUserToResponse(user);
  }

  @Post()
  async create(
    @Body(ValidationPipe) dto: CreateUserDTO,
  ): Promise<Omit<User, 'password'>> {
    const newUser = await this.userService.create(dto);
    return this.mapUserToResponse(newUser);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(ValidationPipe) updatePasswordDTO: UpdatePasswordDTO,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.getUserById(id);
    this.validateUserPassword(user, updatePasswordDTO.oldPassword);

    const updatedUser = await this.userService.update(
      user.id,
      updatePasswordDTO,
    );

    return this.mapUserToResponse(updatedUser);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = await this.getUserById(id);
    this.userService.delete(user.id);
  }

  private async getUserById(id: string): Promise<User> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new HttpException(
        'User with specified id not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  private validateUserPassword(user: User, oldPassword: string): void {
    if (user.password !== oldPassword) {
      throw new HttpException(
        'User or password is invalid',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  private mapUserToResponse(user: User): Omit<User, 'password'> {
    return {
      id: user.id,
      login: user.login,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
