"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Setup = /** @class */ (function () {
    function Setup(mock, key) {
        this.mock = mock;
        this.key = key;
        mock.Object[key] = {};
        this.spy = jest.spyOn(mock.Object, key);
    }
    Object.defineProperty(Setup.prototype, "Spy", {
        get: function () {
            return this.spy;
        },
        enumerable: true,
        configurable: true
    });
    /** Setup the return value for the setup of the property */
    Setup.prototype.is = function (value) {
        this.mock.Object[this.key] = value;
        if (typeof value === "function") {
            this.spy = jest.spyOn(this.mock.Object, this.key);
        }
        return this.mock;
    };
    /**
     * Specify the return value of the property / method
     * Can be used when mocking generic methods.
     */
    Setup.prototype.as = function () {
        return new Setup(this.mock, this.key);
    };
    return Setup;
}());
exports.Setup = Setup;
//# sourceMappingURL=setup.js.map