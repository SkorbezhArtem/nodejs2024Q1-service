import {
  Controller,
  Body,
  Get,
  HttpException,
  Param,
  HttpCode,
  ValidationPipe,
  Post,
  HttpStatus,
  ParseUUIDPipe,
  Put,
  Delete,
} from '@nestjs/common';
import { Artist } from './artist.interface';
import { ArtistService } from './artist.service';
import { CreateArtistDTO, UpdateArtistDTO } from 'src/artist/dto/artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Get()
  async findAll(): Promise<Artist[]> {
    return this.artistService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Artist> {
    return this.getArtistById(id);
  }

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createArtistDTO: CreateArtistDTO,
  ): Promise<Artist> {
    return this.artistService.create(createArtistDTO);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(ValidationPipe) updateArtistDTO: UpdateArtistDTO,
  ): Promise<Artist> {
    await this.getArtistById(id);
    return this.artistService.update(id, updateArtistDTO);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.getArtistById(id);
    await this.artistService.delete(id);
  }

  private async getArtistById(id: string): Promise<Artist> {
    const artist = await this.artistService.findOne(id);
    if (!artist) {
      throw new HttpException(
        'Artist with specified id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return artist;
  }
}
