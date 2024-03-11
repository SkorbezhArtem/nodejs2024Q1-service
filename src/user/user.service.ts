import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { User } from './user.interface';

@Injectable()
export class UserService {
  private readonly users: User[] = [
    {
      id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
      login: 'testUser',
      password: 'password',
      version: 1,
      createdAt: 1674784901,
      updatedAt: 1674784901,
    },
  ];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  create(userDTO: CreateUserDto): User {
    const id = uuid();
    const version = 1;
    const createdAt = Date.now();

    const newUser: User = {
      id,
      login: userDTO.login,
      password: userDTO.password,
      version,
      createdAt,
      updatedAt: createdAt,
    };

    this.users.push(newUser);

    return newUser;
  }

  update(id: string, passwordDTO: UpdatePasswordDto): User {
    const userIndex = this.findUserIndex(id);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const user = this.users[userIndex];

    const updatedUser: User = {
      ...user,
      password: passwordDTO.newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    };

    this.users[userIndex] = updatedUser;

    return updatedUser;
  }

  delete(id: string): void {
    const userIndex = this.findUserIndex(id);

    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
    }
  }

  private findUserIndex(id: string): number {
    return this.users.findIndex((user) => user.id === id);
  }
}
