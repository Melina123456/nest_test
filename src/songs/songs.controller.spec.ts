import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

describe('SongsController', () => {
  let controller: SongsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers: [
        SongsService,
        {
          provide: SongsService,
          useValue: {
            getSongs: jest
              .fn()
              .mockResolvedValue([{ id: 1, title: 'love story' }]),
            getSong: jest.fn().mockImplementation((id: string) => {
              return Promise.resolve({ id: id, title: 'Dancing' });
            }),
            createSong: jest
              .fn()
              .mockImplementation((createSongDto: CreateSongDto) => {
                return Promise.resolve({ id: 'a uuid', ...createSongDto });
              }),
            updateSong: jest
              .fn()
              .mockImplementation((updateSongDto: UpdateSongDto) => {
                return Promise.resolve({ affected: 1 });
              }),
            deleteSong: jest.fn().mockImplementation((id: string) => {
              return Promise.resolve({ affected: 1 });
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<SongsController>(SongsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSongs', () => {
    it('should fetch all the songs', async () => {
      const songs = await controller.getSongs();
      expect(songs).toEqual([{ id: 1, title: 'love story' }]);
    });
  });

  describe('get song by id', () => {
    it('should give me the song by id', async () => {
      const song = await controller.getSong('123131');
      expect(song.id).toBe('123131');
    });
  });

  describe('create song', () => {
    it('it should create a new song', async () => {
      const newSongDto: CreateSongDto = {
        title: 'runaway',
      };
      const song = await controller.createSong(newSongDto);
      expect(song.title).toBe('runaway');
      expect(song).toEqual({ id: 'a uuid', title: 'runaway' });
    });
  });

  describe('create song', () => {
    it('it should create a new song', async () => {
      const newSongDto: CreateSongDto = {
        title: 'runaway',
      };
      const song = await controller.createSong(newSongDto);
      expect(song.title).toBe('runaway');
    });
  });

  describe('updateSong', () => {
    it('should update the song DTO', async () => {
      const updatesongDTO: UpdateSongDto = {
        title: 'Animals',
      };
      const updateResults = await controller.updateSong(
        'a uuid',
        updatesongDTO,
      );
      expect(updateResults).toBeDefined();
      expect(updateResults.affected).toBe(1);
    });
  });

  describe('deleteSong', () => {
    it('should delete the song', async () => {
      const deleteResult = await controller.deleteSong('a uuid');
      expect(deleteResult.affected).toBe(1);
    });
  });
});
