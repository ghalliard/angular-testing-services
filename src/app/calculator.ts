export class Calculator{
  public static multiplicar(a: number, b: number): number{
    return a * b;
  }

  public static dividir(a: number, b: number){
    if(b === 0){
      return null;
    }
    return a / b;
  }
}
