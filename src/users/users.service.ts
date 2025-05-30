import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { apiSuccessResponse } from 'src/common/createReponseObject';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  // custom method for cheking if user exits based on id
  async findUserOrFail(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(newUser);

    return apiSuccessResponse<null>(`User with id ${savedUser.id}`);
  }

  async findAll() {
    const users = await this.userRepository.find();
    if (users.length === 0) {
      throw new NotFoundException(`No user found`);
    }
    return apiSuccessResponse('Users fetched successfully', users);
  }

  async findOne(id: string) {
    const user = await this.findUserOrFail(id);
    return apiSuccessResponse('User fetched successfully', user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findUserOrFail(id);
    await this.userRepository.update(id, updateUserDto);
    return apiSuccessResponse(`User with ${id} updated successfully`);
  }

  async remove(id: string) {
    const user = await this.findUserOrFail(id);
    await this.userRepository.remove(user);
    return apiSuccessResponse<null>(`User with id ${id} removed`);
  }
}
