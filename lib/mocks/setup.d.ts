/// <reference types="jest" />
import { Mock } from "./mock";
import Spy = jest.SpyInstance;
export declare class Setup<T, TReturn> {
    private mock;
    private key;
    private spy;
    constructor(mock: Mock<T>, key: string);
    readonly Spy: Spy<any, any>;
    /** Setup the return value for the setup of the property */
    is(value: TReturn): Mock<T>;
    /**
     * Specify the return value of the property / method
     * Can be used when mocking generic methods.
     */
    as<TReturnAs>(): Setup<T, TReturnAs>;
}
