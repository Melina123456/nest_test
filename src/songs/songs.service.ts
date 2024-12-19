import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UpdateSongDto } from './dto/update-song.dto';
import { CreateSongDto } from './dto/create-song.dto';
import { Song } from './entities/song.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private readonly songRepo: Repository<Song>,
  ) {}
  async getSongs(): Promise<Song[]> {
    return this.songRepo.find();
  }
  getSong(id: string) {
    return this.songRepo.findOneOrFail({ where: { id } });
  }
  async createSong(createSongDTO: CreateSongDto) {
    const newSong = this.songRepo.create(createSongDTO);
    await this.songRepo.save(newSong);
    return newSong;
  }
  async updateSong(id, updateSongDTO: UpdateSongDto): Promise<UpdateResult> {
    return this.songRepo.update({ id }, updateSongDTO);
  }
  async deleteSong(id: string): Promise<DeleteResult> {
    return this.songRepo.delete(id);
  }
}
