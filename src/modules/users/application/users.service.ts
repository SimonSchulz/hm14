import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/repositories/users.repository';
import { InputUserDto } from '../dto/user.input.dto';
import { User } from '../domain/entities/user.entity';
import { UsersQueryRepository } from '../infrastructure/repositories/users.query.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async create(dto: InputUserDto): Promise<string> {
    const user = new User(dto.login, dto.email, dto.password);
    return this.usersRepository.create(user);
  }

  async delete(id: string): Promise<boolean> {
    return this.usersRepository.delete(id);
  }
}
