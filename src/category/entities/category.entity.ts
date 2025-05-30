import { Book } from 'src/books/entities/book.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // relationship
  @ManyToMany(() => Book, (book) => book.categories)
  books: Book[];
}
