import { Category } from './category.model';


export interface Product{
  id: string;
  title: string;
  price: number;
  images: string[];
  description: string;
  category: Category;
  taxes?: number;
}

export interface CreateProductDto extends Omit<Product, 'id' | 'category'>{
  categoryId: number;
}

export interface UpdateProductDto extends Partial<CreateProductDto>{}
