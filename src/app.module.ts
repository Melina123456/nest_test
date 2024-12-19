import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongsModule } from './songs/songs.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgres://postgres:melina@localhost:5432/unit-test',
      synchronize: true,
      entities: [__dirname + '/**/*.entity.{ts,js}'],
    }),
    SongsModule,
  ],
})
export class AppModule {}
