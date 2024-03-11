import {
  Get,
  Controller,
  Param,
  ParseUUIDPipe,
  HttpException,
  HttpCode,
  Post,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { FavoritesService } from './favorites.service';
import {
  CreateUpdateFavoriteResponse,
  FavoritesResponse,
} from './dto/FavouritesResponse';

@Controller('favs')
export class FavouritesController {
  constructor(
    private favouritesService: FavoritesService,
    private trackService: TrackService,
    private artistService: ArtistService,
    private albumService: AlbumService,
  ) {}

  @Get()
  async findAll(): Promise<FavoritesResponse> {
    return await this.favouritesService.findAll();
  }

  @Post('track/:id')
  async addTrack(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CreateUpdateFavoriteResponse> {
    const track = await this.trackService.findOne(id);
    if (!track) {
      throw new HttpException(
        'Track with specified id is not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const message = await this.favouritesService.addTrack(id);
    return { message };
  }

  @Delete('track/:id')
  @HttpCode(204)
  async removeTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    const isFav = (await this.favouritesService.findTracks()).includes(id);
    if (!isFav) {
      throw new HttpException(
        'Track with specified id is not in favourites',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.favouritesService.removeTrack(id);
    return;
  }

  @Post('album/:id')
  async addAlbum(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CreateUpdateFavoriteResponse> {
    const album = await this.albumService.findOne(id);
    if (!album) {
      throw new HttpException(
        'Album with specified id is not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const message = await this.favouritesService.addAlbum(id);
    return { message };
  }

  @Delete('album/:id')
  @HttpCode(204)
  async removeAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    const isFav = (await this.favouritesService.findAlbums()).includes(id);
    if (!isFav) {
      throw new HttpException(
        'Album with specified id is not in favourites',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.favouritesService.removeAlbum(id);
    return;
  }

  @Post('artist/:id')
  async addArtist(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CreateUpdateFavoriteResponse> {
    const artist = await this.artistService.findOne(id);
    if (!artist) {
      throw new HttpException(
        'Artist with specified id is not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const message = await this.favouritesService.addArtist(id);
    return { message };
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async removeArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    const isFav = (await this.favouritesService.findArtists()).includes(id);
    if (!isFav) {
      throw new HttpException(
        'Artist with specified id is not in favourites',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.favouritesService.removeArtist(id);
    return;
  }
}
