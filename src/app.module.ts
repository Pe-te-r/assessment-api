import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { AuthorsModule } from './authors/authors.module';
import { BooksModule } from './books/books.module';
import { CategoryModule } from './category/category.module';
import { BookReviewModule } from './book-review/book-review.module';

@Module({
  imports: [
    UsersModule,
    ProfilesModule,
    AuthorsModule,
    BooksModule,
    CategoryModule,
    BookReviewModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
