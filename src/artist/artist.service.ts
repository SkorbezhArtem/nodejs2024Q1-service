import { Injectable } from '@nestjs/common';
import { v4 as uuid4 } from 'uuid';
import { Artist } from './artist.interface';
import { CreateArtistDTO, UpdateArtistDTO } from 'src/artist/dto/artist.dto';
import { DBService } from 'src/DB/DB.service';

@Injectable()
export class ArtistService {
  constructor(private dbService: DBService) {}

  async findAll(): Promise<Artist[]> {
    return this.dbService.getAllArtists();
  }

  async findOne(id: string): Promise<Artist> {
    return this.dbService.getArtist(id);
  }

  async create(artistDTO: CreateArtistDTO): Promise<Artist> {
    const newArtist = this.createArtistObject(artistDTO);
    await this.dbService.createArtist(newArtist);
    return newArtist;
  }

  async update(id: string, updateArtistDTO: UpdateArtistDTO): Promise<Artist> {
    const artist = await this.dbService.getArtist(id);
    const updatedArtist = this.createUpdatedArtistObject(
      artist,
      updateArtistDTO,
    );
    await this.dbService.updateArtist(id, updatedArtist);
    return updatedArtist;
  }

  async delete(id: string) {
    await this.dbService.deleteArtist(id);
    await this.updateAlbumsAndTracks(id);
    await this.removeArtistFromFavorites(id);
  }

  private createArtistObject(artistDTO: CreateArtistDTO): Artist {
    return {
      id: uuid4(),
      name: artistDTO.name,
      grammy: artistDTO.grammy,
    };
  }

  private createUpdatedArtistObject(
    artist: Artist,
    updateArtistDTO: UpdateArtistDTO,
  ): Artist {
    return {
      ...artist,
      name: updateArtistDTO.name ?? artist.name,
      grammy:
        updateArtistDTO.grammy !== undefined
          ? updateArtistDTO.grammy
          : artist.grammy,
    };
  }

  private async updateAlbumsAndTracks(artistId: string) {
    const albums = await this.dbService.getAllAlbums();
    const tracks = await this.dbService.getAllTracks();

    for (const album of albums) {
      if (album.artistId === artistId) {
        await this.dbService.updateAlbum(album.id, {
          ...album,
          artistId: null,
        });
      }
    }

    for (const track of tracks) {
      if (track.artistId === artistId) {
        await this.dbService.updateTrack(track.id, {
          ...track,
          artistId: null,
        });
      }
    }
  }

  private async removeArtistFromFavorites(artistId: string) {
    const favArtists = await this.dbService.getFavArtists();

    if (favArtists.includes(artistId)) {
      this.dbService.removeArtistFromFav(artistId);
    }
  }
}
