import { Author } from 'src/authors/entities/author.entity';
import { BookReview } from 'src/book-review/entities/book-review.entity';
import { Category } from 'src/category/entities/category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  publicationYear: number;

  @Column({ type: 'bool', default: true })
  isAvailable: boolean;

  // relationships
  // user who wrote
  @ManyToOne(() => Author, (author) => author.writtenBooks)
  bookOwner: Author;
  // reviews
  @OneToMany(() => BookReview, (bookReview) => bookReview.bookReviewed)
  reviews: BookReview[];
  // categories
  @ManyToMany(() => Category, (category) => category.books)
  @JoinTable()
  categories: Category[];
}
