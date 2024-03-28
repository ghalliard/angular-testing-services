import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValueService {
  private value = 'my value';

  constructor() { }

  getValue(): string{
    return this.value;
  }

  setValue(newValue: string){
    const reg = /^[A-Za-z ]+$/;
    if(reg.test(newValue)){
      this.value = newValue;
    }
  }

  getPromiseValue(){
    return Promise.resolve('Promise value');
  }

  getObservableValue(){
    return of('Observable value');
  }

}
