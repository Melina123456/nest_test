import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateSongDto } from 'src/songs/dto/create-song.dto';
import { Song } from '../../src/songs/entities/song.entity';
import { SongsModule } from '../../src/songs/songs.module';
import * as request from 'supertest';
import { UpdateSongDto } from 'src/songs/dto/update-song.dto';

describe('Songs - /songs', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: 'postgres://postgres:melina@localhost:5432/unit-test',
          synchronize: true,
          entities: [Song],
          dropSchema: true,
        }),
        SongsModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    const songRepository = app.get('SongRepository');
    await songRepository.clear();
  });

  const createSong = (createSongDto: CreateSongDto): Promise<Song> => {
    const song = new Song();
    song.title = createSongDto.title;
    const songRepo = app.get('SongRepository');
    return songRepo.save(song);
  };

  it('/GET songs', async () => {
    const newSong = await createSong({ title: 'Animals' });
    const results = await request(app.getHttpServer()).get('/songs');
    expect(results.statusCode).toBe(200);
    expect(results.body).toHaveLength(1);
    expect(results.body).toEqual([newSong]);
  });

  it('/GET songs/:id', async () => {
    const newSong = await createSong({ title: 'Animals' });
    const results = await request(app.getHttpServer()).get(
      `/songs/${newSong.id}`,
    );
    expect(results.statusCode).toBe(200);
    expect(results.body).toEqual(newSong);
  });

  it('/PUT songs/:id', async () => {
    const newSong = await createSong({ title: 'Animals' });
    const updateSongDto: UpdateSongDto = { title: 'Wonderful' };
    const results = await request(app.getHttpServer())
      .put(`/songs/${newSong.id}`)
      .send(updateSongDto as UpdateSongDto);
    expect(results.statusCode).toBe(200);
    expect(results.body.affected).toEqual(1);
  });

  it('/POST songs', async () => {
    const createSongDto = { title: 'Animals' };
    const results = await request(app.getHttpServer())
      .post('/songs')
      .send(createSongDto as CreateSongDto);
    expect(results.statusCode).toBe(201);
    expect(results.body.title).toBe('Animals');
  });

  it('/DELETE songs', async () => {
    const createSongDto: CreateSongDto = { title: 'Animals' };
    const newSong = await createSong(createSongDto);
    const results = await request(app.getHttpServer()).delete(
      `/songs/${newSong.id}`,
    );
    expect(results.statusCode).toBe(200);
    expect(results.body.affected).toEqual(1);
  });
});
