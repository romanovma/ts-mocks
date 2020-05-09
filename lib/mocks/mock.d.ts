/// <reference types="jest" />
import { Setup } from "./setup";
/** Class for mocking objects/interfaces in Typescript */
export declare class Mock<T> {
    /**
     * Can be used to define empty methods when using extend
     * mock.extend({ someMethod: Mock.ANY_FUNC });
     */
    static ANY_FUNC: () => any;
    /** Create mock from a Type */
    static of<T>(type: {
        new (): T;
    }): Mock<T>;
    static static<T, K extends keyof T & string>(obj: T, key: K, stub: T[K] & Function): void;
    private _object;
    private _spies;
    constructor(object?: Partial<{
        [key in Extract<keyof T, string>]: any;
    }> | T);
    /** Return the mocked object */
    readonly Object: T;
    /** Extend the current mock object with implementation */
    extend(object: Partial<{
        [key in Extract<keyof T, string>]: any;
    }>): this;
    /**
     * Setup a property or a method with using lambda style settings.
     * @param propertyName can be used as a fallback for environments where
     * dynamic inferring of `propertyName` is not possible.
     * For example, can be helpful in Wallaby.js test runner.
     */
    setup<TProp>(value: (obj: T) => TProp, propertyName?: string): Setup<T, TProp>;
    private getPropertyName;
    /**
     * Get the spy of method or property that has be set with extend of setup/is.
     * @param propertyName can be used as a fallback for environments where
     * dynamic inferring of `propertyName` is not possible.
     * For example, can be helpful in Wallaby.js test runner.
     */
    spyOf<TProp>(value: (obj: T) => TProp, propertyName?: string): jest.SpyInstance;
}
