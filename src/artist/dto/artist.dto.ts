import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsBoolean, IsString } from 'class-validator';

export class CreateArtistDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  grammy: boolean;
}

export class UpdateArtistDTO extends PartialType(CreateArtistDTO) {}
