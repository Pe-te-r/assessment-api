import { Module } from '@nestjs/common';
import { BookReviewService } from './book-review.service';
import { BookReviewController } from './book-review.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookReview } from './entities/book-review.entity';
import { User } from 'src/users/entities/user.entity';
import { Book } from 'src/books/entities/book.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([BookReview, User, Book])],
  controllers: [BookReviewController],
  providers: [BookReviewService],
})
export class BookReviewModule {}
