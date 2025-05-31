import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { apiSuccessResponse } from 'src/common/createReponseObject'; // Optional, if you have it
import { Author } from 'src/authors/entities/author.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private bookRepository: Repository<Book>,
    @InjectRepository(Author) private authorRepository: Repository<Author>,
  ) {}

  // find book by id or throw error
  async findBookOrFail(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    return book;
  }

  async create(createBookDto: CreateBookDto) {
    const { author: authorId, ...bookData } = createBookDto;
    const author = await this.authorRepository.findOneBy({ id: authorId });
    if (!author) {
      throw new NotFoundException(`Author with id ${authorId} not found`);
    }
    const newBook = this.bookRepository.create({
      ...bookData,
      bookOwner: author,
    });
    const savedBook = await this.bookRepository.save(newBook);
    return apiSuccessResponse<null>(`Book with id ${savedBook.id} created`);
  }

  async findAll() {
    const books = await this.bookRepository.find();
    if (books.length === 0) {
      throw new NotFoundException('No books found');
    }
    return apiSuccessResponse('Books fetched successfully', books);
  }

  async findOne(id: string) {
    const book = await this.findBookOrFail(id);
    return apiSuccessResponse('Book fetched successfully', book);
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.findBookOrFail(id);
    Object.assign(book, updateBookDto);
    const updatedBook = await this.bookRepository.save(book);
    return apiSuccessResponse('Book updated successfully', updatedBook);
  }

  async remove(id: string) {
    const book = await this.findBookOrFail(id);
    await this.bookRepository.remove(book);
    return apiSuccessResponse<null>(`Book with id ${id} removed`);
  }
}
