import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note) private readonly note: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto) {
    const note = new Note();
    note.title = createNoteDto.title;
    note.content = createNoteDto.content;
    return await this.note.save(note);
  }

  async findAll(query: { current: number; pageSize: number }) {
    const { current, pageSize } = query;
    const [list, total] = await this.note.findAndCount({
      skip: (current - 1) * pageSize,
      take: pageSize,
    });
    return { list, total };
  }

  async findOne(id: number) {
    return await this.note.findOne({ where: { id } });
  }

  async update(id: number, updateNoteDto: UpdateNoteDto) {
    return await this.note.update(id, updateNoteDto);
  }

  async remove(id: number) {
    return await this.note.delete(id);
  }
}
