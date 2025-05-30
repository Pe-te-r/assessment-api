import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BookReviewService } from './book-review.service';
import { CreateBookReviewDto } from './dto/create-book-review.dto';
import { UpdateBookReviewDto } from './dto/update-book-review.dto';

@Controller('book-review')
export class BookReviewController {
  constructor(private readonly bookReviewService: BookReviewService) {}

  @Post()
  create(@Body() createBookReviewDto: CreateBookReviewDto) {
    return this.bookReviewService.create(createBookReviewDto);
  }

  @Get()
  findAll() {
    return this.bookReviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookReviewService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookReviewDto: UpdateBookReviewDto,
  ) {
    return this.bookReviewService.update(+id, updateBookReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookReviewService.remove(+id);
  }
}
