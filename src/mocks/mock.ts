import { Setup } from "./setup";

/** Class for mocking objects/interfaces in Typescript */
export class Mock<T> {
  /**
   * Can be used to define empty methods when using extend
   * mock.extend({ someMethod: Mock.ANY_FUNC });
   */
  public static ANY_FUNC = () => undefined;

  /** Create mock from a Type */
  public static of<T>(type: { new (): T }): Mock<T> {
    return new Mock<T>(new type());
  }

  public static static<T, K extends keyof T & string>(
    obj: T,
    key: K,
    stub: T[K] & Function
  ): void {
    jest.spyOn(obj as any, key).mockImplementation(stub as any);
    (obj[key] as any).mockClear(); // tslint:disable-line:no-unsafe-any
  }

  private _object: T = <T>{};
  private _spies: Map<string, () => jest.SpyInstance> = new Map<
    string,
    () => jest.SpyInstance
  >();

  constructor(
    object: Partial<{ [key in Extract<keyof T, string>]: any }> | T = <T>{}
  ) {
    this._object = object as T;
    this.extend(object);
  }

  /** Return the mocked object */
  public get Object(): T {
    return <T>this._object;
  }

  /** Extend the current mock object with implementation */
  public extend(
    object: Partial<{ [key in Extract<keyof T, string>]: any }>
  ): this {
    Object.keys(object).forEach((key: Extract<keyof T, string>) => {
      if (typeof object[key] === typeof Function) {
        const spy = jest.spyOn(object as any, key);
        this._spies.set(key, () => spy);
      }
    });
    Object.assign(this._object, object);
    return this;
  }

  /**
   * Setup a property or a method with using lambda style settings.
   * @param propertyName can be used as a fallback for environments where
   * dynamic inferring of `propertyName` is not possible.
   * For example, can be helpful in Wallaby.js test runner.
   */
  public setup<TProp>(
    value: (obj: T) => TProp,
    propertyName?: string
  ): Setup<T, TProp> {
    if (!propertyName) {
      propertyName = this.getPropertyName(value);
    }

    let setup = new Setup(this, propertyName);
    this._spies.set(propertyName, () => setup.Spy);
    return setup;
  }

  private getPropertyName<TProp>(value: (obj: T) => TProp): string {
    return value.toString().match(/(return|=>)\s[\w\d_]*\.([\w\d$_]*)\;?/)[2];
  }

  /**
   * Get the spy of method or property that has be set with extend of setup/is.
   * @param propertyName can be used as a fallback for environments where
   * dynamic inferring of `propertyName` is not possible.
   * For example, can be helpful in Wallaby.js test runner.
   */
  public spyOf<TProp>(
    value: (obj: T) => TProp,
    propertyName?: string
  ): jest.SpyInstance {
    if (!propertyName) {
      propertyName = this.getPropertyName(value);
    }

    if (this._spies.has(propertyName)) {
      return this._spies.get(propertyName)();
    }
    return undefined;
  }
}
