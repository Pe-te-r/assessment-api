import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { apiSuccessResponse } from 'src/common/createReponseObject'; // Optional, if you have it
import { Author } from 'src/authors/entities/author.entity';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
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
    const {
      author: authorId,
      category: categoryId,
      ...bookData
    } = createBookDto;

    // Check if the author exists
    const author = await this.authorRepository.findOneBy({ id: authorId });
    if (!author) {
      throw new NotFoundException(`Author with id ${authorId} not found`);
    }

    // Check if the category exists
    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });
    if (!category) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }

    // Create the new book and assign relationships
    const newBook = this.bookRepository.create({
      ...bookData,
      bookOwner: author,
      categories: [category], // add category here
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

  async findReviews(id: string) {
    const bookFound = await this.bookRepository.findOne({
      where: { id },
      relations: { reviews: true },
    });
    if (!bookFound) {
      throw new NotFoundException(`book with id ${id} not found`);
    }
    return apiSuccessResponse('Book details retrived', bookFound);
  }

  async searchBook(filters: {
    title?: string;
    authorId?: string;
    categoryId?: string;
  }) {
    const query = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.bookOwner', 'author')
      .leftJoinAndSelect('book.categories', 'category');

    if (filters.title) {
      query.andWhere('LOWER(book.title) LIKE LOWER(:title)', {
        title: `%${filters.title}%`,
      });
    }

    if (filters.authorId) {
      query.andWhere('author.id = :authorId', { authorId: filters.authorId });
    }

    if (filters.categoryId) {
      query.andWhere('category.id = :categoryId', {
        categoryId: filters.categoryId,
      });
    }

    const results = await query.getMany();

    if (results.length === 0) {
      throw new NotFoundException(
        'No books found matching the search criteria',
      );
    }

    return apiSuccessResponse('Books found', results);
  }
}
