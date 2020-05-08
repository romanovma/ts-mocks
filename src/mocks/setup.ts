import { Mock } from "./mock";
import Spy = jest.SpyInstance;

export class Setup<T, TReturn> {
  private spy: Spy;

  constructor(private mock: Mock<T>, private key: string) {
    mock.Object[key] = <T>{};
    this.spy = jest.spyOn(mock.Object as any, key as Extract<keyof T, string>);
  }

  public get Spy() {
    return this.spy;
  }

  /** Setup the return value for the setup of the property */
  public is(value: TReturn): Mock<T> {
    this.mock.Object[this.key] = value;
    if (typeof value === "function") {
      this.spy = jest.spyOn(
        this.mock.Object as any,
        this.key as keyof T & string
      );
    }
    return this.mock;
  }

  /**
   * Specify the return value of the property / method
   * Can be used when mocking generic methods.
   */
  public as<TReturnAs>(): Setup<T, TReturnAs> {
    return new Setup(this.mock, this.key);
  }
}
