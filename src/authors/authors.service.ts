import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { apiSuccessResponse } from 'src/common/createReponseObject'; // if you have it

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author) private authorRepository: Repository<Author>,
  ) {}

  async findAuthorOrFail(id: string): Promise<Author> {
    const author = await this.authorRepository.findOne({ where: { id } });
    if (!author) {
      throw new NotFoundException(`Author with id ${id} not found`);
    }
    return author;
  }

  async create(createAuthorDto: CreateAuthorDto) {
    const newAuthor = this.authorRepository.create(createAuthorDto);
    const savedAuthor = await this.authorRepository.save(newAuthor);
    return apiSuccessResponse<null>(`Author with id ${savedAuthor.id} created`);
  }

  async findAll() {
    const authors = await this.authorRepository.find();
    if (authors.length === 0) {
      throw new NotFoundException('No authors found');
    }
    return apiSuccessResponse('Authors fetched successfully', authors);
  }

  async findOne(id: string) {
    const author = await this.findAuthorOrFail(id);
    return apiSuccessResponse('Author fetched successfully', author);
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    const author = await this.findAuthorOrFail(id);
    Object.assign(author, updateAuthorDto);
    const updatedAuthor = await this.authorRepository.save(author);
    return apiSuccessResponse('Author updated successfully', updatedAuthor);
  }

  async remove(id: string) {
    const author = await this.findAuthorOrFail(id);
    await this.authorRepository.remove(author);
    return apiSuccessResponse<null>(`Author with id ${id} removed`);
  }
}
