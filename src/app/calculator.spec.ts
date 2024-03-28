import { Calculator } from "./calculator";

describe('Test for calculator', () =>{
  describe('Test para multiplicar', () =>{
    it('multiplicar should return nine', () =>{
      /// AAA: mantra
      /// Arrange -> preparar
      const b = 3;
      const a = 3;
      /// Act -> actuar
      const response = Calculator.multiplicar(a, b);
      /// Assert -> resolver la hipotesis
      expect(response)
      .toEqual(9)
    });
  });

  describe('test para dividir', () =>{
    it('dividir should return null if denominator is cero', () =>{
      expect(Calculator.dividir(9, 0))
      .toBeNull();
    });

    it('dividir should return a number', () =>{
      expect(Calculator.dividir(9, 3))
      .toEqual(3);
    });
  });

});


