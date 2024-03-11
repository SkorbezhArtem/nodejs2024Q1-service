import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDTO {
  @IsNotEmpty({ message: 'Old password must not be empty' })
  @IsString({ message: 'Old password must be a string' })
  oldPassword: string;

  @IsNotEmpty({ message: 'New password must not be empty' })
  @IsString({ message: 'New password must be a string' })
  newPassword: string;
}
