import { Test, TestingModule } from '@nestjs/testing';
import { BookReviewController } from './book-review.controller';
import { BookReviewService } from './book-review.service';

describe('BookReviewController', () => {
  let controller: BookReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookReviewController],
      providers: [BookReviewService],
    }).compile();

    controller = module.get<BookReviewController>(BookReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
