import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { apiSuccessResponse } from 'src/common/createReponseObject'; // Ensure this path is correct

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  private async findCategoryOrFail(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['books'],
    });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    const savedCategory = await this.categoryRepository.save(category);
    return apiSuccessResponse(
      `Category created successfully with id ${savedCategory.id}`,
    );
  }

  async findAll() {
    const categories = await this.categoryRepository.find({
      relations: ['books'],
    });

    if (categories.length === 0) {
      throw new NotFoundException('No categories found');
    }

    return apiSuccessResponse(
      'All categories fetched successfully',
      categories,
    );
  }

  async findOne(id: string) {
    const category = await this.findCategoryOrFail(id);
    return apiSuccessResponse(
      `Category with id ${id} fetched successfully`,
      category,
    );
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findCategoryOrFail(id);
    Object.assign(category, updateCategoryDto);
    const updated = await this.categoryRepository.save(category);

    return apiSuccessResponse(
      `Category with id ${id} updated successfully`,
      updated,
    );
  }

  async remove(id: string) {
    const category = await this.findCategoryOrFail(id);
    await this.categoryRepository.remove(category);

    return apiSuccessResponse<null>(`Category with id ${id} removed`);
  }
}
