import { forwardRef, Module } from '@nestjs/common';
import { FavoritesModule } from 'src/favourite/favourites.module';
import { ArtistService } from './artist.service';
import { AlbumModule } from 'src/album/album.module';
import { ArtistController } from './artist.controller';
import { TrackModule } from 'src/track/track.module';

@Module({
  imports: [
    forwardRef(() => AlbumModule),
    forwardRef(() => TrackModule),
    forwardRef(() => FavoritesModule),
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
