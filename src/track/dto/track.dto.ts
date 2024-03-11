import { IsString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { IsUUIDorNull } from 'src/validators/IsUUIDorNull';
import { PartialType } from '@nestjs/mapped-types';

export class CreateTrackDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsUUIDorNull()
  artistId: string | null = null;

  @IsOptional()
  @IsUUIDorNull()
  albumId: string | null = null;

  @IsNotEmpty()
  @IsInt()
  duration: number;
}

export class UpdateTrackDTO extends PartialType(CreateTrackDTO) {}
