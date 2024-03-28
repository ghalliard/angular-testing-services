import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProductsService } from './product.service';
import { CreateProductDto, Product, UpdateProductDto } from '../models/product.model';
import { environment } from 'src/environments/environment';
import { generateManyProducts, generateOneProduct } from '../models/mocks/product.mock';
import { HTTP_INTERCEPTORS, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { TokenInterceptor } from '../interceptor/token.interceptor';
import { TokenService } from './token.service';

fdescribe('ProductService', () => {
  let service: ProductsService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ProductsService,
        TokenService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true
        }
      ]
    });
    service = TestBed.inject(ProductsService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() =>{
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Pruebas para el metodo getAllSimple', () =>{
    it('deberia retornar una lista de productos con interceptor', (doneFn) =>{
      // arrange
      const cantidadProductos = 5;
      const mockData: Product[] = generateManyProducts(cantidadProductos);
      spyOn(tokenService, 'getToken').and.returnValue('123');

      // act
      service.getAllSimple()
      .subscribe(value =>{
        // assert
        expect(value.length).toEqual(cantidadProductos);
        expect(value).toEqual(mockData);
        doneFn();
      })

      // http config
      const req = httpController.expectOne(`${environment.API_URL}/api/v1/products`);
      const headers = req.request.headers;
      req.flush(mockData);
      expect(headers.get('Authorization')).toEqual('Bearer 123');
    });
  });

  describe('Pruebas para el metodo getAll', () =>{
    it('Deberia retornar la cantidad de productos', (doneFn) =>{
      const cantidadProductos = 3;
      const mockData = generateManyProducts(cantidadProductos);

      service.getAll()
      .subscribe(value =>{
        // assert
        expect(value.length).toEqual(cantidadProductos);
        doneFn();
      });

      // http config
      const req = httpController.expectOne(`${environment.API_URL}/api/v1/products`);
      req.flush(mockData);
    });

    it('Deberia retornar una lista de productos con taxes', (doneFn) =>{
      const mockData = [
        {
          ...generateOneProduct(),
          price: 100, // taxes = 19
        },
        {
          ...generateOneProduct(),
          price: 200, // taxes = 38
        },
        {
          ...generateOneProduct(),
          price: 0, // taxes = 0
        },
        {
          ...generateOneProduct(),
          price: -200, // taxes = 0
        },
      ];

      service.getAll()
      .subscribe(value =>{
        // assert
        expect(value.length).toEqual(mockData.length);
        expect(value[0].taxes).toEqual(19);
        expect(value[1].taxes).toEqual(38);
        expect(value[2].taxes).toEqual(0);
        expect(value[3].taxes).toEqual(0);
        doneFn();
      });

      // http config
      const req = httpController.expectOne(`${environment.API_URL}/api/v1/products`);
      req.flush(mockData);
    });

    it('Deberia enviar los query params: limit 10 y offset 3', (doneFn) =>{
      const limit = 10;
      const offset = 3;
      const mockData = generateManyProducts(limit);

      service.getAll(limit, offset)
      .subscribe(value =>{
        // assert
        expect(value.length).toEqual(limit);
        doneFn();
      });

      // http config
      const req = httpController.expectOne(`${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`);
      req.flush(mockData);
      const params = req.request.params;
      expect(params.get('limit')).toEqual(limit.toString());
      expect(params.get('offset')).toEqual(offset.toString());
    });

    it('Deberia retornar un array vacío cuando el limit es 0 y offset 0', (doneFn) =>{
      const limit = 0;
      const offset = 0;
      const mockData = generateManyProducts(limit);

      service.getAll(limit, offset)
      .subscribe(value =>{
        // assert
        expect(value.length).toEqual(limit);
        expect(value).toEqual(mockData);
        doneFn();
      });

      // http config
      const req = httpController.expectOne(`${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`);
      req.flush(mockData);
      const params = req.request.params;
      expect(params.get('limit')).toEqual(limit.toString());
      expect(params.get('offset')).toEqual(offset.toString());
    });

    it('Deberia retornar una lista de productos cuando limit o offset son negativos', (doneFn) =>{
      const limit = -5;
      const offset = -3;
      const mockData = generateManyProducts(5);

      service.getAll(limit, offset)
      .subscribe(value =>{
        // assert
        expect(value.length).toEqual(mockData.length);
        doneFn();
      });

      // http config
      const req = httpController.expectOne(`${environment.API_URL}/api/v1/products`);
      req.flush(mockData);
      const params = req.request.params;
      expect(params.get('limit')).toBeNull();
      expect(params.get('offset')).toBeNull();
    });
  });

  describe('Pruebas para método POST: create', () =>{
    it('Debería retornar un nuevo producto', (doneFn) =>{
      // Arrange
      const mockData = generateOneProduct();
      const dto: CreateProductDto = {
        title: 'new product',
        price: 100,
        images: ['img'],
        description: 'string de prueba',
        categoryId: 14
      }
      // Act
      service.create({...dto})
      .subscribe(product =>{
        // Assert
        expect(product).toEqual(mockData);
        doneFn();
      });

      // http config
      const req = httpController.expectOne(`${environment.API_URL}/api/v1/products`);
      req.flush(mockData);
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('POST');
    });
  });

  describe('Pruebas para delete', () =>{
    it('Debería retornar TRUE', (doneFn) =>{
      // arange
      const id = '2';

      // act

      service.delete(id)
      .subscribe(res =>{
        expect(res).toBeTruthy();
        doneFn();
      });

      const req = httpController.expectOne(`${environment.API_URL}/api/v1/products/${id}`);
      req.flush(true);
      expect(req.request.method).toEqual('DELETE');
    })
  });

  describe('Pruebas para update', () =>{
    it('Debería retornar un producto actualizado', (doneFn) =>{
      const id = '3';
      const dto: UpdateProductDto = {
        title: 'new title',
        price: 25,
      };
      const mockData = generateOneProduct();

      service.update(id, {...dto})
      .subscribe(res =>{
        expect(res).toEqual(mockData);
        doneFn();
      });

      const req = httpController.expectOne(`${environment.API_URL}/api/v1/products/${id}`);
      req.flush(mockData);
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('PUT');

    });
  });

  describe('Pruebas para getOne', () =>{
    it('Debería retornar un producto', (doneFn) =>{
      const id = '3';
      const mockData = generateOneProduct();

      service.getOne(id)
      .subscribe(res =>{
        expect(res).toEqual(mockData);
        doneFn();
      });

      const req = httpController.expectOne(`${environment.API_URL}/api/v1/products/${id}`);
      req.flush(mockData);
      expect(req.request.method).toEqual('GET');
    });

    it('Deberia retornar "El producto no existe" cuando el servicio responde 404', (doneFn) =>{
      const productId = '2';
      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: 'NOT FOUND'
      };

      service.getOne(productId)
      .subscribe({
        error: (err: string) =>{
          expect(err).toEqual('El producto no existe');
          doneFn();
        }
      });

      const req = httpController.expectOne(`${environment.API_URL}/api/v1/products/${productId}`);
      req.flush(null, mockError);
      expect(req.request.method).toEqual('GET');
    })
  });
});
