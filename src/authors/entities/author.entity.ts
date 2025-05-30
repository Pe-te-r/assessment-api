import { Book } from 'src/books/entities/book.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Author {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'date', nullable: true })
  birthDate?: Date;

  @Column({ type: 'bool', default: true })
  isActive: boolean;

  // relationships
  // books
  @OneToMany(() => Book, (book) => book.bookOwner)
  writtenBooks: Book[];
}
