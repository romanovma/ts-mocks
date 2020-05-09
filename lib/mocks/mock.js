"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var setup_1 = require("./setup");
/** Class for mocking objects/interfaces in Typescript */
var Mock = /** @class */ (function () {
    function Mock(object) {
        if (object === void 0) { object = {}; }
        this._object = {};
        this._spies = new Map();
        this._object = object;
        this.extend(object);
    }
    /** Create mock from a Type */
    Mock.of = function (type) {
        return new Mock(new type());
    };
    Mock.static = function (obj, key, stub) {
        jest.spyOn(obj, key).mockImplementation(stub);
        obj[key].mockClear(); // tslint:disable-line:no-unsafe-any
    };
    Object.defineProperty(Mock.prototype, "Object", {
        /** Return the mocked object */
        get: function () {
            return this._object;
        },
        enumerable: true,
        configurable: true
    });
    /** Extend the current mock object with implementation */
    Mock.prototype.extend = function (object) {
        var _this = this;
        Object.keys(object).forEach(function (key) {
            if (typeof object[key] === typeof Function) {
                var spy_1 = jest.spyOn(object, key);
                _this._spies.set(key, function () { return spy_1; });
            }
        });
        Object.assign(this._object, object);
        return this;
    };
    /**
     * Setup a property or a method with using lambda style settings.
     * @param propertyName can be used as a fallback for environments where
     * dynamic inferring of `propertyName` is not possible.
     * For example, can be helpful in Wallaby.js test runner.
     */
    Mock.prototype.setup = function (value, propertyName) {
        if (!propertyName) {
            propertyName = this.getPropertyName(value);
        }
        var setup = new setup_1.Setup(this, propertyName);
        this._spies.set(propertyName, function () { return setup.Spy; });
        return setup;
    };
    Mock.prototype.getPropertyName = function (value) {
        return value.toString().match(/(return|=>)\s[\w\d_]*\.([\w\d$_]*)\;?/)[2];
    };
    /**
     * Get the spy of method or property that has be set with extend of setup/is.
     * @param propertyName can be used as a fallback for environments where
     * dynamic inferring of `propertyName` is not possible.
     * For example, can be helpful in Wallaby.js test runner.
     */
    Mock.prototype.spyOf = function (value, propertyName) {
        if (!propertyName) {
            propertyName = this.getPropertyName(value);
        }
        if (this._spies.has(propertyName)) {
            return this._spies.get(propertyName)();
        }
        return undefined;
    };
    /**
     * Can be used to define empty methods when using extend
     * mock.extend({ someMethod: Mock.ANY_FUNC });
     */
    Mock.ANY_FUNC = function () { return undefined; };
    return Mock;
}());
exports.Mock = Mock;
//# sourceMappingURL=mock.js.map