import { Injectable } from '@nestjs/common';
import { v4 as uuid4 } from 'uuid';
import { Album } from './album.interface';
import { CreateAlbumDTO, UpdateAlbumDTO } from './dto/album.dto';
import { DBService } from 'src/DB/DB.service';

@Injectable()
export class AlbumService {
  constructor(private dbService: DBService) {}

  async findAll(): Promise<Album[]> {
    return this.dbService.getAllAlbums();
  }

  async findOne(id: string): Promise<Album> {
    return this.dbService.getAlbum(id);
  }

  async create(createAlbumDTO: CreateAlbumDTO): Promise<Album> {
    const newAlbum: Album = {
      id: uuid4(),
      name: createAlbumDTO.name,
      year: createAlbumDTO.year,
      artistId: createAlbumDTO.artistId,
    };

    await this.dbService.createAlbum(newAlbum);

    return newAlbum;
  }

  async update(id: string, updateAlbumDTO: UpdateAlbumDTO): Promise<Album> {
    const album = await this.dbService.getAlbum(id);

    const updatedAlbum: Album = {
      ...album,
      name: updateAlbumDTO.name ?? album.name,
      year: updateAlbumDTO.year ?? album.year,
      artistId: updateAlbumDTO.artistId ?? album.artistId,
    };

    await this.dbService.updateAlbum(id, updatedAlbum);

    return updatedAlbum;
  }

  async delete(id: string) {
    await this.dbService.deleteAlbum(id);

    await this.updateRelatedTracks(id);
    await this.removeAlbumFromFavorites(id);
  }

  private async updateRelatedTracks(albumId: string) {
    const tracks = await this.dbService.getAllTracks();

    for (const track of tracks) {
      if (track.albumId === albumId) {
        await this.dbService.updateTrack(track.id, { ...track, albumId: null });
      }
    }
  }

  private async removeAlbumFromFavorites(albumId: string) {
    const favAlbums = await this.dbService.getFavAlbums();

    if (favAlbums.includes(albumId)) {
      await this.dbService.removeAlbumFromFav(albumId);
    }
  }
}
