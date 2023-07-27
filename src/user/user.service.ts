import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.username = createUserDto.username;
    user.password = createUserDto.password;
    return await this.user.save(user);
  }

  async findAll(query: { current: number; pageSize: number }) {
    const { current, pageSize } = query;
    const [list, total] = await this.user.findAndCount({
      skip: (current - 1) * pageSize,
      take: pageSize,
    });
    return { list, total };
  }

  async findOne(id: number) {
    return await this.user.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.user.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.user.delete(id);
  }
}
