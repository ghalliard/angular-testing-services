import { faker, simpleFaker } from '@faker-js/faker';
import { Product } from '../product.model';

export const generateOneProduct = (): Product =>{
  return {
    id: simpleFaker.string.uuid(),
    title: faker.commerce.productName(),
    price: parseInt(faker.commerce.price(), 10),
    images: [
      faker.image.urlPicsumPhotos(),
      faker.image.urlPicsumPhotos(),
      faker.image.urlPicsumPhotos(),
    ],
    description: faker.commerce.productDescription(),
    category: {
      id: faker.number.int(),
      name: faker.commerce.department(),
    },
  }
}

export const generateManyProducts = (cantidadProductos = 2): Product[] =>{
  let productos: Product[] = [];
  if(cantidadProductos === 0){
    return productos;
  }
  for(let i = 0; i < cantidadProductos; i++){
    productos.push(generateOneProduct());
  }
  return productos;
}
