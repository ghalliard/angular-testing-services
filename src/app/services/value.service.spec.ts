// import { TestBed } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { ValueService } from './value.service';

fdescribe('ValueService', () => {
  let service: ValueService;

  beforeEach(() =>{
    TestBed.configureTestingModule({
      providers: [ ValueService ]
    });
    service = TestBed.inject(ValueService);
  });

  it('ValueService debe ser creado', () =>{
    expect(service).toBeTruthy();
  });

  describe('test para getValue', () =>{
    it('deberia retonar el estado de value', () =>{
      expect(service.getValue()).toBe('my value');
    });
  });

  describe('test para setValue', () =>{
    it('deberia cambiar el value', () =>{
      const nuevoValor = 'Hola mundo';
      service.setValue(nuevoValor);
      expect(service.getValue()).toBe(nuevoValor);
    });

    it('No deberia cambiar el valor si el nuevo valor es un numero', () =>{
      const nuevoValor = '10';
      service.setValue(nuevoValor);
      expect(service.getValue()).toBe('my value');
    });
  });

  describe('test para getPromiseValue', () =>{
    it('Deberia retornar un string desde una promesa sin await', (doneFn) =>{
      service.getPromiseValue()
      .then(response =>{
        expect(response).toBe('Promise value');
        doneFn();
      });
    });

    it('Deberia retornar un string desde una promesa con await', async () =>{
      const response = await service.getPromiseValue();
      expect(response).toBe('Promise value');
    });
  });

  describe('test para getObservableValue', () =>{
    it('Deberia retornar un string desde un observable sin async', (doneFn) =>{
      service.getObservableValue()
      .subscribe(value =>{
        expect(value).toBe('Observable value');
        doneFn()
      });
    });

  });
});
