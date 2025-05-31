import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookReviewDto } from './dto/create-book-review.dto';
import { UpdateBookReviewDto } from './dto/update-book-review.dto';
import { BookReview } from './entities/book-review.entity';
import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/users/entities/user.entity';
import { apiSuccessResponse } from 'src/common/createReponseObject';

@Injectable()
export class BookReviewService {
  constructor(
    @InjectRepository(BookReview)
    private bookReviewRepository: Repository<BookReview>,

    @InjectRepository(Book)
    private bookRepository: Repository<Book>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private async findBookOrFail(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    return book;
  }

  private async findUserOrFail(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async create(createBookReviewDto: CreateBookReviewDto) {
    const { content, rating, reviewedBy, bookReview } = createBookReviewDto;

    const user = await this.findUserOrFail(reviewedBy);
    const book = await this.findBookOrFail(bookReview);

    const newReview = this.bookReviewRepository.create({
      content,
      rating,
      reviewedBy: user,
      bookReviewed: book,
    });

    const savedReview = await this.bookReviewRepository.save(newReview);

    return apiSuccessResponse<null>(
      `Review with id ${savedReview.id} created successfully`,
    );
  }

  async findAll() {
    const reviews = await this.bookReviewRepository.find({
      relations: ['reviewedBy', 'bookReviewed'],
    });
    if (reviews.length === 0) {
      throw new NotFoundException('No book reviews found');
    }
    return apiSuccessResponse(
      'All book reviews retrieved successfully',
      reviews,
    );
  }

  async findOne(id: string) {
    const review = await this.bookReviewRepository.findOne({
      where: { id },
      relations: ['reviewedBy', 'bookReviewed'],
    });
    if (!review) {
      throw new NotFoundException(`Book review with id ${id} not found`);
    }
    return apiSuccessResponse('Book review fetched successfully', review);
  }

  async update(id: string, updateBookReviewDto: UpdateBookReviewDto) {
    const review = await this.bookReviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Book review with id ${id} not found`);
    }

    Object.assign(review, updateBookReviewDto);
    const updatedReview = await this.bookReviewRepository.save(review);

    return apiSuccessResponse(
      'Book review updated successfully',
      updatedReview,
    );
  }

  async remove(id: string) {
    const review = await this.bookReviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Book review with id ${id} not found`);
    }

    await this.bookReviewRepository.remove(review);
    return apiSuccessResponse<null>(`Book review with id ${id} removed`);
  }
}
