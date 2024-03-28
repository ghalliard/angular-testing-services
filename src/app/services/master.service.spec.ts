import { ValueService } from './value.service';
import { MasterService } from './master.service';
import { TestBed, inject } from '@angular/core/testing';

fdescribe('MasterService', () => {
  let masterService: MasterService;
  let valueServiceSpy: jasmine.SpyObj<ValueService>;

  beforeEach(() =>{
    const spy = jasmine.createSpyObj('ValueService', ['getValue']);

    TestBed.configureTestingModule({
      providers: [
        MasterService,
        {
          provide: ValueService,
          useValue: spy
        }
      ]
    });
    masterService = TestBed.inject(MasterService);
    valueServiceSpy = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;
  });

  it('MasterService deberia ser creado', () =>{
    expect(masterService).toBeTruthy();
  });

  /*
  it('Deberia retornar "my value" desde value service, el servicio real', () =>{
    let valueService = new ValueService();
    let service = new MasterService(valueService);
    expect(service.getValue()).toBe('my value');
  });
  */

  //it('deberia retornar "other value" desde un servicio fake')
  it('deberia llamar al spy de value service', () =>{
    // creamos el mock que se puede espiar.
    // const valueServiceSpy: jasmine.SpyObj<ValueService> = jasmine.createSpyObj('ValueService', ['getValue']);
    valueServiceSpy.getValue.and.returnValue('fake value');
    // creamos el mock
    // const masterService = new MasterService(valueServiceSpy);
    expect(masterService.getValue()).toBe('fake value');
    expect(valueServiceSpy.getValue).toHaveBeenCalled();
    expect(valueServiceSpy.getValue).toHaveBeenCalledTimes(1);
  });
});
