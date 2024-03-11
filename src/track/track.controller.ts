import {
  Get,
  Put,
  Post,
  Param,
  Delete,
  Body,
  HttpStatus,
  HttpException,
  ValidationPipe,
  Controller,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from './track.service';
import { CreateTrackDTO, UpdateTrackDTO } from './dto/track.dto';
import { Track } from './track.interface';

@Controller('track')
export class TrackController {
  constructor(
    private trackService: TrackService,
    private albumService: AlbumService,
    private artistService: ArtistService,
  ) {}

  @Get()
  async findAll(): Promise<Track[]> {
    return this.trackService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Track> {
    return this.validateTrack(id);
  }

  @Post()
  async create(@Body(ValidationPipe) dto: CreateTrackDTO): Promise<Track> {
    await this.validateAlbumAndArtist(dto.albumId, dto.artistId);
    const newTrack = await this.trackService.create(dto);
    return newTrack;
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(ValidationPipe) dto: UpdateTrackDTO,
  ): Promise<Track> {
    await this.validateTrack(id);
    await this.validateAlbumAndArtist(dto.albumId, dto.artistId);
    const updatedTrack = await this.trackService.update(id, dto);
    return updatedTrack;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.validateTrack(id);
    await this.trackService.delete(id);
    return;
  }

  private async validateTrack(id: string): Promise<Track> {
    const track = await this.trackService.findOne(id);
    if (!track) {
      throw new HttpException(
        'Track with specified id is not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return track;
  }

  private async validateAlbumAndArtist(
    albumId: string,
    artistId: string,
  ): Promise<void> {
    if (albumId) {
      await this.validateEntity('Album', albumId, this.albumService);
    }

    if (artistId) {
      await this.validateEntity('Artist', artistId, this.artistService);
    }
  }

  private async validateEntity(
    entityName: string,
    entityId: string,
    service: any,
  ): Promise<void> {
    const entity = await service.findOne(entityId);
    if (!entity) {
      throw new HttpException(
        `${entityName} with specified id is not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
