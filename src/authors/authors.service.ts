import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { apiSuccessResponse } from 'src/common/createReponseObject';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author) private authorRepository: Repository<Author>,
  ) {}

  private async findAuthorOrFail(id: string): Promise<Author> {
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
    return apiSuccessResponse('All Authors retrived successfully', authors);
  }

  async findOne(id: string) {
    const author = await this.findAuthorOrFail(id);
    return apiSuccessResponse('Author fetched successfully here', author);
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    const author = await this.findAuthorOrFail(id);
    Object.assign(author, updateAuthorDto);
    const updatedAuthor = await this.authorRepository.save(author);
    return apiSuccessResponse('Author updated successfully', updatedAuthor);
  }

  async findBooks(id: string) {
    try {
      const authorWithBooks = await this.authorRepository.findOne({
        where: { id },
        relations: {
          writtenBooks: true,
        },
      });

      if (!authorWithBooks) {
        throw new NotFoundException(`Author with id ${id} not found`);
      }

      return apiSuccessResponse(
        `Author with id ${id} has books`,
        authorWithBooks,
      );
    } catch (error) {
      console.error('Error in findBooks:', error);
      throw error;
    }
  }

  async remove(id: string) {
    const author = await this.findAuthorOrFail(id);
    await this.authorRepository.remove(author);
    return apiSuccessResponse<null>(`Author with id ${id} removed`);
  }
}
