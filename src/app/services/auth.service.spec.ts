import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TokenService } from './token.service';
import { Auth } from '../models/auth.model';
import { environment } from 'src/environments/environment';

fdescribe('AuthService', () => {
  let service: AuthService;
  let tokenService: TokenService;
  let httpController: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AuthService,
        TokenService
      ]
    });
    service = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() =>{
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Pruebas para login', () =>{
    it('Deberia retornar el token de acceso', (doneFn) =>{
      const mockData: Auth = {
        access_token: '123'
      };

      // act
      service.login('string', 'string')
      .subscribe(res =>{
        expect(res).toEqual(mockData);
        doneFn();
      });

      const req = httpController.expectOne(`${environment.API_URL}/api/v1/auth/login`);
      req.flush(mockData);
      expect(req.request.method).toEqual('POST');
    });

    it('Deberia ejecutar saveToken al hacer el login', (doneFn) =>{
      const mockData: Auth = {
        access_token: '123'
      };
      spyOn(tokenService, 'saveToken').and.callThrough();

      // act
      service.login('string', 'string')
      .subscribe(res =>{
        expect(res).toEqual(mockData);
        expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
        expect(tokenService.saveToken).toHaveBeenCalledOnceWith(mockData.access_token);
        doneFn();
      });

      const req = httpController.expectOne(`${environment.API_URL}/api/v1/auth/login`);
      req.flush(mockData);
      expect(req.request.method).toEqual('POST');
    });
  });
});
