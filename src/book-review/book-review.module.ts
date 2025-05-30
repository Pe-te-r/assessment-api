import { Module } from '@nestjs/common';
import { BookReviewService } from './book-review.service';
import { BookReviewController } from './book-review.controller';

@Module({
  controllers: [BookReviewController],
  providers: [BookReviewService],
})
export class BookReviewModule {}
