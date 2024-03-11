import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FavoritesModule } from './favourite/favourites.module';
import { DBModule } from './DB/DB.module';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { AppService } from './app.service';

@Module({
  imports: [
    UserModule,
    AlbumModule,
    ArtistModule,
    TrackModule,
    FavoritesModule,
    DBModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
