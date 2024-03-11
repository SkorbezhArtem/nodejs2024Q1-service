import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { IsUUIDorNull } from 'src/validators/IsUUIDorNull';

export class CreateAlbumDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  year: number;

  @IsOptional()
  @IsUUIDorNull()
  artistId: string | null = null;
}

export class UpdateAlbumDTO extends PartialType(CreateAlbumDTO) {}
