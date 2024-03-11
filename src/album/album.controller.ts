import {
  Get,
  ParseUUIDPipe,
  Controller,
  HttpException,
  Param,
  ValidationPipe,
  HttpStatus,
} from '@nestjs/common';
import { Body, Delete, HttpCode, Post, Put } from '@nestjs/common/decorators';
import { CreateAlbumDTO, UpdateAlbumDTO } from './dto/album.dto';
import { AlbumService } from './album.service';
import { ArtistService } from 'src/artist/artist.service';
import { Album } from './album.interface';

@Controller('album')
export class AlbumController {
  constructor(
    private albumService: AlbumService,
    private artistService: ArtistService,
  ) {}

  @Get()
  async findAll(): Promise<Album[]> {
    return this.albumService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Album> {
    return this.getAlbumById(id);
  }

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createAlbumDTO: CreateAlbumDTO,
  ): Promise<Album> {
    await this.validateArtistId(createAlbumDTO.artistId);

    const newAlbum = await this.albumService.create(createAlbumDTO);
    return newAlbum;
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(ValidationPipe) updateAlbumDTO: UpdateAlbumDTO,
  ): Promise<Album> {
    await this.validateArtistId(updateAlbumDTO.artistId);
    await this.getAlbumById(id);

    const updatedAlbum = await this.albumService.update(id, updateAlbumDTO);
    return updatedAlbum;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.getAlbumById(id);
    this.albumService.delete(id);
  }

  private async getAlbumById(id: string): Promise<Album> {
    const album = await this.albumService.findOne(id);
    if (!album) {
      throw new HttpException(
        'Album with specified id is not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return album;
  }

  private async validateArtistId(artistId: string) {
    if (artistId) {
      const artist = await this.artistService.findOne(artistId);
      if (!artist) {
        throw new HttpException(
          'Artist with specified id is not found',
          HttpStatus.NOT_FOUND,
        );
      }
    }
  }
}
