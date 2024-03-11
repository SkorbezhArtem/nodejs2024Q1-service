import {
  Get,
  Put,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Body,
  Post,
  HttpCode,
  Delete,
} from '@nestjs/common';
import { validate as validateUuid } from 'uuid';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { User } from './user.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Omit<User, 'password'>> {
    this.validateUuid(id);

    const user = await this.findUserById(id);
    this.throwNotFoundIfUserNotFound(user);

    const { password, ...userResponse } = user;
    return userResponse;
  }

  @Post()
  async create(
    @Body() createUserDTO: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    this.validateUserData(createUserDTO);

    const newUser = await this.userService.create(createUserDTO);
    const { password, ...userResponse } = newUser;

    return userResponse;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePasswordDTO: UpdatePasswordDto,
  ): Promise<Omit<User, 'password'>> {
    this.validateUuid(id);
    this.validateUpdatePasswordData(updatePasswordDTO);

    const user = await this.findUserById(id);
    this.throwNotFoundIfUserNotFound(user);
    this.throwForbiddenIfPasswordsDoNotMatch(
      user.password,
      updatePasswordDTO.oldPassword,
    );

    const updatedUser = await this.userService.update(
      user.id,
      updatePasswordDTO,
    );
    const { password, ...userResponse } = updatedUser;

    return userResponse;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    this.validateUuid(id);

    const user = await this.findUserById(id);
    this.throwNotFoundIfUserNotFound(user);

    this.userService.delete(user.id);
    return;
  }

  private validateUuid(id: string): void {
    if (!validateUuid(id)) {
      throw new HttpException(
        'Specified id is invalid',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async findUserById(id: string): Promise<User> {
    const user = await this.userService.findOne(id);
    return user;
  }

  private throwNotFoundIfUserNotFound(user: User): void {
    if (!user) {
      throw new HttpException(
        'User with specified id not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  private validateUserData(userData: CreateUserDto): void {
    if (!userData.login || !userData.password) {
      throw new HttpException('Invalid data format', HttpStatus.BAD_REQUEST);
    }
  }

  private validateUpdatePasswordData(
    updatePasswordDTO: UpdatePasswordDto,
  ): void {
    if (!updatePasswordDTO.oldPassword || !updatePasswordDTO.newPassword) {
      throw new HttpException('Invalid data format', HttpStatus.BAD_REQUEST);
    }
  }

  private throwForbiddenIfPasswordsDoNotMatch(
    actualPassword: string,
    providedPassword: string,
  ): void {
    if (actualPassword !== providedPassword) {
      throw new HttpException(
        'User or password is invalid',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
