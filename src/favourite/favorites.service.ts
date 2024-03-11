import { Injectable } from '@nestjs/common';
import { DBService } from 'src/DB/DB.service';
import { FavoritesResponse } from './dto/FavouritesResponse';

@Injectable()
export class FavoritesService {
  constructor(private dbService: DBService) {}

  async findAll(): Promise<FavoritesResponse> {
    const favIds = await this.dbService.getAllFavs();
    const artists = await this.fetchEntities(
      favIds.artists,
      this.dbService.getArtist.bind(this.dbService),
    );
    const albums = await this.fetchEntities(
      favIds.albums,
      this.dbService.getAlbum.bind(this.dbService),
    );
    const tracks = await this.fetchEntities(
      favIds.tracks,
      this.dbService.getTrack.bind(this.dbService),
    );

    return { artists, albums, tracks };
  }

  async findTracks(): Promise<string[]> {
    return this.dbService.getFavTracks();
  }

  async findAlbums(): Promise<string[]> {
    return this.dbService.getFavAlbums();
  }

  async findArtists(): Promise<string[]> {
    return this.dbService.getFavArtists();
  }

  async addTrack(id: string): Promise<string> {
    return this.dbService.addTrackToFav(id);
  }

  async removeTrack(id: string): Promise<void> {
    await this.dbService.removeTrackFromFav(id);
  }

  async addArtist(id: string): Promise<string> {
    return this.dbService.addArtistToFav(id);
  }

  async removeArtist(id: string): Promise<void> {
    await this.dbService.removeArtistFromFav(id);
  }

  async addAlbum(id: string): Promise<string> {
    return this.dbService.addAlbumToFav(id);
  }

  async removeAlbum(id: string): Promise<void> {
    await this.dbService.removeAlbumFromFav(id);
  }

  private async fetchEntities(
    ids: string[],
    fetchFunction: (id: string) => Promise<any>,
  ): Promise<any[]> {
    return Promise.all(ids.map(async (id) => await fetchFunction(id)));
  }
}
