import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateUserDTO } from './dto/user.dto';
import { UpdatePasswordDTO } from './dto/password.dto';
import { User } from './user.interface';
import { DBService } from 'src/DB/DB.service';

@Injectable()
export class UserService {
  constructor(private dbService: DBService) {}

  async findAll(): Promise<User[]> {
    return this.dbService.getAllUsers();
  }

  async findOne(id: string): Promise<User> {
    return this.dbService.getUser(id);
  }

  async create(userDTO: CreateUserDTO): Promise<User> {
    const newUser = this.buildUser(userDTO);
    await this.dbService.createUser(newUser);
    return newUser;
  }

  async update(id: string, passwordDTO: UpdatePasswordDTO): Promise<User> {
    const user = await this.dbService.getUser(id);
    const updatedUser = this.updateUserPassword(user, passwordDTO.newPassword);
    await this.dbService.updateUser(id, updatedUser);
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    await this.dbService.deleteUser(id);
  }

  private buildUser(userDTO: CreateUserDTO): User {
    const id = uuid();
    const version = 1;
    const timestamp = Date.now();

    return {
      id,
      login: userDTO.login,
      password: userDTO.password,
      version,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  }

  private updateUserPassword(user: User, newPassword: string): User {
    return {
      ...user,
      password: newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    };
  }
}
