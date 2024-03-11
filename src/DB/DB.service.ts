import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Album } from 'src/album/album.interface';
import { Artist } from 'src/artist/artist.interface';
import { Favorites } from 'src/favourite/favourites.interface';
import { Track } from 'src/track/track.interface';
import { User } from 'src/user/user.interface';

@Injectable()
export class DBService {
  private readonly users: User[] = [];
  private readonly albums: Album[] = [];
  private readonly artists: Artist[] = [];
  private readonly tracks: Track[] = [];
  private readonly favs: Favorites = { artists: [], albums: [], tracks: [] };

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async createUser(newUser: User) {
    newUser.id = uuid();
    this.users.push(newUser);
  }

  async updateUser(id: string, updatedUser: User) {
    const userIndex = this.findIndexById(id, this.users);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updatedUser };
    }
  }

  async deleteUser(id: string) {
    this.users.splice(this.findIndexById(id, this.users), 1);
  }

  async getAllAlbums(): Promise<Album[]> {
    return this.albums;
  }

  async getAlbum(id: string): Promise<Album | undefined> {
    return this.albums.find((album) => album.id === id);
  }

  async createAlbum(newAlbum: Album) {
    newAlbum.id = uuid();
    this.albums.push(newAlbum);
  }

  async updateAlbum(id: string, updatedAlbum: Album) {
    const albumIndex = this.findIndexById(id, this.albums);
    if (albumIndex !== -1) {
      this.albums[albumIndex] = { ...this.albums[albumIndex], ...updatedAlbum };
    }
  }

  async deleteAlbum(id: string) {
    this.albums.splice(this.findIndexById(id, this.albums), 1);
  }

  async getAllArtists(): Promise<Artist[]> {
    return this.artists;
  }

  async getArtist(id: string): Promise<Artist | undefined> {
    return this.artists.find((artist) => artist.id === id);
  }

  async createArtist(newArtist: Artist) {
    newArtist.id = uuid();
    this.artists.push(newArtist);
  }

  async updateArtist(id: string, updatedArtist: Artist) {
    const artistIndex = this.findIndexById(id, this.artists);
    if (artistIndex !== -1) {
      this.artists[artistIndex] = {
        ...this.artists[artistIndex],
        ...updatedArtist,
      };
    }
  }

  async deleteArtist(id: string) {
    this.artists.splice(this.findIndexById(id, this.artists), 1);
  }

  async getAllTracks(): Promise<Track[]> {
    return this.tracks;
  }

  async getTrack(id: string): Promise<Track | undefined> {
    return this.tracks.find((track) => track.id === id);
  }

  async createTrack(newTrack: Track) {
    newTrack.id = uuid();
    this.tracks.push(newTrack);
  }

  async updateTrack(id: string, updatedTrack: Track) {
    const trackIndex = this.findIndexById(id, this.tracks);
    if (trackIndex !== -1) {
      this.tracks[trackIndex] = { ...this.tracks[trackIndex], ...updatedTrack };
    }
  }

  async deleteTrack(id: string) {
    this.tracks.splice(this.findIndexById(id, this.tracks), 1);
  }

  async getAllFavs(): Promise<Favorites> {
    return this.favs;
  }

  async getFavTracks(): Promise<string[]> {
    return this.favs.tracks;
  }

  async getFavAlbums(): Promise<string[]> {
    return this.favs.albums;
  }

  async getFavArtists(): Promise<string[]> {
    return this.favs.artists;
  }

  async addEntityToFav(id: string, list: string[]): Promise<string> {
    const entity = list.find((entityId) => entityId === id);
    if (entity) {
      return `This ${typeof entity} has already been added to favorites earlier`;
    }

    list.push(id);
    return `${typeof entity} successfully added to favorites`;
  }

  async removeEntityFromFav(id: string, list: string[]) {
    const index = list.findIndex((entityId) => entityId === id);
    list.splice(index, 1);
  }

  async addTrackToFav(id: string): Promise<string> {
    return this.addEntityToFav(id, this.favs.tracks);
  }

  async removeTrackFromFav(id: string) {
    this.removeEntityFromFav(id, this.favs.tracks);
  }

  async addArtistToFav(id: string): Promise<string> {
    return this.addEntityToFav(id, this.favs.artists);
  }

  async removeArtistFromFav(id: string) {
    this.removeEntityFromFav(id, this.favs.artists);
  }
  async addAlbumToFav(id: string): Promise<string> {
    return this.addEntityToFav(id, this.favs.albums);
  }

  async removeAlbumFromFav(id: string) {
    this.removeEntityFromFav(id, this.favs.albums);
  }

  private findIndexById(id: string, list: { id: string }[]): number {
    return list.findIndex((item) => item.id === id);
  }
}
