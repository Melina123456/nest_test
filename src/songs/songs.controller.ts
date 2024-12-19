import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Song } from './entities/song.entity';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

@Controller('songs')
export class SongsController {
  constructor(private SongsService: SongsService) {}
  @Get()
  getSongs(): Promise<Song[]> {
    return this.SongsService.getSongs();
  }
  @Get(':id')
  getSong(
    @Param('id')
    id: string,
  ): Promise<Song> {
    return this.SongsService.getSong(id);
  }

  @Post()
  createSong(
    @Body()
    createSongDTO: CreateSongDto,
  ): Promise<Song> {
    return this.SongsService.createSong(createSongDTO);
  }

  @Put(':id')
  updateSong(
    @Param('id')
    id: string,
    @Body()
    updateSongDTO: UpdateSongDto,
  ): Promise<UpdateResult> {
    return this.SongsService.updateSong(id, updateSongDTO);
  }

  @Delete(':id')
  deleteSong(
    @Param('id')
    id: string,
  ): Promise<DeleteResult> {
    return this.SongsService.deleteSong(id);
  }
}
