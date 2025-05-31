import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from 'src/users/entities/user.entity';
import { apiSuccessResponse } from 'src/common/createReponseObject';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private async findProfileOrFail(id: string): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (!profile) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }

    return profile;
  }

  async create(createProfileDto: CreateProfileDto) {
    const user = await this.userRepository.findOne({
      where: { id: createProfileDto.owner },
    });

    if (!user) {
      throw new BadRequestException('Invalid owner user ID');
    }

    const profile = this.profileRepository.create({
      ...createProfileDto,
      owner: user,
    });

    const savedProfile = await this.profileRepository.save(profile);

    return apiSuccessResponse(`Profile with id ${savedProfile.id} created`);
  }

  async findAll() {
    const profiles = await this.profileRepository.find({
      relations: { owner: true },
    });

    if (profiles.length === 0) {
      throw new NotFoundException('No profiles found');
    }

    return apiSuccessResponse('All profiles retrieved successfully', profiles);
  }

  async findOne(id: string) {
    const profile = await this.findProfileOrFail(id);
    return apiSuccessResponse('Profile fetched successfully', profile);
  }

  async update(id: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.findProfileOrFail(id);

    Object.assign(profile, updateProfileDto);
    const updated = await this.profileRepository.save(profile);

    return apiSuccessResponse('Profile updated successfully', updated);
  }

  async remove(id: string) {
    const profile = await this.findProfileOrFail(id);
    await this.profileRepository.remove(profile);
    return apiSuccessResponse<null>(`Profile with id ${id} removed`);
  }
}
