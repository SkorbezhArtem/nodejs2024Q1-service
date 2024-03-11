import { Module, Global } from '@nestjs/common';
import { DBService } from './DB.service';

@Global()
@Module({
  providers: [DBService],
  exports: [DBService],
})
export class DBModule {}
