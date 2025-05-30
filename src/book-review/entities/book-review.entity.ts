import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
@Entity()
export class BookReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column('int')
  rating: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  // relationships
  // user_reviews
  @ManyToOne(() => User, (user) => user.reviews)
  reviewedBy: User;
  // book
  @ManyToOne(() => Book, (book) => book.reviews)
  bookReviewed: Book;
}
