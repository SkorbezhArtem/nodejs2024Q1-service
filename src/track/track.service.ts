import { Injectable } from '@nestjs/common';
import { DBService } from 'src/DB/DB.service';
import { Track } from 'src/track/track.interface';
import { v4 as uuid4 } from 'uuid';
import { CreateTrackDTO, UpdateTrackDTO } from './dto/track.dto';

@Injectable()
export class TrackService {
  constructor(private dbService: DBService) {}

  async findAll(): Promise<Track[]> {
    return this.dbService.getAllTracks();
  }

  async findOne(id: string): Promise<Track> {
    return this.dbService.getTrack(id);
  }

  async create(dto: CreateTrackDTO): Promise<Track> {
    const newTrack: Track = {
      id: uuid4(),
      ...dto,
    };

    await this.dbService.createTrack(newTrack);

    return newTrack;
  }

  async update(id: string, dto: UpdateTrackDTO): Promise<Track> {
    const track = await this.dbService.getTrack(id);

    const updatedTrack: Track = {
      ...track,
      ...dto,
    };

    await this.dbService.updateTrack(id, updatedTrack);

    return updatedTrack;
  }

  async delete(id: string) {
    await this.dbService.deleteTrack(id);

    const favs = await this.dbService.getFavTracks();
    if (favs.includes(id)) {
      await this.dbService.removeTrackFromFav(id);
    }
  }
}
