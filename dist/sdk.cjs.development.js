'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var JSBI = _interopDefault(require('jsbi'));
var invariant = _interopDefault(require('tiny-invariant'));
var warning = _interopDefault(require('tiny-warning'));
var address = require('@ethersproject/address');
var _Big = _interopDefault(require('big.js'));
var toFormat = _interopDefault(require('toformat'));
var bignumber = require('@ethersproject/bignumber');
var _Decimal = _interopDefault(require('decimal.js-light'));
var solidity = require('@ethersproject/solidity');
var ethers = require('ethers');
var contracts = require('@ethersproject/contracts');
var networks = require('@ethersproject/networks');
var providers = require('@ethersproject/providers');
var IPancakePair = _interopDefault(require('@pancakeswap-libs/pancake-swap-core/build/IPancakePair.json'));

var _SOLIDITY_TYPE_MAXIMA;

(function (ChainId) {
  ChainId[ChainId["BSC_MAINNET"] = 56] = "BSC_MAINNET";
  ChainId[ChainId["BSC_TESTNET"] = 97] = "BSC_TESTNET";
  ChainId[ChainId["AVAX_MAINNET"] = 43114] = "AVAX_MAINNET";
  ChainId[ChainId["AVAX_TESTNET"] = 43113] = "AVAX_TESTNET";
  ChainId[ChainId["ARBITRUM_MAINNET"] = 42161] = "ARBITRUM_MAINNET";
  ChainId[ChainId["ARBITRUM_TETSNET_RINKEBY"] = 421611] = "ARBITRUM_TETSNET_RINKEBY";
  ChainId[ChainId["MATIC_MAINNET"] = 137] = "MATIC_MAINNET";
  ChainId[ChainId["MATIC_TESTNET"] = 80001] = "MATIC_TESTNET";
  ChainId[ChainId["OASIS_TESTNET"] = 42261] = "OASIS_TESTNET";
  ChainId[ChainId["OASIS_MAINNET"] = 42262] = "OASIS_MAINNET";
  ChainId[ChainId["QUARKCHAIN_DEV_S0"] = 110001] = "QUARKCHAIN_DEV_S0";
})(exports.ChainId || (exports.ChainId = {}));

(function (TradeType) {
  TradeType[TradeType["EXACT_INPUT"] = 0] = "EXACT_INPUT";
  TradeType[TradeType["EXACT_OUTPUT"] = 1] = "EXACT_OUTPUT";
})(exports.TradeType || (exports.TradeType = {}));

(function (Rounding) {
  Rounding[Rounding["ROUND_DOWN"] = 0] = "ROUND_DOWN";
  Rounding[Rounding["ROUND_HALF_UP"] = 1] = "ROUND_HALF_UP";
  Rounding[Rounding["ROUND_UP"] = 2] = "ROUND_UP";
})(exports.Rounding || (exports.Rounding = {}));

var FACTORY_ADDRESS = {
  56: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
  97: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
  80001: '0xf10Bd0dA1f0e69c3334D7F8116C9082746EBC1B4',
  43113: '0xC07098cdCf93b2dc5c20E749cDd1ba69cB9AcEBe'
};
var WEIGHTED_FACTORY_ADDRESS = {
  43113: '0xacd3602152763C3AAFA705D8a90C36661ecD7d46',
  42261: '0x274B1F7F8e66B044B2DC773E017750957f70490c',
  110001: '0xe092CB3124aF36a0B851839D8EC51CaaD9a3DCD0'
}; // export const INIT_CODE_HASH = '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5'

var INIT_CODE_HASH = {
  56: '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5',
  97: '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5',
  80001: '0xc2b3644608b464a0df0eb711ce9c6ce7535d1bd4d0154b8389738a3e7fbb1a61',
  43113: '0x0865ff20af2c8d0b18c74020d2df989c6840f40dbdc7f75f501820a7122786e4'
};
var INIT_CODE_HASH_WEIGHTED = {
  43113: '0xbeec252b6527ff023d9f20fa336f9f131a002be662ce64ef7f9ed17b5ea8b591',
  42261: '0x6a869d7b57f2343c50f107424e084e4fd94b6a55e3cb98b6a396730db3ab5363',
  110001: '0x0865ff20af2c8d0b18c74020d2df989c6840f40dbdc7f75f501820a7122786e4'
};
var STABLE_POOL_ADDRESS = {
  43113: '0x0Be60C571BdA7841D8F6eE68afDBa648EC710fD7',
  42261: '0x2a90276992ddC21C3585FE50f5B43D0Cf62aDe03',
  110001: '0x211F00f4071A4af8f0cC289d9853d778047DB8Ba'
};
var STABLE_POOL_LP_ADDRESS = {
  43113: '0x3372de341a07418765ae12f77aee9029eaa4442a',
  42261: '0x9364E91ca784ca51f88dE2a76a35Ba2665bdad04',
  110001: '0x029f9f8e2c27627341824120ee814F31a1551256'
};
var MINIMUM_LIQUIDITY = /*#__PURE__*/JSBI.BigInt(1000); // exports for internal consumption

var ZERO = /*#__PURE__*/JSBI.BigInt(0);
var ONE = /*#__PURE__*/JSBI.BigInt(1);
var TWO = /*#__PURE__*/JSBI.BigInt(2);
var THREE = /*#__PURE__*/JSBI.BigInt(3);
var FIVE = /*#__PURE__*/JSBI.BigInt(5);
var TEN = /*#__PURE__*/JSBI.BigInt(10);
var _100 = /*#__PURE__*/JSBI.BigInt(100);
var FEES_NUMERATOR = /*#__PURE__*/JSBI.BigInt(9975);
var FEES_DENOMINATOR = /*#__PURE__*/JSBI.BigInt(10000);
var SolidityType;

(function (SolidityType) {
  SolidityType["uint8"] = "uint8";
  SolidityType["uint256"] = "uint256";
})(SolidityType || (SolidityType = {}));

var SOLIDITY_TYPE_MAXIMA = (_SOLIDITY_TYPE_MAXIMA = {}, _SOLIDITY_TYPE_MAXIMA[SolidityType.uint8] = /*#__PURE__*/JSBI.BigInt('0xff'), _SOLIDITY_TYPE_MAXIMA[SolidityType.uint256] = /*#__PURE__*/JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'), _SOLIDITY_TYPE_MAXIMA);

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

// see https://stackoverflow.com/a/41102306
var CAN_SET_PROTOTYPE = ('setPrototypeOf' in Object);
/**
 * Indicates that the pair has insufficient reserves for a desired output amount. I.e. the amount of output cannot be
 * obtained by sending any amount of input.
 */

var InsufficientReservesError = /*#__PURE__*/function (_Error) {
  _inheritsLoose(InsufficientReservesError, _Error);

  function InsufficientReservesError() {
    var _this;

    _this = _Error.call(this) || this;
    _this.isInsufficientReservesError = true;
    _this.name = _this.constructor.name;
    if (CAN_SET_PROTOTYPE) Object.setPrototypeOf(_assertThisInitialized(_this), (this instanceof InsufficientReservesError ? this.constructor : void 0).prototype);
    return _this;
  }

  return InsufficientReservesError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * Indicates that the input amount is too small to produce any amount of output. I.e. the amount of input sent is less
 * than the price of a single unit of output after fees.
 */

var InsufficientInputAmountError = /*#__PURE__*/function (_Error2) {
  _inheritsLoose(InsufficientInputAmountError, _Error2);

  function InsufficientInputAmountError() {
    var _this2;

    _this2 = _Error2.call(this) || this;
    _this2.isInsufficientInputAmountError = true;
    _this2.name = _this2.constructor.name;
    if (CAN_SET_PROTOTYPE) Object.setPrototypeOf(_assertThisInitialized(_this2), (this instanceof InsufficientInputAmountError ? this.constructor : void 0).prototype);
    return _this2;
  }

  return InsufficientInputAmountError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

function validateSolidityTypeInstance(value, solidityType) {
  !JSBI.greaterThanOrEqual(value, ZERO) ?  invariant(false, value + " is not a " + solidityType + ".")  : void 0;
  !JSBI.lessThanOrEqual(value, SOLIDITY_TYPE_MAXIMA[solidityType]) ?  invariant(false, value + " is not a " + solidityType + ".")  : void 0;
} // warns if addresses are not checksummed

function validateAndParseAddress(address$1) {
  try {
    var checksummedAddress = address.getAddress(address$1);
    "development" !== "production" ? warning(address$1 === checksummedAddress, address$1 + " is not checksummed.") : void 0;
    return checksummedAddress;
  } catch (error) {
      invariant(false, address$1 + " is not a valid address.")  ;
  }
}
function parseBigintIsh(bigintIsh) {
  return bigintIsh instanceof JSBI ? bigintIsh : typeof bigintIsh === 'bigint' ? JSBI.BigInt(bigintIsh.toString()) : JSBI.BigInt(bigintIsh);
} // mock the on-chain sqrt function

function sqrt(y) {
  validateSolidityTypeInstance(y, SolidityType.uint256);
  var z = ZERO;
  var x;

  if (JSBI.greaterThan(y, THREE)) {
    z = y;
    x = JSBI.add(JSBI.divide(y, TWO), ONE);

    while (JSBI.lessThan(x, z)) {
      z = x;
      x = JSBI.divide(JSBI.add(JSBI.divide(y, x), x), TWO);
    }
  } else if (JSBI.notEqual(y, ZERO)) {
    z = ONE;
  }

  return z;
} // given an array of items sorted by `comparator`, insert an item into its sort index and constrain the size to
// `maxSize` by removing the last item

function sortedInsert(items, add, maxSize, comparator) {
  !(maxSize > 0) ?  invariant(false, 'MAX_SIZE_ZERO')  : void 0; // this is an invariant because the interface cannot return multiple removed items if items.length exceeds maxSize

  !(items.length <= maxSize) ?  invariant(false, 'ITEMS_SIZE')  : void 0; // short circuit first item add

  if (items.length === 0) {
    items.push(add);
    return null;
  } else {
    var isFull = items.length === maxSize; // short circuit if full and the additional item does not come before the last item

    if (isFull && comparator(items[items.length - 1], add) <= 0) {
      return add;
    }

    var lo = 0,
        hi = items.length;

    while (lo < hi) {
      var mid = lo + hi >>> 1;

      if (comparator(items[mid], add) <= 0) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }

    items.splice(lo, 0, add);
    return isFull ? items.pop() : null;
  }
}

var _Currency$NETWORK_CCY;
/**
 * A currency is any fungible financial instrument on Ethereum, including Ether and all ERC20 tokens.
 *
 * The only instance of the base class `Currency` is Ether.
 */

var Currency =
/**
 * Constructs an instance of the base class `Currency`. The only instance of the base class `Currency` is `Currency.ETHER`.
 * @param decimals decimals of the currency
 * @param symbol symbol of the currency
 * @param name of the currency
 */
function Currency(decimals, symbol, name) {
  validateSolidityTypeInstance(JSBI.BigInt(decimals), SolidityType.uint8);
  this.decimals = decimals;
  this.symbol = symbol;
  this.name = name;
};
/**
 * The only instance of the base class `Currency`.
 */

Currency.ETHER = /*#__PURE__*/new Currency(18, 'BNB', 'BNB');
Currency.NETWORK_CCY = (_Currency$NETWORK_CCY = {}, _Currency$NETWORK_CCY[exports.ChainId.BSC_MAINNET] = /*#__PURE__*/new Currency(18, 'BNB', 'BNB'), _Currency$NETWORK_CCY[exports.ChainId.BSC_TESTNET] = /*#__PURE__*/new Currency(18, 'BNB', 'BNB'), _Currency$NETWORK_CCY[exports.ChainId.ARBITRUM_MAINNET] = /*#__PURE__*/new Currency(18, 'ETH', 'ETH'), _Currency$NETWORK_CCY[exports.ChainId.ARBITRUM_TETSNET_RINKEBY] = /*#__PURE__*/new Currency(18, 'ETH', 'ETH'), _Currency$NETWORK_CCY[exports.ChainId.AVAX_MAINNET] = /*#__PURE__*/new Currency(18, 'AVAX', 'AVAX'), _Currency$NETWORK_CCY[exports.ChainId.AVAX_TESTNET] = /*#__PURE__*/new Currency(18, 'AVAX', 'AVAX'), _Currency$NETWORK_CCY[exports.ChainId.MATIC_MAINNET] = /*#__PURE__*/new Currency(18, 'MATIC', 'MATIC'), _Currency$NETWORK_CCY[exports.ChainId.MATIC_TESTNET] = /*#__PURE__*/new Currency(18, 'MATIC', 'MATIC'), _Currency$NETWORK_CCY[exports.ChainId.OASIS_MAINNET] = /*#__PURE__*/new Currency(10, 'ROSE', 'ROSE'), _Currency$NETWORK_CCY[exports.ChainId.OASIS_TESTNET] = /*#__PURE__*/new Currency(10, 'ROSE', 'ROSE'), _Currency$NETWORK_CCY[exports.ChainId.QUARKCHAIN_DEV_S0] = /*#__PURE__*/new Currency(18, 'QKC', 'QKC'), _Currency$NETWORK_CCY);
var NETWORK_CCY = Currency.NETWORK_CCY;
var ETHER = Currency.ETHER;

var _WETH, _WRAPPED_NETWORK_TOKE;
/**
 * Represents an ERC20 token with a unique address and some metadata.
 */

var Token = /*#__PURE__*/function (_Currency) {
  _inheritsLoose(Token, _Currency);

  function Token(chainId, address, decimals, symbol, name, projectLink) {
    var _this;

    _this = _Currency.call(this, decimals, symbol, name) || this;
    _this.chainId = chainId;
    _this.address = validateAndParseAddress(address);
    _this.projectLink = projectLink;
    return _this;
  }
  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */


  var _proto = Token.prototype;

  _proto.equals = function equals(other) {
    // short circuit on reference equality
    if (this === other) {
      return true;
    }

    return this.chainId === other.chainId && this.address === other.address;
  }
  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  ;

  _proto.sortsBefore = function sortsBefore(other) {
    !(this.chainId === other.chainId) ?  invariant(false, 'CHAIN_IDS')  : void 0;
    !(this.address !== other.address) ?  invariant(false, 'ADDRESSES')  : void 0;
    return this.address.toLowerCase() < other.address.toLowerCase();
  };

  return Token;
}(Currency);
/**
 * Compares two currencies for equality
 */

function currencyEquals(currencyA, currencyB) {
  if (currencyA instanceof Token && currencyB instanceof Token) {
    return currencyA.equals(currencyB);
  } else if (currencyA instanceof Token) {
    return false;
  } else if (currencyB instanceof Token) {
    return false;
  } else {
    return currencyA === currencyB;
  }
}
var WETH = (_WETH = {}, _WETH[exports.ChainId.BSC_MAINNET] = /*#__PURE__*/new Token(exports.ChainId.BSC_MAINNET, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'Wrapped BNB', 'https://www.binance.org'), _WETH[exports.ChainId.BSC_TESTNET] = /*#__PURE__*/new Token(exports.ChainId.BSC_TESTNET, '0xaE8E19eFB41e7b96815649A6a60785e1fbA84C1e', 18, 'WBNB', 'Wrapped BNB', 'https://www.binance.org'), _WETH[exports.ChainId.ARBITRUM_MAINNET] = /*#__PURE__*/new Token(exports.ChainId.ARBITRUM_MAINNET, '0xc778417E063141139Fce010982780140Aa0cD5Ab', 18, 'WETH', 'Wrapped ETH', 'https://www.binance.org'), _WETH[exports.ChainId.ARBITRUM_TETSNET_RINKEBY] = /*#__PURE__*/new Token(exports.ChainId.ARBITRUM_TETSNET_RINKEBY, '0xaE8E19eFB41e7b96815649A6a60785e1fbA84C1e', 18, 'WBNB', 'Wrapped BNB', 'https://www.binance.org'), _WETH[exports.ChainId.AVAX_MAINNET] = /*#__PURE__*/new Token(exports.ChainId.AVAX_MAINNET, '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', 18, 'WAVAX', 'Wrapped AVAX', 'https://www.binance.org'), _WETH[exports.ChainId.AVAX_TESTNET] = /*#__PURE__*/new Token(exports.ChainId.AVAX_TESTNET, '0xd00ae08403B9bbb9124bB305C09058E32C39A48c', 18, 'WAVAX', 'Wrapped AVAX', 'https://www.binance.org'), _WETH[exports.ChainId.MATIC_MAINNET] = /*#__PURE__*/new Token(exports.ChainId.MATIC_MAINNET, '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', 18, 'WMATIC', 'Wrapped MATIC', 'https://www.binance.org'), _WETH[exports.ChainId.MATIC_TESTNET] = /*#__PURE__*/new Token(exports.ChainId.MATIC_TESTNET, '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889', 18, 'WMATIC', 'Wrapped MATIC', 'https://www.binance.org'), _WETH); // this has not to be mixed up with the ERC20 token WETH on BSC or MATIC
// these are the respective wrapped network tokens, e.g. WBNB for Binance
// or WMATIC for Polygon

var WRAPPED_NETWORK_TOKENS = (_WRAPPED_NETWORK_TOKE = {}, _WRAPPED_NETWORK_TOKE[exports.ChainId.BSC_MAINNET] = /*#__PURE__*/new Token(exports.ChainId.BSC_MAINNET, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'Wrapped BNB', 'https://www.binance.org'), _WRAPPED_NETWORK_TOKE[exports.ChainId.BSC_TESTNET] = /*#__PURE__*/new Token(exports.ChainId.BSC_TESTNET, '0xaE8E19eFB41e7b96815649A6a60785e1fbA84C1e', 18, 'WBNB', 'Wrapped BNB', 'https://www.binance.org'), _WRAPPED_NETWORK_TOKE[exports.ChainId.ARBITRUM_MAINNET] = /*#__PURE__*/new Token(exports.ChainId.ARBITRUM_MAINNET, '0xc778417E063141139Fce010982780140Aa0cD5Ab', 18, 'WETH', 'Wrapped ETH', 'https://www.binance.org'), _WRAPPED_NETWORK_TOKE[exports.ChainId.ARBITRUM_TETSNET_RINKEBY] = /*#__PURE__*/new Token(exports.ChainId.ARBITRUM_TETSNET_RINKEBY, '0xaE8E19eFB41e7b96815649A6a60785e1fbA84C1e', 18, 'WBNB', 'Wrapped BNB', 'https://www.binance.org'), _WRAPPED_NETWORK_TOKE[exports.ChainId.AVAX_MAINNET] = /*#__PURE__*/new Token(exports.ChainId.AVAX_MAINNET, '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', 18, 'WAVAX', 'Wrapped AVAX', 'https://www.binance.org'), _WRAPPED_NETWORK_TOKE[exports.ChainId.AVAX_TESTNET] = /*#__PURE__*/new Token(exports.ChainId.AVAX_TESTNET, '0xd00ae08403B9bbb9124bB305C09058E32C39A48c', 18, 'WAVAX', 'Wrapped AVAX', 'https://www.binance.org'), _WRAPPED_NETWORK_TOKE[exports.ChainId.MATIC_MAINNET] = /*#__PURE__*/new Token(exports.ChainId.MATIC_MAINNET, '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', 18, 'WMATIC', 'Wrapped MATIC', 'https://www.binance.org'), _WRAPPED_NETWORK_TOKE[exports.ChainId.MATIC_TESTNET] = /*#__PURE__*/new Token(exports.ChainId.MATIC_TESTNET, '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889', 18, 'WMATIC', 'Wrapped MATIC', 'https://www.binance.org'), _WRAPPED_NETWORK_TOKE[exports.ChainId.OASIS_TESTNET] = /*#__PURE__*/new Token(exports.ChainId.OASIS_TESTNET, '0xfb40cd35C0cF322fA3cfB8D67b533Bd9ad7df056', 18, 'wROSE', 'Wrapped ROSE', 'https://docs.oasis.dev/'), _WRAPPED_NETWORK_TOKE[exports.ChainId.OASIS_MAINNET] = /*#__PURE__*/new Token(exports.ChainId.OASIS_MAINNET, '0xfb40cd35C0cF322fA3cfB8D67b533Bd9ad7df056', 18, 'wROSE', 'Wrapped ROSE', 'https://docs.oasis.dev/'), _WRAPPED_NETWORK_TOKE[exports.ChainId.QUARKCHAIN_DEV_S0] = /*#__PURE__*/new Token(exports.ChainId.OASIS_MAINNET, '0x56fB4da0E246003DEc7dD108e47f5d8e8F4cC493', 18, 'wQKC', 'Wrapped QKC', 'https://docs.oasis.dev/'), _WRAPPED_NETWORK_TOKE);

var _toSignificantRoundin, _toFixedRounding;
var Decimal = /*#__PURE__*/toFormat(_Decimal);
var Big = /*#__PURE__*/toFormat(_Big);
var toSignificantRounding = (_toSignificantRoundin = {}, _toSignificantRoundin[exports.Rounding.ROUND_DOWN] = Decimal.ROUND_DOWN, _toSignificantRoundin[exports.Rounding.ROUND_HALF_UP] = Decimal.ROUND_HALF_UP, _toSignificantRoundin[exports.Rounding.ROUND_UP] = Decimal.ROUND_UP, _toSignificantRoundin);
var toFixedRounding = (_toFixedRounding = {}, _toFixedRounding[exports.Rounding.ROUND_DOWN] = 0, _toFixedRounding[exports.Rounding.ROUND_HALF_UP] = 1, _toFixedRounding[exports.Rounding.ROUND_UP] = 3, _toFixedRounding);
var Fraction = /*#__PURE__*/function () {
  function Fraction(numerator, denominator) {
    if (denominator === void 0) {
      denominator = ONE;
    }

    this.numerator = parseBigintIsh(numerator);
    this.denominator = parseBigintIsh(denominator);
  } // performs floor division


  var _proto = Fraction.prototype;

  _proto.invert = function invert() {
    return new Fraction(this.denominator, this.numerator);
  };

  _proto.add = function add(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));

    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(JSBI.add(this.numerator, otherParsed.numerator), this.denominator);
    }

    return new Fraction(JSBI.add(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator)), JSBI.multiply(this.denominator, otherParsed.denominator));
  };

  _proto.subtract = function subtract(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));

    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(JSBI.subtract(this.numerator, otherParsed.numerator), this.denominator);
    }

    return new Fraction(JSBI.subtract(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator)), JSBI.multiply(this.denominator, otherParsed.denominator));
  };

  _proto.lessThan = function lessThan(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return JSBI.lessThan(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator));
  };

  _proto.equalTo = function equalTo(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return JSBI.equal(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator));
  };

  _proto.greaterThan = function greaterThan(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return JSBI.greaterThan(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator));
  };

  _proto.multiply = function multiply(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return new Fraction(JSBI.multiply(this.numerator, otherParsed.numerator), JSBI.multiply(this.denominator, otherParsed.denominator));
  };

  _proto.divide = function divide(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return new Fraction(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(this.denominator, otherParsed.numerator));
  };

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (format === void 0) {
      format = {
        groupSeparator: ''
      };
    }

    if (rounding === void 0) {
      rounding = exports.Rounding.ROUND_HALF_UP;
    }

    !Number.isInteger(significantDigits) ?  invariant(false, significantDigits + " is not an integer.")  : void 0;
    !(significantDigits > 0) ?  invariant(false, significantDigits + " is not positive.")  : void 0;
    Decimal.set({
      precision: significantDigits + 1,
      rounding: toSignificantRounding[rounding]
    });
    var quotient = new Decimal(this.numerator.toString()).div(this.denominator.toString()).toSignificantDigits(significantDigits);
    return quotient.toFormat(quotient.decimalPlaces(), format);
  };

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (format === void 0) {
      format = {
        groupSeparator: ''
      };
    }

    if (rounding === void 0) {
      rounding = exports.Rounding.ROUND_HALF_UP;
    }

    !Number.isInteger(decimalPlaces) ?  invariant(false, decimalPlaces + " is not an integer.")  : void 0;
    !(decimalPlaces >= 0) ?  invariant(false, decimalPlaces + " is negative.")  : void 0;
    Big.DP = decimalPlaces;
    Big.RM = toFixedRounding[rounding];
    return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(decimalPlaces, format);
  };

  _createClass(Fraction, [{
    key: "quotient",
    get: function get() {
      return JSBI.divide(this.numerator, this.denominator);
    } // remainder after floor division

  }, {
    key: "remainder",
    get: function get() {
      return new Fraction(JSBI.remainder(this.numerator, this.denominator), this.denominator);
    }
  }]);

  return Fraction;
}();

var Big$1 = /*#__PURE__*/toFormat(_Big);
var CurrencyAmount = /*#__PURE__*/function (_Fraction) {
  _inheritsLoose(CurrencyAmount, _Fraction);

  // amount _must_ be raw, i.e. in the native representation
  function CurrencyAmount(currency, amount) {
    var _this;

    var parsedAmount = parseBigintIsh(amount);
    validateSolidityTypeInstance(parsedAmount, SolidityType.uint256);
    _this = _Fraction.call(this, parsedAmount, JSBI.exponentiate(TEN, JSBI.BigInt(currency.decimals))) || this;
    _this.currency = currency;
    return _this;
  }
  /**
   * Helper that calls the constructor with the ETHER currency
   * @param amount ether amount in wei
   */


  CurrencyAmount.ether = function ether(amount) {
    return new CurrencyAmount(ETHER, amount);
  }
  /**
   * Helper that calls the constructor with the more flexible network currency
   * dependent on the selected chainId
   * @param amount ether amount in wei
   */
  ;

  CurrencyAmount.networkCCYAmount = function networkCCYAmount(chainId, amount) {
    return new CurrencyAmount(NETWORK_CCY[chainId], amount);
  };

  var _proto = CurrencyAmount.prototype;

  _proto.add = function add(other) {
    !currencyEquals(this.currency, other.currency) ?  invariant(false, 'TOKEN')  : void 0;
    return new CurrencyAmount(this.currency, JSBI.add(this.raw, other.raw));
  };

  _proto.subtract = function subtract(other) {
    !currencyEquals(this.currency, other.currency) ?  invariant(false, 'TOKEN')  : void 0;
    return new CurrencyAmount(this.currency, JSBI.subtract(this.raw, other.raw));
  };

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (significantDigits === void 0) {
      significantDigits = 6;
    }

    if (rounding === void 0) {
      rounding = exports.Rounding.ROUND_DOWN;
    }

    return _Fraction.prototype.toSignificant.call(this, significantDigits, format, rounding);
  };

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (decimalPlaces === void 0) {
      decimalPlaces = this.currency.decimals;
    }

    if (rounding === void 0) {
      rounding = exports.Rounding.ROUND_DOWN;
    }

    !(decimalPlaces <= this.currency.decimals) ?  invariant(false, 'DECIMALS')  : void 0;
    return _Fraction.prototype.toFixed.call(this, decimalPlaces, format, rounding);
  };

  _proto.toExact = function toExact(format) {
    if (format === void 0) {
      format = {
        groupSeparator: ''
      };
    }

    Big$1.DP = this.currency.decimals;
    return new Big$1(this.numerator.toString()).div(this.denominator.toString()).toFormat(format);
  };

  _proto.toBigNumber = function toBigNumber() {
    return bignumber.BigNumber.from(this.numerator.toString());
  };

  _createClass(CurrencyAmount, [{
    key: "raw",
    get: function get() {
      return this.numerator;
    }
  }]);

  return CurrencyAmount;
}(Fraction);

var TokenAmount = /*#__PURE__*/function (_CurrencyAmount) {
  _inheritsLoose(TokenAmount, _CurrencyAmount);

  // amount _must_ be raw, i.e. in the native representation
  function TokenAmount(token, amount) {
    var _this;

    _this = _CurrencyAmount.call(this, token, amount) || this;
    _this.token = token;
    return _this;
  }

  var _proto = TokenAmount.prototype;

  _proto.add = function add(other) {
    !this.token.equals(other.token) ?  invariant(false, 'TOKEN')  : void 0;
    return new TokenAmount(this.token, JSBI.add(this.raw, other.raw));
  };

  _proto.subtract = function subtract(other) {
    !this.token.equals(other.token) ?  invariant(false, 'TOKEN')  : void 0;
    return new TokenAmount(this.token, JSBI.subtract(this.raw, other.raw));
  };

  return TokenAmount;
}(CurrencyAmount);

(function (PoolType) {
  PoolType["Pair"] = "Pair";
  PoolType["StablePairWrapper"] = "StablePairWrapper";
  PoolType["WeightedPair"] = "WeightedPair";
})(exports.PoolType || (exports.PoolType = {}));

var Price = /*#__PURE__*/function (_Fraction) {
  _inheritsLoose(Price, _Fraction);

  // denominator and numerator _must_ be raw, i.e. in the native representation
  function Price(baseCurrency, quoteCurrency, denominator, numerator) {
    var _this;

    _this = _Fraction.call(this, numerator, denominator) || this;
    _this.baseCurrency = baseCurrency;
    _this.quoteCurrency = quoteCurrency;
    _this.scalar = new Fraction(JSBI.exponentiate(TEN, JSBI.BigInt(baseCurrency.decimals)), JSBI.exponentiate(TEN, JSBI.BigInt(quoteCurrency.decimals)));
    return _this;
  }

  Price.fromRoute = function fromRoute(route) {
    var prices = [];

    for (var _iterator = _createForOfIteratorHelperLoose(route.pairs.entries()), _step; !(_step = _iterator()).done;) {
      var _step$value = _step.value,
          i = _step$value[0],
          pair = _step$value[1];
      prices.push(route.path[i].equals(pair.token0) ? new Price(pair.reserve0.currency, pair.reserve1.currency, pair.reserve0.raw, pair.reserve1.raw) : new Price(pair.reserve1.currency, pair.reserve0.currency, pair.reserve1.raw, pair.reserve0.raw));
    }

    return prices.slice(1).reduce(function (accumulator, currentValue) {
      return accumulator.multiply(currentValue);
    }, prices[0]);
  } // upgraded version to include StablePairWrappers in a Route
  ;

  Price.fromRouteV3 = function fromRouteV3(route) {
    var prices = [];

    for (var _iterator2 = _createForOfIteratorHelperLoose(route.sources.entries()), _step2; !(_step2 = _iterator2()).done;) {
      var _step2$value = _step2.value,
          i = _step2$value[0],
          source = _step2$value[1];
      // if (source.type !== 'Pair') {
      //   console.log("invariant", (source as StablePairWrapper).status)
      //   invariant((source as StablePairWrapper).status === 'PRICED', 'NOT PRICED')
      // }
      prices.push(route.path[i].equals(source.token0) ? source.type === exports.PoolType.Pair ? new Price(source.reserve0.currency, source.reserve1.currency, source.reserve0.raw, source.reserve1.raw) // here we need the recorded prcing bases
      : new Price(source.reserve0.currency, source.reserve1.currency, source.pricingBasesIn[0].raw, source.pricingBasesOut[1].raw) : source.type === exports.PoolType.Pair ? new Price(source.reserve1.currency, source.reserve0.currency, source.reserve1.raw, source.reserve0.raw) // pricing base for stablePriceWrapper
      : new Price(source.reserve1.currency, source.reserve0.currency, source.pricingBasesIn[1].raw, source.pricingBasesOut[0].raw));
    }

    return prices.slice(1).reduce(function (accumulator, currentValue) {
      return accumulator.multiply(currentValue);
    }, prices[0]);
  } // upgraded version to include StablePairWrappers in a Route
  // as well as weighted pairs
  ;

  Price.fromRouteV4 = function fromRouteV4(route) {
    var prices = [];

    for (var _iterator3 = _createForOfIteratorHelperLoose(route.pools.entries()), _step3; !(_step3 = _iterator3()).done;) {
      var _step3$value = _step3.value,
          i = _step3$value[0],
          pool = _step3$value[1];
      var price = void 0;

      if (route.path[i].equals(pool.token0)) {
        switch (pool.type) {
          // regular UniswapV2 type pairs can be priced using just amounts
          case exports.PoolType.Pair:
            {
              price = new Price(pool.reserve0.currency, pool.reserve1.currency, pool.reserve0.raw, pool.reserve1.raw);
              break;
            }
          // here we need the recorded prcing bases

          case exports.PoolType.StablePairWrapper:
            {
              price = new Price(pool.reserve0.currency, pool.reserve1.currency, pool.pricingBasesIn[0].raw, pool.pricingBasesOut[1].raw);
              break;
            }
          // prcing for weighted pairs - not directly derivable from token amounts

          case exports.PoolType.WeightedPair:
            {
              price = new Price(pool.reserve0.currency, pool.reserve1.currency, pool.pricingBasesIn[0].raw, pool.pricingBasesOut[1].raw);
              break;
            }
        }
      } else {
        switch (pool.type) {
          // regular UniswapV2 type pairs can be priced using just amounts
          case exports.PoolType.Pair:
            {
              price = new Price(pool.reserve1.currency, pool.reserve0.currency, pool.reserve1.raw, pool.reserve0.raw);
              break;
            }
          // pricing base for stablePriceWrapper

          case exports.PoolType.StablePairWrapper:
            {
              price = new Price(pool.reserve1.currency, pool.reserve0.currency, pool.pricingBasesIn[1].raw, pool.pricingBasesOut[0].raw);
              break;
            }
          // pricing base for weighted pairs

          case exports.PoolType.WeightedPair:
            {
              price = new Price(pool.reserve1.currency, pool.reserve0.currency, pool.pricingBasesIn[1].raw, pool.pricingBasesOut[0].raw);
              break;
            }
        }
      }

      prices.push(price);
    }

    return prices.slice(1).reduce(function (accumulator, currentValue) {
      return accumulator.multiply(currentValue);
    }, prices[0]);
  };

  var _proto = Price.prototype;

  _proto.invert = function invert() {
    return new Price(this.quoteCurrency, this.baseCurrency, this.numerator, this.denominator);
  };

  _proto.multiply = function multiply(other) {
    !currencyEquals(this.quoteCurrency, other.baseCurrency) ?  invariant(false, 'TOKEN')  : void 0;

    var fraction = _Fraction.prototype.multiply.call(this, other);

    return new Price(this.baseCurrency, other.quoteCurrency, fraction.denominator, fraction.numerator);
  } // performs floor division on overflow
  ;

  _proto.quote = function quote(currencyAmount) {
    !currencyEquals(currencyAmount.currency, this.baseCurrency) ?  invariant(false, 'TOKEN')  : void 0;

    if (this.quoteCurrency instanceof Token) {
      return new TokenAmount(this.quoteCurrency, _Fraction.prototype.multiply.call(this, currencyAmount.raw).quotient);
    }

    return CurrencyAmount.ether(_Fraction.prototype.multiply.call(this, currencyAmount.raw).quotient);
  };

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (significantDigits === void 0) {
      significantDigits = 6;
    }

    return this.adjusted.toSignificant(significantDigits, format, rounding);
  };

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (decimalPlaces === void 0) {
      decimalPlaces = 4;
    }

    return this.adjusted.toFixed(decimalPlaces, format, rounding);
  };

  _createClass(Price, [{
    key: "raw",
    get: function get() {
      return new Fraction(this.numerator, this.denominator);
    }
  }, {
    key: "adjusted",
    get: function get() {
      return _Fraction.prototype.multiply.call(this, this.scalar);
    }
  }]);

  return Price;
}(Fraction);

var PAIR_ADDRESS_CACHE = {};
var Pair = /*#__PURE__*/function () {
  function Pair(tokenAmountA, tokenAmountB) {
    var tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
    ? [tokenAmountA, tokenAmountB] : [tokenAmountB, tokenAmountA];
    this.liquidityToken = new Token(tokenAmounts[0].token.chainId, Pair.getAddress(tokenAmounts[0].token, tokenAmounts[1].token), 18, 'Requiem-LP', 'Requiem LPs');
    this.type = exports.PoolType.Pair;
    this.tokenAmounts = tokenAmounts;
  }

  Pair.getAddress = function getAddress(tokenA, tokenB) {
    var _PAIR_ADDRESS_CACHE, _PAIR_ADDRESS_CACHE$t;

    !(tokenA.chainId === tokenB.chainId) ?  invariant(false, 'CHAIN_ID')  : void 0;
    var chainId = tokenA.chainId;
    var tokens = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]; // does safety checks

    if (((_PAIR_ADDRESS_CACHE = PAIR_ADDRESS_CACHE) === null || _PAIR_ADDRESS_CACHE === void 0 ? void 0 : (_PAIR_ADDRESS_CACHE$t = _PAIR_ADDRESS_CACHE[tokens[0].address]) === null || _PAIR_ADDRESS_CACHE$t === void 0 ? void 0 : _PAIR_ADDRESS_CACHE$t[tokens[1].address]) === undefined) {
      var _PAIR_ADDRESS_CACHE2, _extends2, _extends3;

      PAIR_ADDRESS_CACHE = _extends({}, PAIR_ADDRESS_CACHE, (_extends3 = {}, _extends3[tokens[0].address] = _extends({}, (_PAIR_ADDRESS_CACHE2 = PAIR_ADDRESS_CACHE) === null || _PAIR_ADDRESS_CACHE2 === void 0 ? void 0 : _PAIR_ADDRESS_CACHE2[tokens[0].address], (_extends2 = {}, _extends2[tokens[1].address] = address.getCreate2Address(FACTORY_ADDRESS[chainId], solidity.keccak256(['bytes'], [solidity.pack(['address', 'address'], [tokens[0].address, tokens[1].address])]), INIT_CODE_HASH[chainId]), _extends2)), _extends3));
    }

    return PAIR_ADDRESS_CACHE[tokens[0].address][tokens[1].address];
  };

  var _proto = Pair.prototype;

  _proto.getAddressForRouter = function getAddressForRouter() {
    return this.liquidityToken.address;
  }
  /**
   * Returns true if the token is either token0 or token1
   * @param token to check
   */
  ;

  _proto.involvesToken = function involvesToken(token) {
    return token.equals(this.token0) || token.equals(this.token1);
  }
  /**
   * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
   */
  ;

  /**
   * Return the price of the given token in terms of the other token in the pair.
   * @param token token to return price of
   */
  _proto.priceOf = function priceOf(token) {
    !this.involvesToken(token) ?  invariant(false, 'TOKEN')  : void 0;
    return token.equals(this.token0) ? this.token0Price : this.token1Price;
  }
  /**
   * Returns the chain ID of the tokens in the pair.
   */
  ;

  _proto.reserveOf = function reserveOf(token) {
    !this.involvesToken(token) ?  invariant(false, 'TOKEN')  : void 0;
    return token.equals(this.token0) ? this.reserve0 : this.reserve1;
  };

  _proto.getOutputAmount = function getOutputAmount(inputAmount) {
    !this.involvesToken(inputAmount.token) ?  invariant(false, 'TOKEN')  : void 0;

    if (JSBI.equal(this.reserve0.raw, ZERO) || JSBI.equal(this.reserve1.raw, ZERO)) {
      throw new InsufficientReservesError();
    }

    var inputReserve = this.reserveOf(inputAmount.token);
    var outputReserve = this.reserveOf(inputAmount.token.equals(this.token0) ? this.token1 : this.token0);
    var inputAmountWithFee = JSBI.multiply(inputAmount.raw, FEES_NUMERATOR);
    var numerator = JSBI.multiply(inputAmountWithFee, outputReserve.raw);
    var denominator = JSBI.add(JSBI.multiply(inputReserve.raw, FEES_DENOMINATOR), inputAmountWithFee);
    var outputAmount = new TokenAmount(inputAmount.token.equals(this.token0) ? this.token1 : this.token0, JSBI.divide(numerator, denominator));

    if (JSBI.equal(outputAmount.raw, ZERO)) {
      throw new InsufficientInputAmountError();
    }

    return [outputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))];
  };

  _proto.getInputAmount = function getInputAmount(outputAmount) {
    !this.involvesToken(outputAmount.token) ?  invariant(false, 'TOKEN')  : void 0;

    if (JSBI.equal(this.reserve0.raw, ZERO) || JSBI.equal(this.reserve1.raw, ZERO) || JSBI.greaterThanOrEqual(outputAmount.raw, this.reserveOf(outputAmount.token).raw)) {
      throw new InsufficientReservesError();
    }

    var outputReserve = this.reserveOf(outputAmount.token);
    var inputReserve = this.reserveOf(outputAmount.token.equals(this.token0) ? this.token1 : this.token0);
    var numerator = JSBI.multiply(JSBI.multiply(inputReserve.raw, outputAmount.raw), FEES_DENOMINATOR);
    var denominator = JSBI.multiply(JSBI.subtract(outputReserve.raw, outputAmount.raw), FEES_NUMERATOR);
    var inputAmount = new TokenAmount(outputAmount.token.equals(this.token0) ? this.token1 : this.token0, JSBI.add(JSBI.divide(numerator, denominator), ONE));
    return [inputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))];
  };

  _proto.getLiquidityMinted = function getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB) {
    !totalSupply.token.equals(this.liquidityToken) ?  invariant(false, 'LIQUIDITY')  : void 0;
    var tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
    ? [tokenAmountA, tokenAmountB] : [tokenAmountB, tokenAmountA];
    !(tokenAmounts[0].token.equals(this.token0) && tokenAmounts[1].token.equals(this.token1)) ?  invariant(false, 'TOKEN')  : void 0;
    var liquidity;

    if (JSBI.equal(totalSupply.raw, ZERO)) {
      liquidity = JSBI.subtract(sqrt(JSBI.multiply(tokenAmounts[0].raw, tokenAmounts[1].raw)), MINIMUM_LIQUIDITY);
    } else {
      var amount0 = JSBI.divide(JSBI.multiply(tokenAmounts[0].raw, totalSupply.raw), this.reserve0.raw);
      var amount1 = JSBI.divide(JSBI.multiply(tokenAmounts[1].raw, totalSupply.raw), this.reserve1.raw);
      liquidity = JSBI.lessThanOrEqual(amount0, amount1) ? amount0 : amount1;
    }

    if (!JSBI.greaterThan(liquidity, ZERO)) {
      throw new InsufficientInputAmountError();
    }

    return new TokenAmount(this.liquidityToken, liquidity);
  };

  _proto.getLiquidityValue = function getLiquidityValue(token, totalSupply, liquidity, feeOn, kLast) {
    if (feeOn === void 0) {
      feeOn = false;
    }

    !this.involvesToken(token) ?  invariant(false, 'TOKEN')  : void 0;
    !totalSupply.token.equals(this.liquidityToken) ?  invariant(false, 'TOTAL_SUPPLY')  : void 0;
    !liquidity.token.equals(this.liquidityToken) ?  invariant(false, 'LIQUIDITY')  : void 0;
    !JSBI.lessThanOrEqual(liquidity.raw, totalSupply.raw) ?  invariant(false, 'LIQUIDITY')  : void 0;
    var totalSupplyAdjusted;

    if (!feeOn) {
      totalSupplyAdjusted = totalSupply;
    } else {
      !!!kLast ?  invariant(false, 'K_LAST')  : void 0;
      var kLastParsed = parseBigintIsh(kLast);

      if (!JSBI.equal(kLastParsed, ZERO)) {
        var rootK = sqrt(JSBI.multiply(this.reserve0.raw, this.reserve1.raw));
        var rootKLast = sqrt(kLastParsed);

        if (JSBI.greaterThan(rootK, rootKLast)) {
          var numerator = JSBI.multiply(totalSupply.raw, JSBI.subtract(rootK, rootKLast));
          var denominator = JSBI.add(JSBI.multiply(rootK, FIVE), rootKLast);
          var feeLiquidity = JSBI.divide(numerator, denominator);
          totalSupplyAdjusted = totalSupply.add(new TokenAmount(this.liquidityToken, feeLiquidity));
        } else {
          totalSupplyAdjusted = totalSupply;
        }
      } else {
        totalSupplyAdjusted = totalSupply;
      }
    }

    return new TokenAmount(token, JSBI.divide(JSBI.multiply(liquidity.raw, this.reserveOf(token).raw), totalSupplyAdjusted.raw));
  };

  _createClass(Pair, [{
    key: "token0Price",
    get: function get() {
      return new Price(this.token0, this.token1, this.tokenAmounts[0].raw, this.tokenAmounts[1].raw);
    }
    /**
     * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
     */

  }, {
    key: "token1Price",
    get: function get() {
      return new Price(this.token1, this.token0, this.tokenAmounts[1].raw, this.tokenAmounts[0].raw);
    }
  }, {
    key: "chainId",
    get: function get() {
      return this.token0.chainId;
    }
  }, {
    key: "token0",
    get: function get() {
      return this.tokenAmounts[0].token;
    }
  }, {
    key: "token1",
    get: function get() {
      return this.tokenAmounts[1].token;
    }
  }, {
    key: "reserve0",
    get: function get() {
      return this.tokenAmounts[0];
    }
  }, {
    key: "reserve1",
    get: function get() {
      return this.tokenAmounts[1];
    }
  }]);

  return Pair;
}();

var Route = /*#__PURE__*/function () {
  function Route(pairs, input, output) {
    !(pairs.length > 0) ?  invariant(false, 'PAIRS')  : void 0;
    !pairs.every(function (pair) {
      return pair.chainId === pairs[0].chainId;
    }) ?  invariant(false, 'CHAIN_IDS')  : void 0;
    !(input instanceof Token && pairs[0].involvesToken(input) || input === NETWORK_CCY[pairs[0].chainId] && pairs[0].involvesToken(WRAPPED_NETWORK_TOKENS[pairs[0].chainId])) ?  invariant(false, 'INPUT')  : void 0;
    !(typeof output === 'undefined' || output instanceof Token && pairs[pairs.length - 1].involvesToken(output) || output === NETWORK_CCY[pairs[0].chainId] && pairs[pairs.length - 1].involvesToken(WRAPPED_NETWORK_TOKENS[pairs[0].chainId])) ?  invariant(false, 'OUTPUT')  : void 0;
    var path = [input instanceof Token ? input : WRAPPED_NETWORK_TOKENS[pairs[0].chainId]];

    for (var _iterator = _createForOfIteratorHelperLoose(pairs.entries()), _step; !(_step = _iterator()).done;) {
      var _step$value = _step.value,
          i = _step$value[0],
          pair = _step$value[1];
      var currentInput = path[i];
      !(currentInput.equals(pair.token0) || currentInput.equals(pair.token1)) ?  invariant(false, 'PATH')  : void 0;

      var _output = currentInput.equals(pair.token0) ? pair.token1 : pair.token0;

      path.push(_output);
    }

    this.pairs = pairs;
    this.path = path;
    this.midPrice = Price.fromRoute(this);
    this.input = input;
    this.output = output !== null && output !== void 0 ? output : path[path.length - 1];
  }

  _createClass(Route, [{
    key: "chainId",
    get: function get() {
      return this.pairs[0].chainId;
    }
  }]);

  return Route;
}();

var _100_PERCENT = /*#__PURE__*/new Fraction(_100);

var Percent = /*#__PURE__*/function (_Fraction) {
  _inheritsLoose(Percent, _Fraction);

  function Percent() {
    return _Fraction.apply(this, arguments) || this;
  }

  var _proto = Percent.prototype;

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (significantDigits === void 0) {
      significantDigits = 5;
    }

    return this.multiply(_100_PERCENT).toSignificant(significantDigits, format, rounding);
  };

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (decimalPlaces === void 0) {
      decimalPlaces = 2;
    }

    return this.multiply(_100_PERCENT).toFixed(decimalPlaces, format, rounding);
  };

  return Percent;
}(Fraction);

/**
 * Returns the percent difference between the mid price and the execution price, i.e. price impact.
 * @param midPrice mid price before the trade
 * @param inputAmount the input amount of the trade
 * @param outputAmount the output amount of the trade
 */

function computePriceImpact(midPrice, inputAmount, outputAmount) {
  var exactQuote = midPrice.raw.multiply(inputAmount.raw); // calculate slippage := (exactQuote - outputAmount) / exactQuote

  var slippage = exactQuote.subtract(outputAmount.raw).divide(exactQuote);
  return new Percent(slippage.numerator, slippage.denominator);
} // comparator function that allows sorting trades by their output amounts, in decreasing order, and then input amounts
// in increasing order. i.e. the best trades have the most outputs for the least inputs and are sorted first


function inputOutputComparator(a, b) {
  // must have same input and output token for comparison
  !currencyEquals(a.inputAmount.currency, b.inputAmount.currency) ?  invariant(false, 'INPUT_CURRENCY')  : void 0;
  !currencyEquals(a.outputAmount.currency, b.outputAmount.currency) ?  invariant(false, 'OUTPUT_CURRENCY')  : void 0;

  if (a.outputAmount.equalTo(b.outputAmount)) {
    if (a.inputAmount.equalTo(b.inputAmount)) {
      return 0;
    } // trade A requires less input than trade B, so A should come first


    if (a.inputAmount.lessThan(b.inputAmount)) {
      return -1;
    } else {
      return 1;
    }
  } else {
    // tradeA has less output than trade B, so should come second
    if (a.outputAmount.lessThan(b.outputAmount)) {
      return 1;
    } else {
      return -1;
    }
  }
} // extension of the input output comparator that also considers other dimensions of the trade in ranking them

function tradeComparator(a, b) {
  var ioComp = inputOutputComparator(a, b);

  if (ioComp !== 0) {
    return ioComp;
  } // consider lowest slippage next, since these are less likely to fail


  if (a.priceImpact.lessThan(b.priceImpact)) {
    return -1;
  } else if (a.priceImpact.greaterThan(b.priceImpact)) {
    return 1;
  } // finally consider the number of hops since each hop costs gas


  return a.route.path.length - b.route.path.length;
}
/**
 * Given a currency amount and a chain ID, returns the equivalent representation as the token amount.
 * In other words, if the currency is ETHER, returns the WETH token amount for the given chain. Otherwise, returns
 * the input currency amount.
 */

function wrappedAmount(currencyAmount, chainId) {
  if (currencyAmount instanceof TokenAmount) return currencyAmount;
  if (currencyAmount.currency === NETWORK_CCY[chainId]) return new TokenAmount(WRAPPED_NETWORK_TOKENS[chainId], currencyAmount.raw);
    invariant(false, 'CURRENCY')  ;
}

function wrappedCurrency(currency, chainId) {
  if (currency instanceof Token) return currency;
  if (currency === NETWORK_CCY[chainId]) return WRAPPED_NETWORK_TOKENS[chainId];
    invariant(false, 'CURRENCY')  ;
}
/**
 * Represents a trade executed against a list of pairs.
 * Does not account for slippage, i.e. trades that front run this trade and move the price.
 */


var Trade = /*#__PURE__*/function () {
  function Trade(route, amount, tradeType) {
    var amounts = new Array(route.path.length);
    var nextPairs = new Array(route.pairs.length);

    if (tradeType === exports.TradeType.EXACT_INPUT) {
      !currencyEquals(amount.currency, route.input) ?  invariant(false, 'INPUT')  : void 0;
      amounts[0] = wrappedAmount(amount, route.chainId);

      for (var i = 0; i < route.path.length - 1; i++) {
        var pair = route.pairs[i];

        var _pair$getOutputAmount = pair.getOutputAmount(amounts[i]),
            outputAmount = _pair$getOutputAmount[0],
            nextPair = _pair$getOutputAmount[1];

        amounts[i + 1] = outputAmount;
        nextPairs[i] = nextPair;
      }
    } else {
      !currencyEquals(amount.currency, route.output) ?  invariant(false, 'OUTPUT')  : void 0;
      amounts[amounts.length - 1] = wrappedAmount(amount, route.chainId);

      for (var _i = route.path.length - 1; _i > 0; _i--) {
        var _pair = route.pairs[_i - 1];

        var _pair$getInputAmount = _pair.getInputAmount(amounts[_i]),
            inputAmount = _pair$getInputAmount[0],
            _nextPair = _pair$getInputAmount[1];

        amounts[_i - 1] = inputAmount;
        nextPairs[_i - 1] = _nextPair;
      }
    }

    this.route = route;
    this.tradeType = tradeType;
    this.inputAmount = tradeType === exports.TradeType.EXACT_INPUT ? amount : route.input === NETWORK_CCY[route.chainId] ? CurrencyAmount.networkCCYAmount(route.chainId, amounts[0].raw) : amounts[0];
    this.outputAmount = tradeType === exports.TradeType.EXACT_OUTPUT ? amount : route.output === NETWORK_CCY[route.chainId] ? CurrencyAmount.networkCCYAmount(route.chainId, amounts[amounts.length - 1].raw) : amounts[amounts.length - 1];
    this.executionPrice = new Price(this.inputAmount.currency, this.outputAmount.currency, this.inputAmount.raw, this.outputAmount.raw);
    this.nextMidPrice = Price.fromRoute(new Route(nextPairs, route.input));
    this.priceImpact = computePriceImpact(route.midPrice, this.inputAmount, this.outputAmount);
  }
  /**
   * Constructs an exact in trade with the given amount in and route
   * @param route route of the exact in trade
   * @param amountIn the amount being passed in
   */


  Trade.exactIn = function exactIn(route, amountIn) {
    return new Trade(route, amountIn, exports.TradeType.EXACT_INPUT);
  }
  /**
   * Constructs an exact out trade with the given amount out and route
   * @param route route of the exact out trade
   * @param amountOut the amount returned by the trade
   */
  ;

  Trade.exactOut = function exactOut(route, amountOut) {
    return new Trade(route, amountOut, exports.TradeType.EXACT_OUTPUT);
  }
  /**
   * Get the minimum amount that must be received from this trade for the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
   */
  ;

  var _proto = Trade.prototype;

  _proto.minimumAmountOut = function minimumAmountOut(slippageTolerance) {
    !!slippageTolerance.lessThan(ZERO) ?  invariant(false, 'SLIPPAGE_TOLERANCE')  : void 0;

    if (this.tradeType === exports.TradeType.EXACT_OUTPUT) {
      return this.outputAmount;
    } else {
      var slippageAdjustedAmountOut = new Fraction(ONE).add(slippageTolerance).invert().multiply(this.outputAmount.raw).quotient;
      return this.outputAmount instanceof TokenAmount ? new TokenAmount(this.outputAmount.token, slippageAdjustedAmountOut) : CurrencyAmount.networkCCYAmount(this.route.chainId, slippageAdjustedAmountOut);
    }
  }
  /**
   * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
   */
  ;

  _proto.maximumAmountIn = function maximumAmountIn(slippageTolerance) {
    !!slippageTolerance.lessThan(ZERO) ?  invariant(false, 'SLIPPAGE_TOLERANCE')  : void 0;

    if (this.tradeType === exports.TradeType.EXACT_INPUT) {
      return this.inputAmount;
    } else {
      var slippageAdjustedAmountIn = new Fraction(ONE).add(slippageTolerance).multiply(this.inputAmount.raw).quotient;
      return this.inputAmount instanceof TokenAmount ? new TokenAmount(this.inputAmount.token, slippageAdjustedAmountIn) : CurrencyAmount.networkCCYAmount(this.route.chainId, slippageAdjustedAmountIn);
    }
  }
  /**
   * Given a list of pairs, and a fixed amount in, returns the top `maxNumResults` trades that go from an input token
   * amount to an output token, making at most `maxHops` hops.
   * Note this does not consider aggregation, as routes are linear. It's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pairs the pairs to consider in finding the best trade
   * @param currencyAmountIn exact amount of input currency to spend
   * @param currencyOut the desired currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
   * @param currentPairs used in recursion; the current list of pairs
   * @param originalAmountIn used in recursion; the original value of the currencyAmountIn parameter
   * @param bestTrades used in recursion; the current list of best trades
   */
  ;

  Trade.bestTradeExactIn = function bestTradeExactIn(pairs, currencyAmountIn, currencyOut, _temp, // used in recursion.
  currentPairs, originalAmountIn, bestTrades) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$maxNumResults = _ref.maxNumResults,
        maxNumResults = _ref$maxNumResults === void 0 ? 3 : _ref$maxNumResults,
        _ref$maxHops = _ref.maxHops,
        maxHops = _ref$maxHops === void 0 ? 3 : _ref$maxHops;

    if (currentPairs === void 0) {
      currentPairs = [];
    }

    if (originalAmountIn === void 0) {
      originalAmountIn = currencyAmountIn;
    }

    if (bestTrades === void 0) {
      bestTrades = [];
    }

    !(pairs.length > 0) ?  invariant(false, 'PAIRS')  : void 0;
    !(maxHops > 0) ?  invariant(false, 'MAX_HOPS')  : void 0;
    !(originalAmountIn === currencyAmountIn || currentPairs.length > 0) ?  invariant(false, 'INVALID_RECURSION')  : void 0;
    var chainId = currencyAmountIn instanceof TokenAmount ? currencyAmountIn.token.chainId : currencyOut instanceof Token ? currencyOut.chainId : undefined;
    !(chainId !== undefined) ?  invariant(false, 'CHAIN_ID')  : void 0;
    var amountIn = wrappedAmount(currencyAmountIn, chainId);
    var tokenOut = wrappedCurrency(currencyOut, chainId);

    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i]; // pair irrelevant

      if (!pair.token0.equals(amountIn.token) && !pair.token1.equals(amountIn.token)) continue;
      if (pair.reserve0.equalTo(ZERO) || pair.reserve1.equalTo(ZERO)) continue;
      var amountOut = void 0;

      try {
        ;

        var _pair$getOutputAmount2 = pair.getOutputAmount(amountIn);

        amountOut = _pair$getOutputAmount2[0];
      } catch (error) {
        // input too low
        if (error.isInsufficientInputAmountError) {
          continue;
        }

        throw error;
      } // we have arrived at the output token, so this is the final trade of one of the paths


      if (amountOut.token.equals(tokenOut)) {
        sortedInsert(bestTrades, new Trade(new Route([].concat(currentPairs, [pair]), originalAmountIn.currency, currencyOut), originalAmountIn, exports.TradeType.EXACT_INPUT), maxNumResults, tradeComparator);
      } else if (maxHops > 1 && pairs.length > 1) {
        var pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length)); // otherwise, consider all the other paths that lead from this token as long as we have not exceeded maxHops

        Trade.bestTradeExactIn(pairsExcludingThisPair, amountOut, currencyOut, {
          maxNumResults: maxNumResults,
          maxHops: maxHops - 1
        }, [].concat(currentPairs, [pair]), originalAmountIn, bestTrades);
      }
    }

    return bestTrades;
  }
  /**
   * similar to the above method but instead targets a fixed output amount
   * given a list of pairs, and a fixed amount out, returns the top `maxNumResults` trades that go from an input token
   * to an output token amount, making at most `maxHops` hops
   * note this does not consider aggregation, as routes are linear. it's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pairs the pairs to consider in finding the best trade
   * @param currencyIn the currency to spend
   * @param currencyAmountOut the exact amount of currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
   * @param currentPairs used in recursion; the current list of pairs
   * @param originalAmountOut used in recursion; the original value of the currencyAmountOut parameter
   * @param bestTrades used in recursion; the current list of best trades
   */
  ;

  Trade.bestTradeExactOut = function bestTradeExactOut(pairs, currencyIn, currencyAmountOut, _temp2, // used in recursion.
  currentPairs, originalAmountOut, bestTrades) {
    var _ref2 = _temp2 === void 0 ? {} : _temp2,
        _ref2$maxNumResults = _ref2.maxNumResults,
        maxNumResults = _ref2$maxNumResults === void 0 ? 3 : _ref2$maxNumResults,
        _ref2$maxHops = _ref2.maxHops,
        maxHops = _ref2$maxHops === void 0 ? 3 : _ref2$maxHops;

    if (currentPairs === void 0) {
      currentPairs = [];
    }

    if (originalAmountOut === void 0) {
      originalAmountOut = currencyAmountOut;
    }

    if (bestTrades === void 0) {
      bestTrades = [];
    }

    !(pairs.length > 0) ?  invariant(false, 'PAIRS')  : void 0;
    !(maxHops > 0) ?  invariant(false, 'MAX_HOPS')  : void 0;
    !(originalAmountOut === currencyAmountOut || currentPairs.length > 0) ?  invariant(false, 'INVALID_RECURSION')  : void 0;
    var chainId = currencyAmountOut instanceof TokenAmount ? currencyAmountOut.token.chainId : currencyIn instanceof Token ? currencyIn.chainId : undefined;
    !(chainId !== undefined) ?  invariant(false, 'CHAIN_ID')  : void 0;
    var amountOut = wrappedAmount(currencyAmountOut, chainId);
    var tokenIn = wrappedCurrency(currencyIn, chainId);

    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i]; // pair irrelevant

      if (!pair.token0.equals(amountOut.token) && !pair.token1.equals(amountOut.token)) continue;
      if (pair.reserve0.equalTo(ZERO) || pair.reserve1.equalTo(ZERO)) continue;
      var amountIn = void 0;

      try {
        ;

        var _pair$getInputAmount2 = pair.getInputAmount(amountOut);

        amountIn = _pair$getInputAmount2[0];
      } catch (error) {
        // not enough liquidity in this pair
        if (error.isInsufficientReservesError) {
          continue;
        }

        throw error;
      } // we have arrived at the input token, so this is the first trade of one of the paths


      if (amountIn.token.equals(tokenIn)) {
        sortedInsert(bestTrades, new Trade(new Route([pair].concat(currentPairs), currencyIn, originalAmountOut.currency), originalAmountOut, exports.TradeType.EXACT_OUTPUT), maxNumResults, tradeComparator);
      } else if (maxHops > 1 && pairs.length > 1) {
        var pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length)); // otherwise, consider all the other paths that arrive at this token as long as we have not exceeded maxHops

        Trade.bestTradeExactOut(pairsExcludingThisPair, currencyIn, amountIn, {
          maxNumResults: maxNumResults,
          maxHops: maxHops - 1
        }, [pair].concat(currentPairs), originalAmountOut, bestTrades);
      }
    }

    return bestTrades;
  };

  return Trade;
}();

var ZERO$1 = /*#__PURE__*/bignumber.BigNumber.from(0);
var ONE$1 = /*#__PURE__*/bignumber.BigNumber.from(1);
var TWO$1 = /*#__PURE__*/bignumber.BigNumber.from(2);
var TENK = /*#__PURE__*/bignumber.BigNumber.from(10000);

var _256 = /*#__PURE__*/bignumber.BigNumber.from('256');

var _128 = /*#__PURE__*/bignumber.BigNumber.from('128');

var MIN_PRECISION = 32;
var MAX_PRECISION = 127;
var FIXED_1 = /*#__PURE__*/bignumber.BigNumber.from('0x080000000000000000000000000000000');
var FIXED_2 = /*#__PURE__*/bignumber.BigNumber.from('0x100000000000000000000000000000000');
var MAX_NUM = /*#__PURE__*/bignumber.BigNumber.from('0x200000000000000000000000000000000');
var LN2_NUMERATOR = /*#__PURE__*/bignumber.BigNumber.from('0x3f80fe03f80fe03f80fe03f80fe03f8');
var LN2_DENOMINATOR = /*#__PURE__*/bignumber.BigNumber.from('0x5b9de1d10bf4103d647b0955897ba80');
var OPT_LOG_MAX_VAL = /*#__PURE__*/bignumber.BigNumber.from('0x15bf0a8b1457695355fb8ac404e7a79e3');
var OPT_EXP_MAX_VAL = /*#__PURE__*/bignumber.BigNumber.from('0x800000000000000000000000000000000'); // const LAMBERT_CONV_RADIUS = BigNumber.from('0x002f16ac6c59de6f8d5d6f63c1482a7c86')
// const LAMBERT_POS2_SAMPLE = BigNumber.from('0x0003060c183060c183060c183060c18306')
// const LAMBERT_POS2_MAXVAL = BigNumber.from('0x01af16ac6c59de6f8d5d6f63c1482a7c80')
// const LAMBERT_POS3_MAXVAL = BigNumber.from('0x6b22d43e72c326539cceeef8bb48f255ff')
// const MAX_UNF_WEIGHT = BigNumber.from('0x10c6f7a0b5ed8d36b4c7f34938583621fafc8b0079a2834d26fa3fcc9ea9')

var maxExpArray = /*#__PURE__*/new Array(128);
maxExpArray[32] = /*#__PURE__*/bignumber.BigNumber.from('0x1c35fedd14ffffffffffffffffffffffff');
maxExpArray[33] = /*#__PURE__*/bignumber.BigNumber.from('0x1b0ce43b323fffffffffffffffffffffff');
maxExpArray[34] = /*#__PURE__*/bignumber.BigNumber.from('0x19f0028ec1ffffffffffffffffffffffff');
maxExpArray[35] = /*#__PURE__*/bignumber.BigNumber.from('0x18ded91f0e7fffffffffffffffffffffff');
maxExpArray[36] = /*#__PURE__*/bignumber.BigNumber.from('0x17d8ec7f0417ffffffffffffffffffffff');
maxExpArray[37] = /*#__PURE__*/bignumber.BigNumber.from('0x16ddc6556cdbffffffffffffffffffffff');
maxExpArray[38] = /*#__PURE__*/bignumber.BigNumber.from('0x15ecf52776a1ffffffffffffffffffffff');
maxExpArray[39] = /*#__PURE__*/bignumber.BigNumber.from('0x15060c256cb2ffffffffffffffffffffff');
maxExpArray[40] = /*#__PURE__*/bignumber.BigNumber.from('0x1428a2f98d72ffffffffffffffffffffff');
maxExpArray[41] = /*#__PURE__*/bignumber.BigNumber.from('0x13545598e5c23fffffffffffffffffffff');
maxExpArray[42] = /*#__PURE__*/bignumber.BigNumber.from('0x1288c4161ce1dfffffffffffffffffffff');
maxExpArray[43] = /*#__PURE__*/bignumber.BigNumber.from('0x11c592761c666fffffffffffffffffffff');
maxExpArray[44] = /*#__PURE__*/bignumber.BigNumber.from('0x110a688680a757ffffffffffffffffffff');
maxExpArray[45] = /*#__PURE__*/bignumber.BigNumber.from('0x1056f1b5bedf77ffffffffffffffffffff');
maxExpArray[46] = /*#__PURE__*/bignumber.BigNumber.from('0x0faadceceeff8bffffffffffffffffffff');
maxExpArray[47] = /*#__PURE__*/bignumber.BigNumber.from('0x0f05dc6b27edadffffffffffffffffffff');
maxExpArray[48] = /*#__PURE__*/bignumber.BigNumber.from('0x0e67a5a25da4107fffffffffffffffffff');
maxExpArray[49] = /*#__PURE__*/bignumber.BigNumber.from('0x0dcff115b14eedffffffffffffffffffff');
maxExpArray[50] = /*#__PURE__*/bignumber.BigNumber.from('0x0d3e7a392431239fffffffffffffffffff');
maxExpArray[51] = /*#__PURE__*/bignumber.BigNumber.from('0x0cb2ff529eb71e4fffffffffffffffffff');
maxExpArray[52] = /*#__PURE__*/bignumber.BigNumber.from('0x0c2d415c3db974afffffffffffffffffff');
maxExpArray[53] = /*#__PURE__*/bignumber.BigNumber.from('0x0bad03e7d883f69bffffffffffffffffff');
maxExpArray[54] = /*#__PURE__*/bignumber.BigNumber.from('0x0b320d03b2c343d5ffffffffffffffffff');
maxExpArray[55] = /*#__PURE__*/bignumber.BigNumber.from('0x0abc25204e02828dffffffffffffffffff');
maxExpArray[56] = /*#__PURE__*/bignumber.BigNumber.from('0x0a4b16f74ee4bb207fffffffffffffffff');
maxExpArray[57] = /*#__PURE__*/bignumber.BigNumber.from('0x09deaf736ac1f569ffffffffffffffffff');
maxExpArray[58] = /*#__PURE__*/bignumber.BigNumber.from('0x0976bd9952c7aa957fffffffffffffffff');
maxExpArray[59] = /*#__PURE__*/bignumber.BigNumber.from('0x09131271922eaa606fffffffffffffffff');
maxExpArray[60] = /*#__PURE__*/bignumber.BigNumber.from('0x08b380f3558668c46fffffffffffffffff');
maxExpArray[61] = /*#__PURE__*/bignumber.BigNumber.from('0x0857ddf0117efa215bffffffffffffffff');
maxExpArray[62] = /*#__PURE__*/bignumber.BigNumber.from('0x07ffffffffffffffffffffffffffffffff');
maxExpArray[63] = /*#__PURE__*/bignumber.BigNumber.from('0x07abbf6f6abb9d087fffffffffffffffff');
maxExpArray[64] = /*#__PURE__*/bignumber.BigNumber.from('0x075af62cbac95f7dfa7fffffffffffffff');
maxExpArray[65] = /*#__PURE__*/bignumber.BigNumber.from('0x070d7fb7452e187ac13fffffffffffffff');
maxExpArray[66] = /*#__PURE__*/bignumber.BigNumber.from('0x06c3390ecc8af379295fffffffffffffff');
maxExpArray[67] = /*#__PURE__*/bignumber.BigNumber.from('0x067c00a3b07ffc01fd6fffffffffffffff');
maxExpArray[68] = /*#__PURE__*/bignumber.BigNumber.from('0x0637b647c39cbb9d3d27ffffffffffffff');
maxExpArray[69] = /*#__PURE__*/bignumber.BigNumber.from('0x05f63b1fc104dbd39587ffffffffffffff');
maxExpArray[70] = /*#__PURE__*/bignumber.BigNumber.from('0x05b771955b36e12f7235ffffffffffffff');
maxExpArray[71] = /*#__PURE__*/bignumber.BigNumber.from('0x057b3d49dda84556d6f6ffffffffffffff');
maxExpArray[72] = /*#__PURE__*/bignumber.BigNumber.from('0x054183095b2c8ececf30ffffffffffffff');
maxExpArray[73] = /*#__PURE__*/bignumber.BigNumber.from('0x050a28be635ca2b888f77fffffffffffff');
maxExpArray[74] = /*#__PURE__*/bignumber.BigNumber.from('0x04d5156639708c9db33c3fffffffffffff');
maxExpArray[75] = /*#__PURE__*/bignumber.BigNumber.from('0x04a23105873875bd52dfdfffffffffffff');
maxExpArray[76] = /*#__PURE__*/bignumber.BigNumber.from('0x0471649d87199aa990756fffffffffffff');
maxExpArray[77] = /*#__PURE__*/bignumber.BigNumber.from('0x04429a21a029d4c1457cfbffffffffffff');
maxExpArray[78] = /*#__PURE__*/bignumber.BigNumber.from('0x0415bc6d6fb7dd71af2cb3ffffffffffff');
maxExpArray[79] = /*#__PURE__*/bignumber.BigNumber.from('0x03eab73b3bbfe282243ce1ffffffffffff');
maxExpArray[80] = /*#__PURE__*/bignumber.BigNumber.from('0x03c1771ac9fb6b4c18e229ffffffffffff');
maxExpArray[81] = /*#__PURE__*/bignumber.BigNumber.from('0x0399e96897690418f785257fffffffffff');
maxExpArray[82] = /*#__PURE__*/bignumber.BigNumber.from('0x0373fc456c53bb779bf0ea9fffffffffff');
maxExpArray[83] = /*#__PURE__*/bignumber.BigNumber.from('0x034f9e8e490c48e67e6ab8bfffffffffff');
maxExpArray[84] = /*#__PURE__*/bignumber.BigNumber.from('0x032cbfd4a7adc790560b3337ffffffffff');
maxExpArray[85] = /*#__PURE__*/bignumber.BigNumber.from('0x030b50570f6e5d2acca94613ffffffffff');
maxExpArray[86] = /*#__PURE__*/bignumber.BigNumber.from('0x02eb40f9f620fda6b56c2861ffffffffff');
maxExpArray[87] = /*#__PURE__*/bignumber.BigNumber.from('0x02cc8340ecb0d0f520a6af58ffffffffff');
maxExpArray[88] = /*#__PURE__*/bignumber.BigNumber.from('0x02af09481380a0a35cf1ba02ffffffffff');
maxExpArray[89] = /*#__PURE__*/bignumber.BigNumber.from('0x0292c5bdd3b92ec810287b1b3fffffffff');
maxExpArray[90] = /*#__PURE__*/bignumber.BigNumber.from('0x0277abdcdab07d5a77ac6d6b9fffffffff');
maxExpArray[91] = /*#__PURE__*/bignumber.BigNumber.from('0x025daf6654b1eaa55fd64df5efffffffff');
maxExpArray[92] = /*#__PURE__*/bignumber.BigNumber.from('0x0244c49c648baa98192dce88b7ffffffff');
maxExpArray[93] = /*#__PURE__*/bignumber.BigNumber.from('0x022ce03cd5619a311b2471268bffffffff');
maxExpArray[94] = /*#__PURE__*/bignumber.BigNumber.from('0x0215f77c045fbe885654a44a0fffffffff');
maxExpArray[95] = /*#__PURE__*/bignumber.BigNumber.from('0x01ffffffffffffffffffffffffffffffff');
maxExpArray[96] = /*#__PURE__*/bignumber.BigNumber.from('0x01eaefdbdaaee7421fc4d3ede5ffffffff');
maxExpArray[97] = /*#__PURE__*/bignumber.BigNumber.from('0x01d6bd8b2eb257df7e8ca57b09bfffffff');
maxExpArray[98] = /*#__PURE__*/bignumber.BigNumber.from('0x01c35fedd14b861eb0443f7f133fffffff');
maxExpArray[99] = /*#__PURE__*/bignumber.BigNumber.from('0x01b0ce43b322bcde4a56e8ada5afffffff');
maxExpArray[100] = /*#__PURE__*/bignumber.BigNumber.from('0x019f0028ec1fff007f5a195a39dfffffff');
maxExpArray[101] = /*#__PURE__*/bignumber.BigNumber.from('0x018ded91f0e72ee74f49b15ba527ffffff');
maxExpArray[102] = /*#__PURE__*/bignumber.BigNumber.from('0x017d8ec7f04136f4e5615fd41a63ffffff');
maxExpArray[103] = /*#__PURE__*/bignumber.BigNumber.from('0x016ddc6556cdb84bdc8d12d22e6fffffff');
maxExpArray[104] = /*#__PURE__*/bignumber.BigNumber.from('0x015ecf52776a1155b5bd8395814f7fffff');
maxExpArray[105] = /*#__PURE__*/bignumber.BigNumber.from('0x015060c256cb23b3b3cc3754cf40ffffff');
maxExpArray[106] = /*#__PURE__*/bignumber.BigNumber.from('0x01428a2f98d728ae223ddab715be3fffff');
maxExpArray[107] = /*#__PURE__*/bignumber.BigNumber.from('0x013545598e5c23276ccf0ede68034fffff');
maxExpArray[108] = /*#__PURE__*/bignumber.BigNumber.from('0x01288c4161ce1d6f54b7f61081194fffff');
maxExpArray[109] = /*#__PURE__*/bignumber.BigNumber.from('0x011c592761c666aa641d5a01a40f17ffff');
maxExpArray[110] = /*#__PURE__*/bignumber.BigNumber.from('0x0110a688680a7530515f3e6e6cfdcdffff');
maxExpArray[111] = /*#__PURE__*/bignumber.BigNumber.from('0x01056f1b5bedf75c6bcb2ce8aed428ffff');
maxExpArray[112] = /*#__PURE__*/bignumber.BigNumber.from('0x00faadceceeff8a0890f3875f008277fff');
maxExpArray[113] = /*#__PURE__*/bignumber.BigNumber.from('0x00f05dc6b27edad306388a600f6ba0bfff');
maxExpArray[114] = /*#__PURE__*/bignumber.BigNumber.from('0x00e67a5a25da41063de1495d5b18cdbfff');
maxExpArray[115] = /*#__PURE__*/bignumber.BigNumber.from('0x00dcff115b14eedde6fc3aa5353f2e4fff');
maxExpArray[116] = /*#__PURE__*/bignumber.BigNumber.from('0x00d3e7a3924312399f9aae2e0f868f8fff');
maxExpArray[117] = /*#__PURE__*/bignumber.BigNumber.from('0x00cb2ff529eb71e41582cccd5a1ee26fff');
maxExpArray[118] = /*#__PURE__*/bignumber.BigNumber.from('0x00c2d415c3db974ab32a51840c0b67edff');
maxExpArray[119] = /*#__PURE__*/bignumber.BigNumber.from('0x00bad03e7d883f69ad5b0a186184e06bff');
maxExpArray[120] = /*#__PURE__*/bignumber.BigNumber.from('0x00b320d03b2c343d4829abd6075f0cc5ff');
maxExpArray[121] = /*#__PURE__*/bignumber.BigNumber.from('0x00abc25204e02828d73c6e80bcdb1a95bf');
maxExpArray[122] = /*#__PURE__*/bignumber.BigNumber.from('0x00a4b16f74ee4bb2040a1ec6c15fbbf2df');
maxExpArray[123] = /*#__PURE__*/bignumber.BigNumber.from('0x009deaf736ac1f569deb1b5ae3f36c130f');
maxExpArray[124] = /*#__PURE__*/bignumber.BigNumber.from('0x00976bd9952c7aa957f5937d790ef65037');
maxExpArray[125] = /*#__PURE__*/bignumber.BigNumber.from('0x009131271922eaa6064b73a22d0bd4f2bf');
maxExpArray[126] = /*#__PURE__*/bignumber.BigNumber.from('0x008b380f3558668c46c91c49a2f8e967b9');
maxExpArray[127] = /*#__PURE__*/bignumber.BigNumber.from('0x00857ddf0117efa215952912839f6473e6');

function leftShift(num, shift) {
  return num.mul(TWO$1.pow(shift));
}

function signedRightShift(num, shift) {
  return num.div(TWO$1.pow(shift));
}
/**
     * @dev General Description:
     *     Determine a value of precision.
     *     Calculate an integer approximation of (_baseN / _baseD) ^ (_expN / _expD) * 2 ^ precision.
     *     Return the result along with the precision used.
     *
     * Detailed Description:
     *     Instead of calculating "base ^ exp", we calculate "e ^ (log(base) * exp)".
     *     The value of "log(base)" is represented with an integer slightly smaller than "log(base) * 2 ^ precision".
     *     The larger "precision" is, the more accurately this value represents the real value.
     *     However, the larger "precision" is, the more bits are required in order to store this value.
     *     And the exponentiation function, which takes "x" and calculates "e ^ x", is limited to a maximum exponent (maximum value of "x").
     *     This maximum exponent depends on the "precision" used, and it is given by "maxExpArray[precision] >> (MAX_PRECISION - precision)".
     *     Hence we need to determine the highest precision which can be used for the given input, before calling the exponentiation function.
     *     This allows us to compute "base ^ exp" with maximum accuracy and without exceeding 256 bits in any of the intermediate computations.
     *     This functions assumes that "_expN < 2 ^ 256 / log(MAX_NUM - 1)", otherwise the multiplication should be replaced with a "safeMul".
     *     Since we rely on unsigned-integer arithmetic and "base < 1" ==> "log(base) < 0", this function does not support "_baseN < _baseD".
     */


function power(_baseN, _baseD, _expN, _expD) {
  !_baseN.gt(_baseD) ?  invariant(false, "not support _baseN < _baseD")  : void 0;
  !_baseN.lt(MAX_NUM) ?  invariant(false)  : void 0;
  var baseLog;

  var base = _baseN.mul(FIXED_1).div(_baseD);

  if (base.lt(OPT_LOG_MAX_VAL)) {
    baseLog = optimalLog(base);
  } else {
    baseLog = generalLog(base);
  }

  var baseLogTimesExp = baseLog.mul(_expN).div(_expD);

  if (baseLogTimesExp.lt(OPT_EXP_MAX_VAL)) {
    return [optimalExp(baseLogTimesExp), MAX_PRECISION];
  } else {
    var precision = findPositionInMaxExpArray(baseLogTimesExp);
    return [generalExp(signedRightShift(baseLogTimesExp, bignumber.BigNumber.from(MAX_PRECISION - precision)), bignumber.BigNumber.from(precision)), precision];
  }
}
/**
 * @dev computes the largest integer smaller than or equal to the binary logarithm of the input.
 */

function floorLog2(_n) {
  var res = ZERO$1;

  if (_n.lt(_256)) {
    // At most 8 iterations
    while (_n.gt(ONE$1)) {
      _n = signedRightShift(_n, ONE$1);
      res = res.add(ONE$1);
    }
  } else {
    // Exactly 8 iterations
    for (var s = _128; s.gt(ZERO$1); s = signedRightShift(s, ONE$1)) {
      if (_n.gt(leftShift(ONE$1, s))) {
        _n = signedRightShift(_n, s);
        res = res.or(s);
      }
    }
  }

  return res;
}
/**
 * @dev computes log(x / FIXED_1) * FIXED_1.
 * This functions assumes that "x >= FIXED_1", because the output would be negative otherwise.
 */


function generalLog(x) {
  var res = ZERO$1; // If x >= 2, then we compute the integer part of log2(x), which is larger than 0.

  if (x.gte(FIXED_2)) {
    var count = floorLog2(x.div(FIXED_1));
    x = signedRightShift(x, count); // now x < 2

    res = count.mul(FIXED_1);
  } // If x > 1, then we compute the fraction part of log2(x), which is larger than 0.


  if (x.gt(FIXED_1)) {
    for (var i = MAX_PRECISION; i > 0; --i) {
      x = x.mul(x).div(FIXED_1); // now 1 < x < 4

      if (x.gte(FIXED_2)) {
        x = signedRightShift(x, ONE$1); // now 1 < x < 2

        res = res.add(leftShift(ONE$1, bignumber.BigNumber.from(i - 1)));
      }
    }
  }

  return res.mul(LN2_NUMERATOR).div(LN2_DENOMINATOR);
}
/**
    * @dev computes log(x / FIXED_1) * FIXED_1
    * Input range: FIXED_1 <= x <= OPT_LOG_MAX_VAL - 1
    * Auto-generated via "PrintFunctionOptimalLog.py"
    * Detailed description:
    * - Rewrite the input as a product of natural exponents and a single residual r, such that 1 < r < 2
    * - The natural logarithm of each (pre-calculated) exponent is the degree of the exponent
    * - The natural logarithm of r is calculated via Taylor series for log(1 + x), where x = r - 1
    * - The natural logarithm of the input is calculated by summing up the intermediate results above
    * - For example: log(250) = log(e^4 * e^1 * e^0.5 * 1.021692859) = 4 + 1 + 0.5 + log(1 + 0.021692859)
    */

function optimalLog(x) {
  var res = ZERO$1;
  var y;
  var z;
  var w;

  if (x.gte('0xd3094c70f034de4b96ff7d5b6f99fcd8')) {
    res = res.add(bignumber.BigNumber.from('0x40000000000000000000000000000000'));
    x = x.mul(FIXED_1).div(bignumber.BigNumber.from('0xd3094c70f034de4b96ff7d5b6f99fcd8'));
  } // add 1 / 2^1


  if (x.gte('0xa45af1e1f40c333b3de1db4dd55f29a7')) {
    res = res.add(bignumber.BigNumber.from('0x20000000000000000000000000000000'));
    x = x.mul(FIXED_1).div(bignumber.BigNumber.from('0xa45af1e1f40c333b3de1db4dd55f29a7'));
  } // add 1 / 2^2


  if (x.gte('0x910b022db7ae67ce76b441c27035c6a1')) {
    res = res.add(bignumber.BigNumber.from('0x10000000000000000000000000000000'));
    x = x.mul(FIXED_1).div(bignumber.BigNumber.from('0x910b022db7ae67ce76b441c27035c6a1'));
  } // add 1 / 2^3


  if (x.gte('0x88415abbe9a76bead8d00cf112e4d4a8')) {
    res = res.add(bignumber.BigNumber.from('0x08000000000000000000000000000000'));
    x = x.mul(FIXED_1).div(bignumber.BigNumber.from('0x88415abbe9a76bead8d00cf112e4d4a8'));
  } // add 1 / 2^4


  if (x.gte('0x84102b00893f64c705e841d5d4064bd3')) {
    res = res.add(bignumber.BigNumber.from('0x04000000000000000000000000000000'));
    x = x.mul(FIXED_1).div(bignumber.BigNumber.from('0x84102b00893f64c705e841d5d4064bd3'));
  } // add 1 / 2^5


  if (x.gte('0x8204055aaef1c8bd5c3259f4822735a2')) {
    res = res.add(bignumber.BigNumber.from('0x02000000000000000000000000000000'));
    x = x.mul(FIXED_1).div(bignumber.BigNumber.from('0x8204055aaef1c8bd5c3259f4822735a2'));
  } // add 1 / 2^6


  if (x.gte('0x810100ab00222d861931c15e39b44e99')) {
    res = res.add(bignumber.BigNumber.from('0x01000000000000000000000000000000'));
    x = x.mul(FIXED_1).div(bignumber.BigNumber.from('0x810100ab00222d861931c15e39b44e99'));
  } // add 1 / 2^7


  if (x.gte('0x808040155aabbbe9451521693554f733')) {
    res = res.add(bignumber.BigNumber.from('0x00800000000000000000000000000000'));
    x = x.mul(FIXED_1).div(bignumber.BigNumber.from('0x808040155aabbbe9451521693554f733'));
  } // add 1 / 2^8


  z = y = x.sub(FIXED_1);
  w = y.mul(y).div(FIXED_1);
  res = res.add(z.mul(bignumber.BigNumber.from('0x100000000000000000000000000000000').sub(y)).div(bignumber.BigNumber.from('0x100000000000000000000000000000000')));
  z = z.mul(w).div(FIXED_1); // add y^01 / 01 - y^02 / 02

  res = res.add(z.mul(bignumber.BigNumber.from('0x0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa').sub(y)).div(bignumber.BigNumber.from('0x200000000000000000000000000000000')));
  z = z.mul(w).div(FIXED_1); // add y^03 / 03 - y^04 / 04

  res = res.add(z.mul(bignumber.BigNumber.from('0x099999999999999999999999999999999').sub(y)).div(bignumber.BigNumber.from('0x300000000000000000000000000000000')));
  z = z.mul(w).div(FIXED_1); // add y^05 / 05 - y^06 / 06

  res = res.add(z.mul(bignumber.BigNumber.from('0x092492492492492492492492492492492').sub(y)).div(bignumber.BigNumber.from('0x400000000000000000000000000000000')));
  z = z.mul(w).div(FIXED_1); // add y^07 / 07 - y^08 / 08

  res = res.add(z.mul(bignumber.BigNumber.from('0x08e38e38e38e38e38e38e38e38e38e38e').sub(y)).div(bignumber.BigNumber.from('0x500000000000000000000000000000000')));
  z = z.mul(w).div(FIXED_1); // add y^09 / 09 - y^10 / 10

  res = res.add(z.mul(bignumber.BigNumber.from('0x08ba2e8ba2e8ba2e8ba2e8ba2e8ba2e8b').sub(y)).div(bignumber.BigNumber.from('0x600000000000000000000000000000000')));
  z = z.mul(w).div(FIXED_1); // add y^11 / 11 - y^12 / 12

  res = res.add(z.mul(bignumber.BigNumber.from('0x089d89d89d89d89d89d89d89d89d89d89').sub(y)).div(bignumber.BigNumber.from('0x700000000000000000000000000000000')));
  z = z.mul(w).div(FIXED_1); // add y^13 / 13 - y^14 / 14

  res = res.add(z.mul(bignumber.BigNumber.from('0x088888888888888888888888888888888').sub(y)).div(bignumber.BigNumber.from('0x800000000000000000000000000000000'))); // add y^15 / 15 - y^16 / 16

  return res;
}
function optimalExp(x) {
  var res = ZERO$1;
  var y;
  var z;
  z = y = x.mod(bignumber.BigNumber.from('0x10000000000000000000000000000000')); // get the input modulo 2^(-3)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(bignumber.BigNumber.from('0x10e1b3be415a0000'))); // add y^02 * (20! / 02!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(bignumber.BigNumber.from('0x05a0913f6b1e0000'))); // add y^03 * (20! / 03!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(bignumber.BigNumber.from('0x0168244fdac78000'))); // add y^04 * (20! / 04!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(bignumber.BigNumber.from('0x004807432bc18000'))); // add y^05 * (20! / 05!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(bignumber.BigNumber.from('0x000c0135dca04000'))); // add y^06 * (20! / 06!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(bignumber.BigNumber.from('0x0001b707b1cdc000'))); // add y^07 * (20! / 07!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(bignumber.BigNumber.from('0x000036e0f639b800'))); // add y^08 * (20! / 08!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(bignumber.BigNumber.from('0x00000618fee9f800'))); // add y^09 * (20! / 09!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(bignumber.BigNumber.from('0x0000009c197dcc00'))); // add y^10 * (20! / 10!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(bignumber.BigNumber.from('0x0000000e30dce400'))); // add y^11 * (20! / 11!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(bignumber.BigNumber.from('0x000000012ebd1300'))); // add y^12 * (20! / 12!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(bignumber.BigNumber.from('0x0000000017499f00'))); // add y^13 * (20! / 13!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(bignumber.BigNumber.from('0x0000000001a9d480'))); // add y^14 * (20! / 14!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(bignumber.BigNumber.from('0x00000000001c6380'))); // add y^15 * (20! / 15!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(bignumber.BigNumber.from('0x000000000001c638'))); // add y^16 * (20! / 16!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(bignumber.BigNumber.from('0x0000000000001ab8'))); // add y^17 * (20! / 17!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(bignumber.BigNumber.from('0x000000000000017c'))); // add y^18 * (20! / 18!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(bignumber.BigNumber.from('0x0000000000000014'))); // add y^19 * (20! / 19!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(bignumber.BigNumber.from('0x0000000000000001'))); // add y^20 * (20! / 20!)

  res = res.div(bignumber.BigNumber.from('0x21c3677c82b40000')).add(y).add(FIXED_1); // divide by 20! and then add y^1 / 1! + y^0 / 0!

  if (!x.and(bignumber.BigNumber.from('0x010000000000000000000000000000000')).isZero()) res = res.mul(bignumber.BigNumber.from('0x1c3d6a24ed82218787d624d3e5eba95f9')).div(bignumber.BigNumber.from('0x18ebef9eac820ae8682b9793ac6d1e776')); // multiply by e^2^(-3)

  if (!x.and(bignumber.BigNumber.from('0x020000000000000000000000000000000')).isZero()) res = res.mul(bignumber.BigNumber.from('0x18ebef9eac820ae8682b9793ac6d1e778')).div(bignumber.BigNumber.from('0x1368b2fc6f9609fe7aceb46aa619baed4')); // multiply by e^2^(-2)

  if (!x.and(bignumber.BigNumber.from('0x040000000000000000000000000000000')).isZero()) res = res.mul(bignumber.BigNumber.from('0x1368b2fc6f9609fe7aceb46aa619baed5')).div(bignumber.BigNumber.from('0x0bc5ab1b16779be3575bd8f0520a9f21f')); // multiply by e^2^(-1)

  if (!x.and(bignumber.BigNumber.from('0x080000000000000000000000000000000')).isZero()) res = res.mul(bignumber.BigNumber.from('0x0bc5ab1b16779be3575bd8f0520a9f21e')).div(bignumber.BigNumber.from('0x0454aaa8efe072e7f6ddbab84b40a55c9')); // multiply by e^2^(+0)

  if (!x.and(bignumber.BigNumber.from('0x100000000000000000000000000000000')).isZero()) res = res.mul(bignumber.BigNumber.from('0x0454aaa8efe072e7f6ddbab84b40a55c5')).div(bignumber.BigNumber.from('0x00960aadc109e7a3bf4578099615711ea')); // multiply by e^2^(+1)

  if (!x.and(bignumber.BigNumber.from('0x200000000000000000000000000000000')).isZero()) res = res.mul(bignumber.BigNumber.from('0x00960aadc109e7a3bf4578099615711d7')).div(bignumber.BigNumber.from('0x0002bf84208204f5977f9a8cf01fdce3d')); // multiply by e^2^(+2)

  if (!x.and(bignumber.BigNumber.from('0x400000000000000000000000000000000')).isZero()) res = res.mul(bignumber.BigNumber.from('0x0002bf84208204f5977f9a8cf01fdc307')).div(bignumber.BigNumber.from('0x0000003c6ab775dd0b95b4cbee7e65d11')); // multiply by e^2^(+3)

  return res;
}
/**
   * @dev this function can be auto-generated by the script "PrintFunctionGeneralExp.py".
   * it approximates "e ^ x" via maclaurin summation: "(x^0)/0! + (x^1)/1! + ... + (x^n)/n!".
   * it returns "e ^ (x / 2 ^ precision) * 2 ^ precision", that is, the result is upshifted for accuracy.
   * the global "maxExpArray" maps each "precision" to "((maximumExponent + 1) << (MAX_PRECISION - precision)) - 1".
   * the maximum permitted value for "x" is therefore given by "maxExpArray[precision] >> (MAX_PRECISION - precision)".
   */

function generalExp(_x, _precision) {
  var xi = _x;
  var res = ZERO$1;
  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x3442c4e6074a82f1797f72ac0000000')); // add x^02 * (33! / 02!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x116b96f757c380fb287fd0e40000000')); // add x^03 * (33! / 03!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x045ae5bdd5f0e03eca1ff4390000000')); // add x^04 * (33! / 04!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x00defabf91302cd95b9ffda50000000')); // add x^05 * (33! / 05!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x002529ca9832b22439efff9b8000000')); // add x^06 * (33! / 06!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x00054f1cf12bd04e516b6da88000000')); // add x^07 * (33! / 07!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x0000a9e39e257a09ca2d6db51000000')); // add x^08 * (33! / 08!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x000012e066e7b839fa050c309000000')); // add x^09 * (33! / 09!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x000001e33d7d926c329a1ad1a800000')); // add x^10 * (33! / 10!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x0000002bee513bdb4a6b19b5f800000')); // add x^11 * (33! / 11!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x00000003a9316fa79b88eccf2a00000')); // add x^12 * (33! / 12!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x0000000048177ebe1fa812375200000')); // add x^13 * (33! / 13!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x0000000005263fe90242dcbacf00000')); // add x^14 * (33! / 14!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x000000000057e22099c030d94100000')); // add x^15 * (33! / 15!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x0000000000057e22099c030d9410000')); // add x^16 * (33! / 16!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x00000000000052b6b54569976310000')); // add x^17 * (33! / 17!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x00000000000004985f67696bf748000')); // add x^18 * (33! / 18!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x000000000000003dea12ea99e498000')); // add x^19 * (33! / 19!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x00000000000000031880f2214b6e000')); // add x^20 * (33! / 20!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x000000000000000025bcff56eb36000')); // add x^21 * (33! / 21!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x000000000000000001b722e10ab1000')); // add x^22 * (33! / 22!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x0000000000000000001317c70077000')); // add x^23 * (33! / 23!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x00000000000000000000cba84aafa00')); // add x^24 * (33! / 24!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x00000000000000000000082573a0a00')); // add x^25 * (33! / 25!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x00000000000000000000005035ad900')); // add x^26 * (33! / 26!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x000000000000000000000002f881b00')); // add x^27 * (33! / 27!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x0000000000000000000000001b29340')); // add x^28 * (33! / 28!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x00000000000000000000000000efc40')); // add x^29 * (33! / 29!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x0000000000000000000000000007fe0')); // add x^30 * (33! / 30!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x0000000000000000000000000000420')); // add x^31 * (33! / 31!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x0000000000000000000000000000021')); // add x^32 * (33! / 32!)

  xi = signedRightShift(xi.mul(_x), _precision);
  res = res.add(xi.mul('0x0000000000000000000000000000001')); // add x^33 * (33! / 33!)

  return res.div(bignumber.BigNumber.from('0x688589cc0e9505e2f2fee5580000000')).add(_x).add(leftShift(ONE$1, _precision)); // divide by 33! and then add x^1 / 1! + x^0 / 0!
}
/**
    * @dev the global "maxExpArray" is sorted in descending order, and therefore the following statements are equivalent:
    * - This function finds the position of [the smallest value in "maxExpArray" larger than or equal to "x"]
    * - This function finds the highest position of [a value in "maxExpArray" larger than or equal to "x"]
    */

function findPositionInMaxExpArray(_x) {
  var lo = MIN_PRECISION;
  var hi = MAX_PRECISION;

  while (lo + 1 < hi) {
    var mid = (lo + hi) / 2;
    if (maxExpArray[mid].gte(_x)) lo = mid;else hi = mid;
  }

  if (maxExpArray[hi].gte(_x)) return hi;
  if (maxExpArray[lo].gte(_x)) return lo;
    invariant(false)  ;
}
/**
 * @dev given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset,
 *
 * Formula:
 * return = reserveOut * (1 - (reserveIn * 10000 / (reserveIn * 10000 + amountIn * (10000 - swapFee))) ^ (tokenWeightIn / tokenWeightOut))
 *
 * @param amountIn                  source reserve amount
 * @param reserveIn    source reserve balance
 * @param reserveOut    target reserve balance
 * @param tokenWeightIn     source reserve weight, represented in ppm (2-98)
 * @param tokenWeightOut     target reserve weight, represented in ppm (2-98)
 * @param swapFee                  swap fee of the conversion
 *
 * @return amountOut
 */

function getAmountOut(amountIn, reserveIn, reserveOut, tokenWeightIn, tokenWeightOut, swapFee) {
  // validate input
  !amountIn.gt(ZERO$1) ?  invariant(false, "RequiemFormula: INSUFFICIENT_INPUT_AMOUNT")  : void 0; // if (amountIn.lte(ZERO) || amountIn.eq(ZERO))
  //     return ZERO

  !(reserveIn.gt(ZERO$1) && reserveOut.gt(ZERO$1)) ?  invariant(false, "RequiemFormula: INSUFFICIENT_LIQUIDITY")  : void 0;
  var amountInWithFee = amountIn.mul(TENK.sub(swapFee)); // special case for equal weights

  if (tokenWeightIn.eq(tokenWeightOut)) {
    return reserveOut.mul(amountInWithFee).div(reserveIn.mul(TENK).add(amountInWithFee));
  } // let result;
  // let precision: number;


  var baseN = reserveIn.mul(TENK).add(amountInWithFee);

  var _power = power(baseN, reserveIn.mul(TENK), tokenWeightIn, tokenWeightOut),
      result = _power[0],
      precision = _power[1];

  var temp1 = reserveOut.mul(result);
  var temp2 = leftShift(reserveOut, bignumber.BigNumber.from(precision));
  return temp1.sub(temp2).div(result);
}
/**
 * @dev given an output amount of an asset and pair reserves, returns a required input amount of the other asset
 *
 * Formula:
 * return = reserveIn * ( (reserveOut / (reserveOut - amountOut)) ^ (tokenWeightOut / tokenWeightIn) - 1) * (10000/ (10000 - swapFee)
 *
 * @param amountOut     target reserve amount
 * @param reserveIn    source reserve balance
 * @param reserveOut    target reserve balance
 * @param tokenWeightIn     source reserve weight, represented in ppm (2-98)
 * @param tokenWeightOut     target reserve weight, represented in ppm (2-98)
 * @param swapFee                  swap fee of the conversion
 *
 * @return amountIn
 */

function getAmountIn(amountOut, reserveIn, reserveOut, tokenWeightIn, tokenWeightOut, swapFee) {
  // validate input
  !amountOut.gt(ZERO$1) ?  invariant(false, "RequiemFormula: INSUFFICIENT_OUTPUT_AMOUNT")  : void 0; // if (amountOut.gte(ZERO) || amountOut.eq(ZERO))
  //     return ZERO

  !(reserveIn.gt(ZERO$1) && reserveOut.gt(ZERO$1)) ?  invariant(false, "RequiemFormula: INSUFFICIENT_LIQUIDITY")  : void 0; // special case for equal weights

  if (tokenWeightIn.eq(tokenWeightOut)) {
    var numerator = reserveIn.mul(amountOut).mul(TENK);
    var denominator = reserveOut.sub(amountOut).mul(TENK.sub(swapFee));
    return numerator.div(denominator).add(1);
  }

  var baseD = reserveOut.sub(amountOut);

  var _power2 = power(reserveOut, baseD, tokenWeightOut, tokenWeightIn),
      result = _power2[0],
      precision = _power2[1];

  var baseReserveIn = reserveIn.mul(TENK);
  var temp1 = baseReserveIn.mul(result);
  var temp2 = leftShift(baseReserveIn, bignumber.BigNumber.from(precision));
  return signedRightShift(temp1.sub(temp2), bignumber.BigNumber.from(precision)).div(TENK.sub(swapFee)).add(1);
}

var PAIR_ADDRESS_CACHE$1 = {};
var WeightedPair = /*#__PURE__*/function () {
  function WeightedPair(tokenAmountA, tokenAmountB, weightA, fee) {
    var tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
    ? [tokenAmountA, tokenAmountB] : [tokenAmountB, tokenAmountA];
    this.weights = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
    ? [weightA, JSBI.subtract(_100, weightA)] : [JSBI.subtract(_100, weightA), weightA];
    this.fee = fee;
    this.liquidityToken = new Token(tokenAmounts[0].token.chainId, WeightedPair.getAddress(tokenAmounts[0].token, tokenAmounts[1].token, weightA, fee), 18, 'Requiem-LP', 'Requiem LPs');
    this.type = exports.PoolType.WeightedPair; // assign pricing bases

    this.pricingBasesIn = tokenAmounts;
    this.pricingBasesOut = tokenAmounts;
    this.tokenAmounts = tokenAmounts;
  }

  WeightedPair.getAddress = function getAddress(tokenA, tokenB, weightA, fee) {
    var _PAIR_ADDRESS_CACHE, _PAIR_ADDRESS_CACHE$t, _PAIR_ADDRESS_CACHE$t2;

    var tokens = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]; // does safety checks

    var weights = tokenA.sortsBefore(tokenB) ? [weightA.toString(), JSBI.subtract(_100, weightA).toString()] : [JSBI.subtract(_100, weightA).toString(), weightA.toString()]; // does safety checks

    if (((_PAIR_ADDRESS_CACHE = PAIR_ADDRESS_CACHE$1) === null || _PAIR_ADDRESS_CACHE === void 0 ? void 0 : (_PAIR_ADDRESS_CACHE$t = _PAIR_ADDRESS_CACHE[tokens[0].address]) === null || _PAIR_ADDRESS_CACHE$t === void 0 ? void 0 : (_PAIR_ADDRESS_CACHE$t2 = _PAIR_ADDRESS_CACHE$t[tokens[1].address]) === null || _PAIR_ADDRESS_CACHE$t2 === void 0 ? void 0 : _PAIR_ADDRESS_CACHE$t2[weights[0] + "-" + fee.toString()]) === undefined) {
      var _PAIR_ADDRESS_CACHE2, _PAIR_ADDRESS_CACHE3, _PAIR_ADDRESS_CACHE3$, _extends2, _extends3, _extends4;

      PAIR_ADDRESS_CACHE$1 = _extends({}, PAIR_ADDRESS_CACHE$1, (_extends4 = {}, _extends4[tokens[0].address] = _extends({}, (_PAIR_ADDRESS_CACHE2 = PAIR_ADDRESS_CACHE$1) === null || _PAIR_ADDRESS_CACHE2 === void 0 ? void 0 : _PAIR_ADDRESS_CACHE2[tokens[0].address], (_extends3 = {}, _extends3[tokens[1].address] = _extends({}, (_PAIR_ADDRESS_CACHE3 = PAIR_ADDRESS_CACHE$1) === null || _PAIR_ADDRESS_CACHE3 === void 0 ? void 0 : (_PAIR_ADDRESS_CACHE3$ = _PAIR_ADDRESS_CACHE3[tokens[0].address]) === null || _PAIR_ADDRESS_CACHE3$ === void 0 ? void 0 : _PAIR_ADDRESS_CACHE3$[tokens[1].address], (_extends2 = {}, _extends2[weights[0] + "-" + fee.toString()] = address.getCreate2Address(WEIGHTED_FACTORY_ADDRESS[tokens[0].chainId], solidity.keccak256(['bytes'], [solidity.pack(['address', 'address', 'uint32', 'uint32'], [tokens[0].address, tokens[1].address, weights[0], fee.toString()])]), INIT_CODE_HASH_WEIGHTED[tokens[0].chainId]), _extends2)), _extends3)), _extends4));
    }

    return PAIR_ADDRESS_CACHE$1[tokens[0].address][tokens[1].address][weights[0] + "-" + fee.toString()];
  };

  var _proto = WeightedPair.prototype;

  _proto.getAddressForRouter = function getAddressForRouter() {
    return this.liquidityToken.address;
  }
  /**
   * Returns true if the token is either token0 or token1
   * @param token to check
   */
  ;

  _proto.involvesToken = function involvesToken(token) {
    return token.equals(this.token0) || token.equals(this.token1);
  }
  /**
   * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
   */
  ;

  /**
   * Return the price of the given token in terms of the other token in the pair.
   * @param token token to return price of
   */
  _proto.priceOf = function priceOf(token) {
    !this.involvesToken(token) ?  invariant(false, 'TOKEN')  : void 0;
    return token.equals(this.token0) ? this.token0Price : this.token1Price;
  }
  /**
   * Returns the chain ID of the tokens in the pair.
   */
  ;

  _proto.reserveOf = function reserveOf(token) {
    !this.involvesToken(token) ?  invariant(false, 'TOKEN')  : void 0;
    return token.equals(this.token0) ? this.reserve0 : this.reserve1;
  };

  _proto.weightOf = function weightOf(token) {
    !this.involvesToken(token) ?  invariant(false, 'TOKEN')  : void 0;
    return token.equals(this.token0) ? this.weight0 : this.weight1;
  };

  _proto.getOutputAmount = function getOutputAmount(inputAmount) {
    !this.involvesToken(inputAmount.token) ?  invariant(false, 'TOKEN')  : void 0;

    if (JSBI.equal(this.reserve0.raw, ZERO) || JSBI.equal(this.reserve1.raw, ZERO)) {
      throw new InsufficientReservesError();
    }

    var inputReserve = this.reserveOf(inputAmount.token);
    var outputReserve = this.reserveOf(inputAmount.token.equals(this.token0) ? this.token1 : this.token0);
    var inputWeight = this.weightOf(inputAmount.token);
    var outputWeight = this.weightOf(inputAmount.token.equals(this.token0) ? this.token1 : this.token0);
    var outputAmount = new TokenAmount(inputAmount.token.equals(this.token0) ? this.token1 : this.token0, // getAmountOut(inputAmount.raw, inputReserve.raw, outputReserve.raw, inputWeight, outputWeight, this.fee)
    JSBI.BigInt(getAmountOut(inputAmount.toBigNumber(), inputReserve.toBigNumber(), outputReserve.toBigNumber(), bignumber.BigNumber.from(inputWeight.toString()), bignumber.BigNumber.from(outputWeight.toString()), bignumber.BigNumber.from(this.fee.toString())).toString())); // console.log("OA", outputAmount.raw.toString())

    if (JSBI.equal(outputAmount.raw, ZERO)) {
      throw new InsufficientInputAmountError();
    } // here we save the pricing results if it is called


    var inIndex = inputAmount.token.equals(this.token0) ? 0 : 1;
    var outIndex = outputAmount.token.equals(this.token0) ? 0 : 1;
    this.pricingBasesIn[inIndex] = inputAmount;
    this.pricingBasesOut[outIndex] = outputAmount;
    return [outputAmount, new WeightedPair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount), inputWeight, this.fee)];
  };

  _proto.getInputAmount = function getInputAmount(outputAmount) {
    !this.involvesToken(outputAmount.token) ?  invariant(false, 'TOKEN')  : void 0;
    console.log("-- this 0", this.reserve0.raw, "1", this.reserve1.raw, "out", outputAmount.raw);

    if (JSBI.equal(this.reserve0.raw, ZERO) || JSBI.equal(this.reserve1.raw, ZERO) || JSBI.greaterThanOrEqual(outputAmount.raw, this.reserveOf(outputAmount.token).raw)) {
      throw new InsufficientReservesError();
    }

    var outputReserve = this.reserveOf(outputAmount.token);
    var inputReserve = this.reserveOf(outputAmount.token.equals(this.token0) ? this.token1 : this.token0);
    var outputWeight = this.weightOf(outputAmount.token);
    var inputWeight = this.weightOf(outputAmount.token.equals(this.token0) ? this.token1 : this.token0);
    var inputAmount = new TokenAmount(outputAmount.token.equals(this.token0) ? this.token1 : this.token0, // getAmountIn(outputAmount.raw, inputReserve.raw, outputReserve.raw, inputWeight, outputWeight, this.fee)
    JSBI.BigInt(getAmountIn(outputAmount.toBigNumber(), inputReserve.toBigNumber(), outputReserve.toBigNumber(), bignumber.BigNumber.from(inputWeight.toString()), bignumber.BigNumber.from(outputWeight.toString()), bignumber.BigNumber.from(this.fee.toString())).toString())); // here we save the pricing results if it is called

    var inIndex = inputAmount.token.equals(this.token0) ? 0 : 1;
    var outIndex = outputAmount.token.equals(this.token0) ? 0 : 1;
    this.pricingBasesIn[inIndex] = inputAmount;
    this.pricingBasesOut[outIndex] = outputAmount;
    return [inputAmount, new WeightedPair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount), inputWeight, this.fee)];
  };

  _proto.getLiquidityMinted = function getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB) {
    !totalSupply.token.equals(this.liquidityToken) ?  invariant(false, 'LIQUIDITY')  : void 0;
    var tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
    ? [tokenAmountA, tokenAmountB] : [tokenAmountB, tokenAmountA];
    !(tokenAmounts[0].token.equals(this.token0) && tokenAmounts[1].token.equals(this.token1)) ?  invariant(false, 'TOKEN')  : void 0;
    var liquidity;

    if (JSBI.equal(totalSupply.raw, ZERO)) {
      liquidity = JSBI.subtract(sqrt(JSBI.multiply(tokenAmounts[0].raw, tokenAmounts[1].raw)), MINIMUM_LIQUIDITY);
    } else {
      var amount0 = JSBI.divide(JSBI.multiply(tokenAmounts[0].raw, totalSupply.raw), this.reserve0.raw);
      var amount1 = JSBI.divide(JSBI.multiply(tokenAmounts[1].raw, totalSupply.raw), this.reserve1.raw);
      liquidity = JSBI.lessThanOrEqual(amount0, amount1) ? amount0 : amount1;
    }

    if (!JSBI.greaterThan(liquidity, ZERO)) {
      throw new InsufficientInputAmountError();
    }

    return new TokenAmount(this.liquidityToken, liquidity);
  };

  _proto.getLiquidityValue = function getLiquidityValue(token, totalSupply, liquidity, feeOn, kLast) {
    if (feeOn === void 0) {
      feeOn = false;
    }

    !this.involvesToken(token) ?  invariant(false, 'TOKEN')  : void 0;
    !totalSupply.token.equals(this.liquidityToken) ?  invariant(false, 'TOTAL_SUPPLY')  : void 0;
    !liquidity.token.equals(this.liquidityToken) ?  invariant(false, 'LIQUIDITY')  : void 0;
    !JSBI.lessThanOrEqual(liquidity.raw, totalSupply.raw) ?  invariant(false, 'LIQUIDITY')  : void 0;
    var totalSupplyAdjusted;

    if (!feeOn) {
      totalSupplyAdjusted = totalSupply;
    } else {
      !!!kLast ?  invariant(false, 'K_LAST')  : void 0;
      var kLastParsed = parseBigintIsh(kLast);

      if (!JSBI.equal(kLastParsed, ZERO)) {
        var rootK = sqrt(JSBI.multiply(this.reserve0.raw, this.reserve1.raw));
        var rootKLast = sqrt(kLastParsed);

        if (JSBI.greaterThan(rootK, rootKLast)) {
          var numerator = JSBI.multiply(totalSupply.raw, JSBI.subtract(rootK, rootKLast));
          var denominator = JSBI.add(JSBI.multiply(rootK, FIVE), rootKLast);
          var feeLiquidity = JSBI.divide(numerator, denominator);
          totalSupplyAdjusted = totalSupply.add(new TokenAmount(this.liquidityToken, feeLiquidity));
        } else {
          totalSupplyAdjusted = totalSupply;
        }
      } else {
        totalSupplyAdjusted = totalSupply;
      }
    }

    return new TokenAmount(token, JSBI.divide(JSBI.multiply(liquidity.raw, this.reserveOf(token).raw), totalSupplyAdjusted.raw));
  };

  _proto.clone = function clone() {
    return new WeightedPair(this.tokenAmounts[0], this.tokenAmounts[1], this.weight0, this.fee);
  } // these are only supposed to be used for liquidity calculations

  /**
  * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
  */
  ;

  /**
   * Return the price of the given token in terms of the other token in the pair.
   * @param token token to return price of
   */
  _proto.priceRatioOf = function priceRatioOf(token) {
    !this.involvesToken(token) ?  invariant(false, 'TOKEN')  : void 0;
    return token.equals(this.token0) ? this.token0PriceRaw : this.token1PriceRaw;
  };

  _createClass(WeightedPair, [{
    key: "token0Price",
    get: function get() {
      return new Price(this.token0, this.token1, JSBI.multiply(this.tokenAmounts[0].raw, this.weight1), JSBI.multiply(this.tokenAmounts[1].raw, this.weight0));
    }
    /**
     * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
     */

  }, {
    key: "token1Price",
    get: function get() {
      return new Price(this.token1, this.token0, JSBI.multiply(this.tokenAmounts[1].raw, this.weight0), JSBI.multiply(this.tokenAmounts[0].raw, this.weight1));
    }
  }, {
    key: "fee0",
    get: function get() {
      return this.fee;
    }
  }, {
    key: "chainId",
    get: function get() {
      return this.token0.chainId;
    }
  }, {
    key: "token0",
    get: function get() {
      return this.tokenAmounts[0].token;
    }
  }, {
    key: "token1",
    get: function get() {
      return this.tokenAmounts[1].token;
    }
  }, {
    key: "reserve0",
    get: function get() {
      return this.tokenAmounts[0];
    }
  }, {
    key: "reserve1",
    get: function get() {
      return this.tokenAmounts[1];
    }
  }, {
    key: "weight0",
    get: function get() {
      return this.weights[0];
    }
  }, {
    key: "weight1",
    get: function get() {
      return this.weights[1];
    }
  }, {
    key: "token0PriceRaw",
    get: function get() {
      return new Price(this.token0, this.token1, this.tokenAmounts[0].raw, this.tokenAmounts[1].raw);
    }
    /**
     * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
     */

  }, {
    key: "token1PriceRaw",
    get: function get() {
      return new Price(this.token1, this.token0, this.tokenAmounts[1].raw, this.tokenAmounts[0].raw);
    }
  }]);

  return WeightedPair;
}();

var STABLECOINS = {
  43113: [/*#__PURE__*/new Token(exports.ChainId.AVAX_TESTNET, '0xca9ec7085ed564154a9233e1e7d8fef460438eea', 6, 'USDC', 'USD Coin'), /*#__PURE__*/new Token(exports.ChainId.AVAX_TESTNET, '0xffb3ed4960cac85372e6838fbc9ce47bcf2d073e', 6, 'USDT', 'Tether USD'), /*#__PURE__*/new Token(exports.ChainId.AVAX_TESTNET, '0xaea51e4fee50a980928b4353e852797b54deacd8', 18, 'DAI', 'Dai Stablecoin'), /*#__PURE__*/new Token(exports.ChainId.AVAX_TESTNET, '0xccf7ed44c5a0f3cb5c9a9b9f765f8d836fb93ba1', 18, 'TUSD', 'True USD')],
  42261: [/*#__PURE__*/new Token(exports.ChainId.OASIS_TESTNET, '0x9aEeeD65aE87e3b28793aefAeED59c3f10ef956b', 6, 'USDC', 'USD Coin'), /*#__PURE__*/new Token(exports.ChainId.OASIS_TESTNET, '0xfA0D8065755Fb3b6520149e86Ac5A3Dc3ee5Dc92', 6, 'USDT', 'Tether USD'), /*#__PURE__*/new Token(exports.ChainId.OASIS_TESTNET, '0xf10Bd0dA1f0e69c3334D7F8116C9082746EBC1B4', 18, 'DAI', 'Dai Stablecoin'), /*#__PURE__*/new Token(exports.ChainId.OASIS_TESTNET, '0x4e8848da06E40E866b82f6b52417494936c9509b', 18, 'TUSD', 'True USD')],
  110001: [/*#__PURE__*/new Token(exports.ChainId.QUARKCHAIN_DEV_S0, '0xE59c1Ddf4fAAC4Fa7C8c93d9392d4bBa55383268', 6, 'USDC', 'USD Coin'), /*#__PURE__*/new Token(exports.ChainId.QUARKCHAIN_DEV_S0, '0x1a69a6e206c680A8559c59b951527437CBCe6Ed7', 6, 'USDT', 'Tether USD'), /*#__PURE__*/new Token(exports.ChainId.QUARKCHAIN_DEV_S0, '0x51b90a5Bc99B7c76EDf3863E1d61ca6197a6e542', 18, 'DAI', 'Dai Stablecoin'), /*#__PURE__*/new Token(exports.ChainId.QUARKCHAIN_DEV_S0, '0xD71C821a373E16D607277DB6C1356c1209C7d866', 18, 'TUSD', 'True USD')],
  0: [/*#__PURE__*/new Token(-1, '0xCa9eC7085Ed564154a9233e1e7D8fEF460438EEA', 6, 'USDC', 'USD Coin')]
};
var STABLES_INDEX_MAP = {
  43113: {
    0: STABLECOINS[43113][0],
    1: STABLECOINS[43113][1],
    2: STABLECOINS[43113][2],
    3: STABLECOINS[43113][3]
  },
  42261: {
    0: STABLECOINS[42261][0],
    1: STABLECOINS[42261][1],
    2: STABLECOINS[42261][2],
    3: STABLECOINS[42261][3]
  },
  110001: {
    0: STABLECOINS[110001][0],
    1: STABLECOINS[110001][1],
    2: STABLECOINS[110001][2],
    3: STABLECOINS[110001][3]
  }
};
var STABLES_LP_TOKEN = {
  43113: {
    0: STABLECOINS[43113][0],
    1: STABLECOINS[43113][1],
    2: STABLECOINS[43113][2],
    3: STABLECOINS[43113][3]
  }
};

var StablePairWrapper = /*#__PURE__*/function () {
  // public executionPrice: Price
  // public readonly inputReserve: TokenAmount
  // public readonly outputReserve: TokenAmount
  function StablePairWrapper(tokenAmountA, tokenAmountB, indexA, indexB) {
    var _STABLE_POOL_LP_ADDRE;

    !(tokenAmountA.token.chainId === tokenAmountB.token.chainId) ?  invariant(false, 'CHAIN_IDS')  : void 0;
    this.liquidityToken = new Token(tokenAmountA.token.chainId, (_STABLE_POOL_LP_ADDRE = STABLE_POOL_LP_ADDRESS[tokenAmountA.token.chainId]) !== null && _STABLE_POOL_LP_ADDRE !== void 0 ? _STABLE_POOL_LP_ADDRE : '0x0000000000000000000000000000000000000001', 18, 'RequiemStable-LP', 'Requiem StableSwap LPs');
    this.tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) ? [tokenAmountA, tokenAmountB] : [tokenAmountB, tokenAmountA];
    this.stableIndexes = tokenAmountA.token.sortsBefore(tokenAmountB.token) ? [indexA, indexB] : [indexB, indexA];
    this.pricingBasesIn = this.tokenAmounts;
    this.pricingBasesOut = this.tokenAmounts; // this.executionPrice = new Price(tokenAmountA.token, tokenAmountB.token, tokenAmountA.raw, tokenAmountB.raw)

    this.referenceMidPrices = [];
    this.type = exports.PoolType.StablePairWrapper;
    this.status = 'NOT PRICED';
  }

  var _proto = StablePairWrapper.prototype;

  _proto.getAddressForRouter = function getAddressForRouter() {
    return STABLE_POOL_ADDRESS[this.tokenAmounts[0].token.chainId];
  }
  /**
   * Returns the chain ID of the tokens in the pair.
   */
  ;

  // this gets the reserve of the respectve (stable) token
  _proto.reserveOf = function reserveOf(token) {
    !this.involvesToken(token) ?  invariant(false, 'TOKEN')  : void 0;
    return token.equals(this.token0) ? this.reserve0 : this.reserve1;
  };

  _proto.involvesToken = function involvesToken(token) {
    return token.equals(this.token0) || token.equals(this.token1);
  };

  _proto.priceOf = function priceOf(token, stablePool, volume) {
    !this.involvesToken(token) ?  invariant(false, 'TOKEN')  : void 0;
    return token.equals(this.token0) ? this.token0Price(stablePool, volume) : this.token1Price(stablePool, volume);
  }
  /**
  * Returns the current price at given volume of the pair in terms of token0, i.e. the ratio calculated by the stableSwap
  */
  ;

  _proto.token0Price = function token0Price(stablePool, volume) {
    var outToken1 = stablePool.calculateSwap(this.stableIndexes[0], this.stableIndexes[1], volume);
    return new Price(this.token0, this.token1, outToken1.toBigInt(), volume.toBigInt());
  }
  /**
  * Returns the current mid price of the pair in terms of token1, i.e. the ratio calculated by the stableSwap
  */
  ;

  _proto.token1Price = function token1Price(stablePool, volume) {
    var outToken0 = stablePool.calculateSwap(this.stableIndexes[1], this.stableIndexes[0], volume);
    return new Price(this.token1, this.token0, outToken0.toBigInt(), volume.toBigInt());
  };

  _proto.priceFromReserve = function priceFromReserve(outToken) {
    var outIndex = outToken.equals(this.token0) ? 0 : 1;
    var inIndex = outToken.equals(this.token1) ? 0 : 1;
    return new Price(this.pricingBasesIn[inIndex].token, this.pricingBasesOut[outIndex].token, this.pricingBasesIn[inIndex].raw, this.pricingBasesOut[outIndex].raw);
  }
  /**
   * function that wraps the output calculation based on a stablePool
   * @param inputAmount input amount that is used for calculating the output amount
   * @param stablePool input stablePool: IMPORTANT NOTE: the balances of that object change according to the trade logic
   * this is required as multiple trades will lead to adjusted balances in case it is routed twice or more through the pool
   * @returns the output amount as TokenAmount and the StableWrappedPair with the adjusted balances
   */
  ;

  _proto.getOutputAmount = function getOutputAmount(inputAmount, stablePool) {
    !this.involvesToken(inputAmount.token) ?  invariant(false, 'TOKEN')  : void 0;
    var inputReserve = this.reserveOf(inputAmount.token);
    var outputReserve = this.reserveOf(inputAmount.token.equals(this.token0) ? this.token1 : this.token0);
    var output = stablePool.getOutputAmount(inputAmount, this.token0.equals(inputAmount.token) ? this.stableIndexes[1] : this.stableIndexes[0]); // adjust the values based on the supposdly executed trade

    stablePool.addBalanceValue(inputAmount);
    stablePool.subtractBalanceValue(output); // here we save the pricing results if it is called

    var inIndex = inputAmount.token.equals(this.token0) ? 0 : 1;
    var outIndex = output.token.equals(this.token0) ? 0 : 1;
    this.pricingBasesIn[inIndex] = inputAmount;
    this.pricingBasesOut[outIndex] = output;
    this.status = 'PRICED'; // console.log("get " + output.raw.toString() + output.token.symbol + " for " + inputAmount.raw.toString() + inputAmount.token.symbol)
    // this.executionPrice = new Price(inputAmount.token, output.token, inputAmount.raw, output.raw)

    return [output, new StablePairWrapper(inputAmount, output, stablePool.indexFromToken(inputReserve.token), stablePool.indexFromToken(outputReserve.token))];
  }
  /**
   * function that wraps the input calculation based on a stablePool
   * @param outputAmount output amount to calculate the input with
   * @param stablePool  input stablePool: IMPORTANT NOTE: the balances of that object change according to the trade logic
   * this is required as multiple trades will lead to adjusted balances in case it is routed twice or more through the pool
   * @returns the input TokenAmount required to obtain the target output
   */
  ;

  _proto.getInputAmount = function getInputAmount(outputAmount, stablePool) {
    !this.involvesToken(outputAmount.token) ?  invariant(false, 'TOKEN')  : void 0;
    var outputReserve = this.reserveOf(outputAmount.token);
    var inputReserve = this.reserveOf(outputAmount.token.equals(this.token0) ? this.token1 : this.token0);
    var input = stablePool.getInputAmount(outputAmount, this.token0.equals(outputAmount.token) ? this.stableIndexes[1] : this.stableIndexes[0]); // here we save the pricing results if it is called

    var inIndex = input.token.equals(this.token0) ? 0 : 1;
    var outIndex = outputAmount.token.equals(this.token0) ? 0 : 1;
    this.pricingBasesIn[inIndex] = input;
    this.pricingBasesOut[outIndex] = outputAmount;
    this.status = 'PRICED'; // adjust the values based on the supposdly executed trade

    stablePool.addBalanceValue(input);
    stablePool.subtractBalanceValue(outputAmount); // console.log("get " + outputAmount.raw.toString() + outputAmount.token.symbol + " for " + input.raw.toString() + input.token.symbol)

    return [input, new StablePairWrapper(input, outputAmount, stablePool.indexFromToken(inputReserve.token), stablePool.indexFromToken(outputReserve.token))];
  } // generates the n^2-n combinations for wrappedStablePairs
  ;

  StablePairWrapper.wrapPairsFromPool = function wrapPairsFromPool(stablePool) {
    var wrapperList = [];

    for (var i = 0; i < stablePool.tokenBalances.length; i++) {
      for (var j = 0; j < i; j++) {
        wrapperList.push(new StablePairWrapper(new TokenAmount(stablePool.tokens[i], stablePool.tokenBalances[i].toBigInt()), new TokenAmount(stablePool.tokens[j], stablePool.tokenBalances[j].toBigInt()), i, j));
      }
    }

    return wrapperList;
  };

  StablePairWrapper.wrapSinglePairFromPool = function wrapSinglePairFromPool(stablePool, i, j) {
    !(i !== j) ?  invariant(false, 'SAME INDEX')  : void 0;
    !(i < stablePool.tokenBalances.length || j < stablePool.tokenBalances.length) ?  invariant(false, 'INDEX OUT OF RANGE')  : void 0;
    return new StablePairWrapper(new TokenAmount(stablePool.tokens[i], stablePool.tokenBalances[i].toBigInt()), new TokenAmount(stablePool.tokens[j], stablePool.tokenBalances[j].toBigInt()), i, j);
  };

  _createClass(StablePairWrapper, [{
    key: "chainId",
    get: function get() {
      return this.token0.chainId;
    }
  }, {
    key: "token0",
    get: function get() {
      return this.tokenAmounts[0].token;
    }
  }, {
    key: "token1",
    get: function get() {
      return this.tokenAmounts[1].token;
    } // reserves cannot be this.tokenAmounts because
    // these are directly used for prices

  }, {
    key: "reserve0",
    get: function get() {
      return this.tokenAmounts[0];
    }
  }, {
    key: "reserve1",
    get: function get() {
      return this.tokenAmounts[1];
    }
  }]);

  return StablePairWrapper;
}();

var MAX_ITERATION = 256;
var A_PRECISION = /*#__PURE__*/ethers.BigNumber.from(100);
var FEE_DENOMINATOR = /*#__PURE__*/ethers.BigNumber.from(1e10);
var ONE$2 = /*#__PURE__*/ethers.BigNumber.from(1);
function _xp(balances, rates) {
  var result = [];

  for (var i = 0; i < balances.length; i++) {
    result.push(rates[i].mul(balances[i]));
  }

  return result;
}
function _getAPrecise(blockTimestamp, swapStorage) {
  if (blockTimestamp.gte(swapStorage.futureATime)) {
    return swapStorage.futureA;
  }

  if (swapStorage.futureA.gt(swapStorage.initialA)) {
    return swapStorage.initialA.add(swapStorage.futureA.sub(swapStorage.initialA).mul(blockTimestamp.sub(swapStorage.initialATime)).div(swapStorage.futureATime.sub(swapStorage.initialATime)));
  }

  return swapStorage.initialA.sub(swapStorage.initialA.sub(swapStorage.futureA).mul(blockTimestamp.sub(swapStorage.initialATime))).div(swapStorage.futureATime.sub(swapStorage.initialATime));
}
function _sumOf(x) {
  var sum = ethers.BigNumber.from(0);

  for (var i = 0; i < x.length; i++) {
    sum = sum.add(x[i]);
  }

  return sum;
}
function _distance(x, y) {
  return x.gt(y) ? x.sub(y) : y.sub(x);
}
/**
 * Calculate D for *NORMALIZED* balances of each tokens
 * @param xp normalized balances of token
 */

function _getD(xp, amp) {
  var nCoins = xp.length;

  var sum = _sumOf(xp);

  if (sum.eq(0)) {
    return ethers.BigNumber.from(0);
  }

  var Dprev = ethers.BigNumber.from(0);
  var D = sum;
  var Ann = amp.mul(nCoins);

  for (var i = 0; i < MAX_ITERATION; i++) {
    var D_P = D;

    for (var j = 0; j < xp.length; j++) {
      D_P = D_P.mul(D).div(xp[j].mul(nCoins));
    }

    Dprev = D;
    D = Ann.mul(sum).div(A_PRECISION).add(D_P.mul(nCoins)).mul(D).div(Ann.sub(A_PRECISION).mul(D).div(A_PRECISION).add(D_P.mul(nCoins + 1)));

    if (_distance(D, Dprev).lte(1)) {
      return D;
    }
  } // Convergence should occur in 4 loops or less. If this is reached, there may be something wrong
  return D;
}
function _getY(inIndex, outIndex, inBalance, // self, shoudl be replaced with swapStorage object
blockTimestamp, swapStorage, normalizedBalances) {
  !(inIndex != outIndex) ?  invariant(false, "sameToken")  : void 0;
  var nCoins = normalizedBalances.length;
  !(inIndex < nCoins && outIndex < nCoins) ?  invariant(false, "indexOutOfRange")  : void 0;

  var amp = _getAPrecise(blockTimestamp, swapStorage);

  var Ann = amp.mul(nCoins);

  var D = _getD(normalizedBalances, amp);

  var sum = ethers.BigNumber.from(0); // sum of new balances except output token

  var c = D;

  for (var i = 0; i < nCoins; i++) {
    if (i == outIndex) {
      continue;
    }

    var x = i == inIndex ? inBalance : normalizedBalances[i];
    sum = sum.add(x);
    c = c.mul(D).div(x.mul(nCoins));
  }

  c = c.mul(D.mul(A_PRECISION)).div(Ann.mul(nCoins));
  var b = sum.add(D.mul(A_PRECISION).div(Ann));
  var lastY = ethers.BigNumber.from(0);
  var y = D;

  for (var index = 0; index < MAX_ITERATION; index++) {
    lastY = y;
    y = y.mul(y).add(c).div(y.mul(2).add(b).sub(D));

    if (_distance(lastY, y).lte(1)) {
      return y;
    }
  }
  return ethers.BigNumber.from(0);
}
function calculateSwap(inIndex, outIndex, inAmount, // standard fields
balances, blockTimestamp, swapStorage) {
  var normalizedBalances = _xp(balances, swapStorage.tokenMultipliers);

  var newInBalance = normalizedBalances[inIndex].add(inAmount.mul(swapStorage.tokenMultipliers[inIndex]));

  var outBalance = _getY(inIndex, outIndex, newInBalance, blockTimestamp, swapStorage, normalizedBalances);

  var outAmount = normalizedBalances[outIndex].sub(outBalance).sub(ONE$2).div(swapStorage.tokenMultipliers[outIndex]);

  var _fee = swapStorage.fee.mul(outAmount).div(FEE_DENOMINATOR);

  return outAmount.sub(_fee);
}
function calculateSwapGivenOut(inIndex, outIndex, outAmount, // standard fields
balances, blockTimestamp, swapStorage) {
  var normalizedBalances = _xp(balances, swapStorage.tokenMultipliers);

  var _amountOutInclFee = outAmount.mul(FEE_DENOMINATOR).div(FEE_DENOMINATOR.sub(swapStorage.fee));

  var newOutBalance = normalizedBalances[outIndex].sub(_amountOutInclFee.mul(swapStorage.tokenMultipliers[outIndex]));

  var inBalance = _getY(outIndex, inIndex, newOutBalance, blockTimestamp, swapStorage, normalizedBalances);

  var inAmount = inBalance.sub(normalizedBalances[inIndex]).sub(ONE$2).div(swapStorage.tokenMultipliers[inIndex]).add(ONE$2);
  return inAmount;
} // function to calculate the amounts of stables from the amounts of LP

function _calculateRemoveLiquidity(amount, swapStorage, totalSupply, currentWithdrawFee, balances) {
  !amount.lte(totalSupply) ?  invariant(false, "Cannot exceed total supply")  : void 0;
  var feeAdjustedAmount = amount.mul(FEE_DENOMINATOR.sub(currentWithdrawFee)).div(FEE_DENOMINATOR);
  var amounts = [];

  for (var i = 0; i < swapStorage.tokenMultipliers.length; i++) {
    amounts.push(balances[i].mul(feeAdjustedAmount).div(totalSupply));
  }

  return amounts;
}

function _getYD(A, index, xp, D) {
  var nCoins = xp.length;
  !(index < nCoins) ?  invariant(false, "INDEX")  : void 0;
  var Ann = A.mul(nCoins);
  var c = D;
  var s = ethers.BigNumber.from(0);

  var _x = ethers.BigNumber.from(0);

  var yPrev = ethers.BigNumber.from(0);

  for (var i = 0; i < nCoins; i++) {
    if (i == index) {
      continue;
    }

    _x = xp[i];
    s = s.add(_x);
    c = c.mul(D).div(_x.mul(nCoins));
  }

  c = c.mul(D).mul(A_PRECISION).div(Ann.mul(nCoins));
  var b = s.add(D.mul(A_PRECISION).div(Ann));
  var y = D;

  for (var _i = 0; _i < MAX_ITERATION; _i++) {
    yPrev = y;
    y = y.mul(y).add(c).div(y.mul(2).add(b).sub(D));

    if (_distance(yPrev, y).lt(1)) {
      return y;
    }
  }
  return ethers.BigNumber.from(0);
}

function _feePerToken(swapStorage) {
  var nCoins = swapStorage.tokenMultipliers.length;
  return swapStorage.fee.mul(nCoins).div(4 * (nCoins - 1));
}

function _calculateRemoveLiquidityOneToken(swapStorage, tokenAmount, index, blockTimestamp, balances, totalSupply, currentWithdrawFee) {
  !(index < swapStorage.tokenMultipliers.length) ?  invariant(false, "indexOutOfRange")  : void 0;

  var amp = _getAPrecise(blockTimestamp, swapStorage);

  var xp = _xp(balances, swapStorage.tokenMultipliers);

  var D0 = _getD(xp, amp);

  var D1 = D0.sub(tokenAmount.mul(D0).div(totalSupply));

  var newY = _getYD(amp, index, xp, D1);

  var reducedXP = xp;

  var _fee = _feePerToken(swapStorage);

  for (var i = 0; i < swapStorage.tokenMultipliers.length; i++) {
    var expectedDx = ethers.BigNumber.from(0);

    if (i == index) {
      expectedDx = xp[i].mul(D1).div(D0).sub(newY);
    } else {
      expectedDx = xp[i].sub(xp[i].mul(D1).div(D0));
    }

    reducedXP[i] = reducedXP[i].sub(_fee.mul(expectedDx).div(FEE_DENOMINATOR));
  }

  var dy = reducedXP[index].sub(_getYD(amp, index, reducedXP, D1));
  dy = dy.sub(1).div(swapStorage.tokenMultipliers[index]);
  var fee = xp[index].sub(newY).div(swapStorage.tokenMultipliers[index]).sub(dy);
  dy = dy.mul(FEE_DENOMINATOR.sub(currentWithdrawFee)).div(FEE_DENOMINATOR);
  return {
    "dy": dy,
    "fee": fee
  };
}
/**
 * Estimate amount of LP token minted or burned at deposit or withdrawal
 * without taking fees into account
 */

function _calculateTokenAmount(swapStorage, amounts, deposit, balances, blockTimestamp, totalSupply) {
  var nCoins = swapStorage.tokenMultipliers.length;
  !(amounts.length == nCoins) ?  invariant(false, "invalidAmountsLength")  : void 0;

  var amp = _getAPrecise(blockTimestamp, swapStorage);

  var D0 = _getD(_xp(balances, swapStorage.tokenMultipliers), amp);

  var newBalances = balances;

  for (var i = 0; i < nCoins; i++) {
    if (deposit) {
      newBalances[i] = newBalances[i].add(amounts[i]);
    } else {
      newBalances[i] = newBalances[i].sub(amounts[i]);
    }
  }

  var D1 = _getD(_xp(newBalances, swapStorage.tokenMultipliers), amp);

  if (totalSupply.eq(0)) {
    return D1; // first depositor take it all
  }

  var diff = deposit ? D1.sub(D0) : D0.sub(D1);
  return diff.mul(totalSupply).div(D0);
}

var SwapStorage = /*#__PURE__*/function () {
  function SwapStorage(tokenMultipliers, fee, adminFee, initialA, futureA, initialATime, futureATime, lpAddress) {
    this.lpAddress = lpAddress;
    this.tokenMultipliers = tokenMultipliers;
    this.fee = fee;
    this.adminFee = adminFee;
    this.initialA = initialA;
    this.futureA = futureA;
    this.initialATime = initialATime;
    this.futureATime = futureATime;
  }

  SwapStorage.mock = function mock() {
    var dummy = ethers.BigNumber.from(0);
    return new SwapStorage([dummy], dummy, dummy, dummy, dummy, dummy, dummy, '');
  };

  return SwapStorage;
}();

var StableSwap = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "provider",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256[]",
				name: "tokenAmounts",
				type: "uint256[]"
			},
			{
				indexed: false,
				internalType: "uint256[]",
				name: "fees",
				type: "uint256[]"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "invariant",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "tokenSupply",
				type: "uint256"
			}
		],
		name: "AddLiquidity",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "token",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "CollectProtocolFee",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "newController",
				type: "address"
			}
		],
		name: "FeeControllerChanged",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "newController",
				type: "address"
			}
		],
		name: "FeeDistributorChanged",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "fee",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "adminFee",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "withdrawFee",
				type: "uint256"
			}
		],
		name: "NewFee",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "OwnershipTransferred",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "Paused",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "oldA",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "newA",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "initialTime",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "futureTime",
				type: "uint256"
			}
		],
		name: "RampA",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "provider",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256[]",
				name: "tokenAmounts",
				type: "uint256[]"
			},
			{
				indexed: false,
				internalType: "uint256[]",
				name: "fees",
				type: "uint256[]"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "tokenSupply",
				type: "uint256"
			}
		],
		name: "RemoveLiquidity",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "provider",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256[]",
				name: "tokenAmounts",
				type: "uint256[]"
			},
			{
				indexed: false,
				internalType: "uint256[]",
				name: "fees",
				type: "uint256[]"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "invariant",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "tokenSupply",
				type: "uint256"
			}
		],
		name: "RemoveLiquidityImbalance",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "provider",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "tokenIndex",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "tokenAmount",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "coinAmount",
				type: "uint256"
			}
		],
		name: "RemoveLiquidityOne",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "A",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "timestamp",
				type: "uint256"
			}
		],
		name: "StopRampA",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "buyer",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "soldId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "tokensSold",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "boughtId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "tokensBought",
				type: "uint256"
			}
		],
		name: "TokenExchange",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "Unpaused",
		type: "event"
	},
	{
		inputs: [
		],
		name: "MAX_A",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "MAX_ADMIN_FEE",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "MAX_A_CHANGE",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "MAX_SWAP_FEE",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "MAX_WITHDRAW_FEE",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "MIN_RAMP_TIME",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			},
			{
				internalType: "uint256",
				name: "minMintAmount",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "addLiquidity",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "calculateCurrentWithdrawFee",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			}
		],
		name: "calculateRemoveLiquidity",
		outputs: [
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "index",
				type: "uint8"
			}
		],
		name: "calculateRemoveLiquidityOneToken",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint8",
				name: "inIndex",
				type: "uint8"
			},
			{
				internalType: "uint8",
				name: "outIndex",
				type: "uint8"
			},
			{
				internalType: "uint256",
				name: "inAmount",
				type: "uint256"
			}
		],
		name: "calculateSwap",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "tokenIn",
				type: "address"
			},
			{
				internalType: "address",
				name: "tokenOut",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			}
		],
		name: "calculateSwapGivenIn",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "tokenIn",
				type: "address"
			},
			{
				internalType: "address",
				name: "tokenOut",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			}
		],
		name: "calculateSwapGivenOut",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			},
			{
				internalType: "bool",
				name: "deposit",
				type: "bool"
			}
		],
		name: "calculateTokenAmount",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "feeController",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "feeDistributor",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getA",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getAPrecise",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint8",
				name: "index",
				type: "uint8"
			}
		],
		name: "getAdminBalance",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getAdminBalances",
		outputs: [
			{
				internalType: "uint256[]",
				name: "adminBalances",
				type: "uint256[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getLpToken",
		outputs: [
			{
				internalType: "contract IERC20",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getNumberOfTokens",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint8",
				name: "index",
				type: "uint8"
			}
		],
		name: "getToken",
		outputs: [
			{
				internalType: "contract IERC20",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint8",
				name: "index",
				type: "uint8"
			}
		],
		name: "getTokenBalance",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getTokenBalances",
		outputs: [
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "token",
				type: "address"
			}
		],
		name: "getTokenIndex",
		outputs: [
			{
				internalType: "uint8",
				name: "index",
				type: "uint8"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getTokenPrecisionMultipliers",
		outputs: [
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getTokens",
		outputs: [
			{
				internalType: "contract IERC20[]",
				name: "",
				type: "address[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getVirtualPrice",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address[]",
				name: "_coins",
				type: "address[]"
			},
			{
				internalType: "uint8[]",
				name: "_decimals",
				type: "uint8[]"
			},
			{
				internalType: "string",
				name: "lpTokenName",
				type: "string"
			},
			{
				internalType: "string",
				name: "lpTokenSymbol",
				type: "string"
			},
			{
				internalType: "uint256",
				name: "_A",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "_fee",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "_adminFee",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "_withdrawFee",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "_feeDistributor",
				type: "address"
			}
		],
		name: "initialize",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "tokenIn",
				type: "address"
			},
			{
				internalType: "address",
				name: "tokenOut",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			}
		],
		name: "onSwap",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "tokenIn",
				type: "address"
			},
			{
				internalType: "address",
				name: "tokenOut",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amountIn",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountOutMin",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			}
		],
		name: "onSwapGivenIn",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "tokenIn",
				type: "address"
			},
			{
				internalType: "address",
				name: "tokenOut",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amountInMax",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			}
		],
		name: "onSwapGivenOut",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "owner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "pause",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "paused",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "futureA",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "futureATime",
				type: "uint256"
			}
		],
		name: "rampA",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "lpAmount",
				type: "uint256"
			},
			{
				internalType: "uint256[]",
				name: "minAmounts",
				type: "uint256[]"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "removeLiquidity",
		outputs: [
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			},
			{
				internalType: "uint256",
				name: "maxBurnAmount",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "removeLiquidityImbalance",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "lpAmount",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "index",
				type: "uint8"
			},
			{
				internalType: "uint256",
				name: "minAmount",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "removeLiquidityOneToken",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "renounceOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "newSwapFee",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "newAdminFee",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "newWithdrawFee",
				type: "uint256"
			}
		],
		name: "setFee",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_feeController",
				type: "address"
			}
		],
		name: "setFeeController",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_feeDistributor",
				type: "address"
			}
		],
		name: "setFeeDistributor",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "stopRampA",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint8",
				name: "fromIndex",
				type: "uint8"
			},
			{
				internalType: "uint8",
				name: "toIndex",
				type: "uint8"
			},
			{
				internalType: "uint256",
				name: "inAmount",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "minOutAmount",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "swap",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "swapStorage",
		outputs: [
			{
				internalType: "contract LPToken",
				name: "lpToken",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "fee",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "adminFee",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "initialA",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "futureA",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "initialATime",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "futureATime",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "defaultWithdrawFee",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "tokenIndexes",
		outputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "transferOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "unpause",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "transferAmount",
				type: "uint256"
			}
		],
		name: "updateUserWithdrawFee",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "withdrawAdminFee",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	}
];

/**
  * A class that contains relevant stablePool information
  * It is mainly designed to save the map between the indices
  * and actual tokens in the pool and access the swap with addresses
  * instead of the index
  */

var StablePool = /*#__PURE__*/function () {
  function StablePool(tokens, tokenBalances, _A, swapStorage, blockTimestamp, lpTotalSupply, currentWithdrawFee) {
    var _STABLE_POOL_LP_ADDRE;

    this.currentWithdrawFee = currentWithdrawFee;
    this.lpTotalSupply = lpTotalSupply;
    this.swapStorage = swapStorage;
    this.blockTimestamp = ethers.BigNumber.from(blockTimestamp);
    this.tokens = tokens;
    this.tokenBalances = tokenBalances;
    this._A = _A;
    this.liquidityToken = new Token(tokens[0].chainId, (_STABLE_POOL_LP_ADDRE = STABLE_POOL_LP_ADDRESS[tokens[0].chainId]) !== null && _STABLE_POOL_LP_ADDRE !== void 0 ? _STABLE_POOL_LP_ADDRE : '0x0000000000000000000000000000000000000001', 18, 'RequiemStable-LP', 'Requiem StableSwap LPs');

    for (var i = 0; i < Object.values(this.tokens).length; i++) {
      !(tokens[i].address != ethers.ethers.constants.AddressZero) ?  invariant(false, "invalidTokenAddress")  : void 0;
      !(tokens[i].decimals <= 18) ?  invariant(false, "invalidDecimals")  : void 0;
      !(tokens[i].chainId === tokens[0].chainId) ?  invariant(false, 'INVALID TOKENS')  : void 0;
    }
  }

  StablePool.getRouterAddress = function getRouterAddress(chainId) {
    return STABLE_POOL_ADDRESS[chainId];
  };

  StablePool.getLpAddress = function getLpAddress(chainId) {
    return STABLE_POOL_LP_ADDRESS[chainId];
  };

  StablePool.mock = function mock() {
    var dummy = ethers.BigNumber.from(0);
    return new StablePool({
      0: new Token(1, '0x0000000000000000000000000000000000000001', 6, 'Mock USDC', 'MUSDC')
    }, [dummy], dummy, SwapStorage.mock(), 0, dummy, dummy);
  };

  var _proto = StablePool.prototype;

  _proto.getAddressForRouter = function getAddressForRouter() {
    return STABLE_POOL_ADDRESS[this.tokens[0].chainId];
  }
  /**
   * Returns true if the token is either token0 or token1
   * @param token to check
   */
  ;

  _proto.involvesToken = function involvesToken(token) {
    var res = false;

    for (var i = 0; i < Object.keys(this.tokens).length; i++) {
       token.equals(this.tokens[i]);
    }

    return res;
  };

  // maps the index to the token in the stablePool
  _proto.tokenFromIndex = function tokenFromIndex(index) {
    return this.tokens[index];
  };

  _proto.indexFromToken = function indexFromToken(token) {
    for (var index = 0; index < Object.keys(this.tokens).length; index++) {
      if (token.equals(this.tokens[index])) {
        return index;
      }
    }

    throw new Error('token not in pool');
  };

  _proto.getBalances = function getBalances() {
    var _this = this;

    return Object.keys(this.tokens).map(function (_, index) {
      return _this.tokenBalances[index];
    });
  } // calculates the output amount usingn the input for the swableSwap
  // requires the view on a contract as manual calculation on the frontend would
  // be inefficient
  ;

  _proto.calculateSwapViaPing = function calculateSwapViaPing(inIndex, outIndex, inAmount, chainId, provider) {
    try {
      return Promise.resolve(new contracts.Contract(StablePool.getRouterAddress(chainId), new ethers.ethers.utils.Interface(StableSwap), provider).calculateSwap(inIndex, outIndex, inAmount));
    } catch (e) {
      return Promise.reject(e);
    }
  } // calculates the swap output amount without
  // pinging the blockchain for data
  ;

  _proto.calculateSwap = function calculateSwap$1(inIndex, outIndex, inAmount) {
    // if (this.getBalances()[inIndex].lte(inAmount)) // || inAmount.eq(ZERO))
    //   return ZERO
    var outAmount = calculateSwap(inIndex, outIndex, inAmount, this.getBalances(), this.blockTimestamp, this.swapStorage);

    return outAmount;
  } // calculates the swap output amount without
  // pinging the blockchain for data
  ;

  _proto.calculateSwapGivenOut = function calculateSwapGivenOut$1(inIndex, outIndex, outAmount) {
    // if (this.getBalances()[outIndex].lte(outAmount)) // || outAmount.eq(ZERO))
    //   return ZERO
    var inAmount = calculateSwapGivenOut(inIndex, outIndex, outAmount, this.getBalances(), this.blockTimestamp, this.swapStorage);

    return inAmount;
  };

  _proto.getOutputAmount = function getOutputAmount(inputAmount, outIndex) {
    var swap = this.calculateSwap(this.indexFromToken(inputAmount.token), outIndex, inputAmount.toBigNumber());
    return new TokenAmount(this.tokenFromIndex(outIndex), swap.toBigInt());
  };

  _proto.getInputAmount = function getInputAmount(outputAmount, inIndex) {
    var swap = this.calculateSwapGivenOut(inIndex, this.indexFromToken(outputAmount.token), outputAmount.toBigNumber());
    return new TokenAmount(this.tokenFromIndex(inIndex), swap.toBigInt());
  }
  /**
   * Returns the chain ID of the tokens in the pair.
   */
  ;

  _proto.token = function token(index) {
    return this.tokens[index];
  };

  _proto.reserveOf = function reserveOf(token) {
    !this.involvesToken(token) ?  invariant(false, 'TOKEN')  : void 0;

    for (var i = 0; i < Object.keys(this.tokens).length; i++) {
      if (token.equals(this.tokens[i])) return this.tokenBalances[i];
    }

    return ethers.BigNumber.from(0);
  };

  _proto.calculateRemoveLiquidity = function calculateRemoveLiquidity(amountLp) {
    return _calculateRemoveLiquidity(amountLp, this.swapStorage, this.lpTotalSupply, this.currentWithdrawFee, this.getBalances());
  };

  _proto.calculateRemoveLiquidityOneToken = function calculateRemoveLiquidityOneToken(amount, index) {
    return _calculateRemoveLiquidityOneToken(this.swapStorage, amount, index, this.blockTimestamp, this.getBalances(), this.lpTotalSupply, this.currentWithdrawFee);
  };

  _proto.getLiquidityAmount = function getLiquidityAmount(amounts, deposit) {
    return _calculateTokenAmount(this.swapStorage, amounts, deposit, this.getBalances(), this.blockTimestamp, this.lpTotalSupply);
  };

  _proto.getLiquidityValue = function getLiquidityValue(outIndex, userBalances) {
    var amount = ethers.BigNumber.from(0);

    for (var i = 0; i < userBalances.length; i++) {
      if (i !== outIndex) amount = amount.add(this.calculateSwap(i, outIndex, userBalances[i]));
    }

    amount = amount.add(userBalances[outIndex]);
    return new TokenAmount(this.tokens[outIndex], amount.toBigInt());
  };

  _proto.setSwapStorage = function setSwapStorage(swapStorage) {
    this.swapStorage = swapStorage;
  };

  _proto.setTokenBalances = function setTokenBalances(tokenBalances) {
    this.tokenBalances = tokenBalances;
  };

  _proto.setBlockTimestamp = function setBlockTimestamp(blockTimestamp) {
    this.blockTimestamp = blockTimestamp;
  };

  _proto.setLpTotalSupply = function setLpTotalSupply(totalSupply) {
    this.lpTotalSupply = totalSupply;
  };

  _proto.setBalanceValueByIndex = function setBalanceValueByIndex(index, newBalance) {
    this.tokenBalances[index] = newBalance;
  };

  _proto.setBalanceValue = function setBalanceValue(tokenAmount) {
    var newBalances = []; // safe way for replacement

    for (var i = 0; i < this.tokenBalances.length; i++) {
      newBalances.push(this.indexFromToken(tokenAmount.token) === i ? tokenAmount.toBigNumber() : this.tokenBalances[i]);
    }

    this.setTokenBalances(newBalances);
  };

  _proto.addBalanceValue = function addBalanceValue(tokenAmount) {
    var newBalances = []; // safe way for replacement

    for (var i = 0; i < this.tokenBalances.length; i++) {
      newBalances.push(this.indexFromToken(tokenAmount.token) === i ? this.tokenBalances[i].add(tokenAmount.toBigNumber()) : this.tokenBalances[i]);
    }

    this.setTokenBalances(newBalances);
  };

  _proto.subtractBalanceValue = function subtractBalanceValue(tokenAmount) {
    var newBalances = []; // safe way for replacement

    for (var i = 0; i < this.tokenBalances.length; i++) {
      newBalances.push(this.indexFromToken(tokenAmount.token) === i ? this.tokenBalances[i].sub(tokenAmount.toBigNumber()) : this.tokenBalances[i]);
    }

    this.setTokenBalances(newBalances);
  };

  _proto.clone = function clone() {
    return new StablePool(this.tokens, this.tokenBalances, this._A, this.swapStorage, this.blockTimestamp.toNumber(), this.lpTotalSupply, this.currentWithdrawFee);
  };

  _createClass(StablePool, [{
    key: "setCurrentWithdrawFee",
    set: function set(feeToSet) {
      this.currentWithdrawFee = feeToSet;
    }
  }, {
    key: "chainId",
    get: function get() {
      return this.tokens[0].chainId;
    }
  }]);

  return StablePool;
}();

// the first verion to include the stable pool for less friction

var RouteV3 = /*#__PURE__*/function () {
  function RouteV3(sources, stablePool, input, output) {
    !(sources.length > 0) ?  invariant(false, 'SOURCES')  : void 0;
    !sources.every(function (source) {
      return source.chainId === sources[0].chainId;
    }) ?  invariant(false, 'CHAIN_IDS')  : void 0;
    !(input instanceof Token && sources[0].involvesToken(input) || input === NETWORK_CCY[sources[0].chainId] && sources[0].involvesToken(WRAPPED_NETWORK_TOKENS[sources[0].chainId])) ?  invariant(false, 'INPUT')  : void 0;
    !(typeof output === 'undefined' || output instanceof Token && sources[sources.length - 1].involvesToken(output) || output === NETWORK_CCY[sources[0].chainId] && sources[sources.length - 1].involvesToken(WRAPPED_NETWORK_TOKENS[sources[0].chainId])) ?  invariant(false, 'OUTPUT')  : void 0;
    var path = [input instanceof Token ? input : WRAPPED_NETWORK_TOKENS[sources[0].chainId]];

    for (var _iterator = _createForOfIteratorHelperLoose(sources.entries()), _step; !(_step = _iterator()).done;) {
      var _step$value = _step.value,
          _i = _step$value[0],
          _source = _step$value[1];
      var _currentInput = path[_i];
      !(_currentInput.equals(_source.token0) || _currentInput.equals(_source.token1)) ?  invariant(false, 'PATH')  : void 0;

      var _output2 = _currentInput.equals(_source.token0) ? _source.token1 : _source.token0;

      path.push(_output2);
    }

    this.stablePool = stablePool;
    this.sources = sources;
    this.path = path;
    this.midPrice = Price.fromRouteV3(this);
    this.input = input;
    this.output = output !== null && output !== void 0 ? output : path[path.length - 1]; // generate new inputs for aggregator 

    var pathMatrix = [];
    var routerIds = [];
    var currentInput = this.path[0];
    var currentRouterId = -1;
    var lastRouterId = -1;

    for (var i = 0; i < sources.length; i++) {
      var source = sources[i];
      currentRouterId = sources[i] instanceof StablePairWrapper ? 0 : 1;
      !(currentInput.equals(source.token0) || currentInput.equals(source.token1)) ?  invariant(false, 'PATH')  : void 0;

      var _output = currentInput.equals(source.token0) ? source.token1 : source.token0;

      if (i === 0) {
        pathMatrix.push([currentInput, _output]);
        routerIds.push(source instanceof StablePairWrapper ? 0 : 1);
      } else {
        if (source instanceof StablePairWrapper) {
          // current item is stablePool
          pathMatrix.push([currentInput, _output]);
          routerIds.push(0);
        } else {
          // current item is a pair
          if (lastRouterId === 0) {
            pathMatrix.push([currentInput, _output]);
            routerIds.push(1);
          } else {
            pathMatrix[pathMatrix.length - 1].push(_output);
          }
        }
      }

      currentInput = _output;
      lastRouterId = currentRouterId;
    }

    this.pathMatrix = pathMatrix;
    this.routerIds = routerIds;
  }

  _createClass(RouteV3, [{
    key: "chainId",
    get: function get() {
      return this.sources[0].chainId;
    }
  }]);

  return RouteV3;
}();

/**
 * Returns the percent difference between the mid price and the execution price, i.e. price impact.
 * @param midPrice mid price before the trade
 * @param inputAmount the input amount of the trade
 * @param outputAmount the output amount of the trade
 */

function computePriceImpact$1(midPrice, inputAmount, outputAmount) {
  var exactQuote = midPrice.raw.multiply(inputAmount.raw); // calculate slippage := (exactQuote - outputAmount) / exactQuote

  var slippage = exactQuote.subtract(outputAmount.raw).divide(exactQuote);
  return new Percent(slippage.numerator, slippage.denominator);
} // comparator function that allows sorting trades by their output amounts, in decreasing order, and then input amounts
// in increasing order. i.e. the best trades have the most outputs for the least inputs and are sorted first


function inputOutputComparatorV3(a, b) {
  // must have same input and output token for comparison
  !currencyEquals(a.inputAmount.currency, b.inputAmount.currency) ?  invariant(false, 'INPUT_CURRENCY')  : void 0;
  !currencyEquals(a.outputAmount.currency, b.outputAmount.currency) ?  invariant(false, 'OUTPUT_CURRENCY')  : void 0;

  if (a.outputAmount.equalTo(b.outputAmount)) {
    if (a.inputAmount.equalTo(b.inputAmount)) {
      return 0;
    } // trade A requires less input than trade B, so A should come first


    if (a.inputAmount.lessThan(b.inputAmount)) {
      return -1;
    } else {
      return 1;
    }
  } else {
    // tradeA has less output than trade B, so should come second
    if (a.outputAmount.lessThan(b.outputAmount)) {
      return 1;
    } else {
      return -1;
    }
  }
} // extension of the input output comparator that also considers other dimensions of the trade in ranking them

function tradeComparatorV3(a, b) {
  var ioComp = inputOutputComparatorV3(a, b);

  if (ioComp !== 0) {
    return ioComp;
  } // consider lowest slippage next, since these are less likely to fail


  if (a.priceImpact.lessThan(b.priceImpact)) {
    return -1;
  } else if (a.priceImpact.greaterThan(b.priceImpact)) {
    return 1;
  } // finally consider the number of hops since each hop costs gas


  return a.route.path.length - b.route.path.length;
}
/**
 * Given a currency amount and a chain ID, returns the equivalent representation as the token amount.
 * In other words, if the currency is ETHER, returns the WETH token amount for the given chain. Otherwise, returns
 * the input currency amount.
 */

function wrappedAmount$1(currencyAmount, chainId) {
  if (currencyAmount instanceof TokenAmount) return currencyAmount;
  if (currencyAmount.currency === NETWORK_CCY[chainId]) return new TokenAmount(WRAPPED_NETWORK_TOKENS[chainId], currencyAmount.raw);
    invariant(false, 'CURRENCY')  ;
}

function wrappedCurrency$1(currency, chainId) {
  if (currency instanceof Token) return currency;
  if (currency === NETWORK_CCY[chainId]) return WRAPPED_NETWORK_TOKENS[chainId];
    invariant(false, 'CURRENCY')  ;
}
/**
 * Represents a trade executed against a list of pairs.
 * Does not account for slippage, i.e. trades that front run this trade and move the price.
 */


var TradeV3 = /*#__PURE__*/function () {
  function TradeV3(route, amount, tradeType) {
    var amounts = new Array(route.path.length);
    var nextSources = new Array(route.sources.length);
    var stablePool = route.stablePool.clone();

    if (tradeType === exports.TradeType.EXACT_INPUT) {
      !currencyEquals(amount.currency, route.input) ?  invariant(false, 'INPUT')  : void 0;
      amounts[0] = wrappedAmount$1(amount, route.chainId);

      for (var i = 0; i < route.path.length - 1; i++) {
        var source = route.sources[i];

        var _ref = source instanceof Pair ? source.getOutputAmount(amounts[i]) : source.getOutputAmount(amounts[i], stablePool),
            outputAmount = _ref[0],
            nextSource = _ref[1];

        amounts[i + 1] = outputAmount;
        nextSources[i] = nextSource;
      }
    } else {
      !currencyEquals(amount.currency, route.output) ?  invariant(false, 'OUTPUT')  : void 0;
      amounts[amounts.length - 1] = wrappedAmount$1(amount, route.chainId);

      for (var _i = route.path.length - 1; _i > 0; _i--) {
        var _source = route.sources[_i - 1];

        var _ref2 = _source instanceof Pair ? _source.getInputAmount(amounts[_i]) : _source.getInputAmount(amounts[_i], stablePool),
            inputAmount = _ref2[0],
            _nextSource = _ref2[1];

        amounts[_i - 1] = inputAmount;
        nextSources[_i - 1] = _nextSource;
      }
    }

    this.route = route;
    this.tradeType = tradeType;
    this.inputAmount = tradeType === exports.TradeType.EXACT_INPUT ? amount : route.input === NETWORK_CCY[route.chainId] ? CurrencyAmount.networkCCYAmount(route.chainId, amounts[0].raw) : amounts[0];
    this.outputAmount = tradeType === exports.TradeType.EXACT_OUTPUT ? amount : route.output === NETWORK_CCY[route.chainId] ? CurrencyAmount.networkCCYAmount(route.chainId, amounts[amounts.length - 1].raw) : amounts[amounts.length - 1];
    this.executionPrice = new Price(this.inputAmount.currency, this.outputAmount.currency, this.inputAmount.raw, this.outputAmount.raw);
    this.nextMidPrice = Price.fromRouteV3(new RouteV3(nextSources, stablePool.clone(), route.input));
    this.priceImpact = computePriceImpact$1(route.midPrice, this.inputAmount, this.outputAmount);
  }
  /**
   * Constructs an exact in trade with the given amount in and route
   * @param route route of the exact in trade
   * @param amountIn the amount being passed in
   */


  TradeV3.exactIn = function exactIn(route, amountIn) {
    return new TradeV3(route, amountIn, exports.TradeType.EXACT_INPUT);
  }
  /**
   * Constructs an exact out trade with the given amount out and route
   * @param route route of the exact out trade
   * @param amountOut the amount returned by the trade
   */
  ;

  TradeV3.exactOut = function exactOut(route, amountOut) {
    return new TradeV3(route, amountOut, exports.TradeType.EXACT_OUTPUT);
  }
  /**
   * Get the minimum amount that must be received from this trade for the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
   */
  ;

  var _proto = TradeV3.prototype;

  _proto.minimumAmountOut = function minimumAmountOut(slippageTolerance) {
    !!slippageTolerance.lessThan(ZERO) ?  invariant(false, 'SLIPPAGE_TOLERANCE')  : void 0;

    if (this.tradeType === exports.TradeType.EXACT_OUTPUT) {
      return this.outputAmount;
    } else {
      var slippageAdjustedAmountOut = new Fraction(ONE).add(slippageTolerance).invert().multiply(this.outputAmount.raw).quotient;
      return this.outputAmount instanceof TokenAmount ? new TokenAmount(this.outputAmount.token, slippageAdjustedAmountOut) : CurrencyAmount.networkCCYAmount(this.route.chainId, slippageAdjustedAmountOut);
    }
  }
  /**
   * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
   */
  ;

  _proto.maximumAmountIn = function maximumAmountIn(slippageTolerance) {
    !!slippageTolerance.lessThan(ZERO) ?  invariant(false, 'SLIPPAGE_TOLERANCE')  : void 0;

    if (this.tradeType === exports.TradeType.EXACT_INPUT) {
      return this.inputAmount;
    } else {
      var slippageAdjustedAmountIn = new Fraction(ONE).add(slippageTolerance).multiply(this.inputAmount.raw).quotient;
      return this.inputAmount instanceof TokenAmount ? new TokenAmount(this.inputAmount.token, slippageAdjustedAmountIn) : CurrencyAmount.networkCCYAmount(this.route.chainId, slippageAdjustedAmountIn);
    }
  }
  /**
   * Given a list of pairs, and a fixed amount in, returns the top `maxNumResults` trades that go from an input token
   * amount to an output token, making at most `maxHops` hops.
   * Note this does not consider aggregation, as routes are linear. It's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pairs the pairs to consider in finding the best trade
   * @param currencyAmountIn exact amount of input currency to spend
   * @param currencyOut the desired currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
   * @param currentPairs used in recursion; the current list of pairs
   * @param originalAmountIn used in recursion; the original value of the currencyAmountIn parameter
   * @param bestTrades used in recursion; the current list of best trades
   */
  ;

  TradeV3.bestTradeExactInIteration = function bestTradeExactInIteration(originalStablePool, stablePool, sources, currencyAmountIn, currencyOut, _temp, // used in recursion.
  currentSources, originalAmountIn, bestTrades) {
    var _ref3 = _temp === void 0 ? {} : _temp,
        _ref3$maxNumResults = _ref3.maxNumResults,
        maxNumResults = _ref3$maxNumResults === void 0 ? 3 : _ref3$maxNumResults,
        _ref3$maxHops = _ref3.maxHops,
        maxHops = _ref3$maxHops === void 0 ? 3 : _ref3$maxHops;

    if (currentSources === void 0) {
      currentSources = [];
    }

    if (originalAmountIn === void 0) {
      originalAmountIn = currencyAmountIn;
    }

    if (bestTrades === void 0) {
      bestTrades = [];
    }

    !(sources.length > 0) ?  invariant(false, 'PAIRS')  : void 0;
    !(maxHops > 0) ?  invariant(false, 'MAX_HOPS')  : void 0;
    !(originalAmountIn === currencyAmountIn || currentSources.length > 0) ?  invariant(false, 'INVALID_RECURSION')  : void 0;
    var chainId = currencyAmountIn instanceof TokenAmount ? currencyAmountIn.token.chainId : currencyOut instanceof Token ? currencyOut.chainId : undefined;
    !(chainId !== undefined) ?  invariant(false, 'CHAIN_ID')  : void 0; // create copy of stablePool object no not change the original one
    // const stablePoolForIteration = stablePool.clone()

    var amountIn = wrappedAmount$1(currencyAmountIn, chainId);
    var tokenOut = wrappedCurrency$1(currencyOut, chainId);

    if ( // check if it can be only a single stable swap trade
    currencyAmountIn instanceof TokenAmount && currencyOut instanceof Token && Object.values(stablePool.tokens).includes(currencyAmountIn.token) && Object.values(stablePool.tokens).includes(currencyOut)) {
      var source = StablePairWrapper.wrapSinglePairFromPool(stablePool, stablePool.indexFromToken(currencyAmountIn.token), stablePool.indexFromToken(currencyOut)); // write pricings into the pool

      source.getOutputAmount(currencyAmountIn, stablePool);
      var stableTrade = new TradeV3(new RouteV3([source], originalStablePool, currencyAmountIn.token, currencyOut), currencyAmountIn, exports.TradeType.EXACT_INPUT);
      return [stableTrade];
    }

    for (var i = 0; i < sources.length; i++) {
      var _source2 = sources[i];
      if (!_source2.token0.equals(amountIn.token) && !_source2.token1.equals(amountIn.token)) continue;
      if (_source2.reserve0.equalTo(ZERO) || _source2.reserve1.equalTo(ZERO)) continue;
      var amountOut = void 0;

      try {
        ;

        var _ref4 = _source2 instanceof Pair ? _source2.getOutputAmount(amountIn) : _source2.getOutputAmount(amountIn, stablePool);

        amountOut = _ref4[0];
      } catch (error) {
        // input too low
        if (error.isInsufficientInputAmountError) {
          continue;
        }

        throw error;
      } // we have arrived at the output token, so this is the final trade of one of the paths


      if (amountOut.token.equals(tokenOut)) {
        sortedInsert(bestTrades, new TradeV3(new RouteV3([].concat(currentSources, [_source2]), originalStablePool, originalAmountIn.currency, currencyOut), originalAmountIn, exports.TradeType.EXACT_INPUT), maxNumResults, tradeComparatorV3);
      } else if (maxHops > 1 && sources.length > 1) {
        var sourcesExcludingThisSource = sources.slice(0, i).concat(sources.slice(i + 1, sources.length)); // otherwise, consider all the other paths that lead from this token as long as we have not exceeded maxHops

        TradeV3.bestTradeExactInIteration(originalStablePool, stablePool, sourcesExcludingThisSource, amountOut, currencyOut, {
          maxNumResults: maxNumResults,
          maxHops: maxHops - 1
        }, [].concat(currentSources, [_source2]), originalAmountIn, bestTrades);
      }
    }

    return bestTrades;
  }
  /**
   * similar to the above method but instead targets a fixed output amount
   * given a list of pairs, and a fixed amount out, returns the top `maxNumResults` trades that go from an input token
   * to an output token amount, making at most `maxHops` hops
   * note this does not consider aggregation, as routes are linear. it's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param stablePool the stalePool used for the iteration - it will undergo changes
   * @param sources the pairs / wrapped pairs to consider in finding the best trade
   * @param currencyIn the currency to spend
   * @param currencyAmountOut the exact amount of currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
   * @param currentSources used in recursion; the current list of pairs
   * @param originalAmountOut used in recursion; the original value of the currencyAmountOut parameter
   * @param bestTrades used in recursion; the current list of best trades
   */
  ;

  TradeV3.bestTradeExactOutIteration = function bestTradeExactOutIteration(originalStablePool, stablePool, sources, currencyIn, currencyAmountOut, _temp2, // used in recursion.
  currentSources, originalAmountOut, bestTrades) {
    var _ref5 = _temp2 === void 0 ? {} : _temp2,
        _ref5$maxNumResults = _ref5.maxNumResults,
        maxNumResults = _ref5$maxNumResults === void 0 ? 3 : _ref5$maxNumResults,
        _ref5$maxHops = _ref5.maxHops,
        maxHops = _ref5$maxHops === void 0 ? 3 : _ref5$maxHops;

    if (currentSources === void 0) {
      currentSources = [];
    }

    if (originalAmountOut === void 0) {
      originalAmountOut = currencyAmountOut;
    }

    if (bestTrades === void 0) {
      bestTrades = [];
    }

    !(sources.length > 0) ?  invariant(false, 'PAIRS')  : void 0;
    !(maxHops > 0) ?  invariant(false, 'MAX_HOPS')  : void 0;
    !(originalAmountOut === currencyAmountOut || currentSources.length > 0) ?  invariant(false, 'INVALID_RECURSION')  : void 0;
    var chainId = currencyAmountOut instanceof TokenAmount ? currencyAmountOut.token.chainId : currencyIn instanceof Token ? currencyIn.chainId : undefined;
    !(chainId !== undefined) ?  invariant(false, 'CHAIN_ID')  : void 0; // create copy of stablePool object
    // const stablePoolForIteration = stablePool.clone()

    var amountOut = wrappedAmount$1(currencyAmountOut, chainId);
    var tokenIn = wrappedCurrency$1(currencyIn, chainId);

    if ( // check ifit can be only a single stable swap trade
    currencyAmountOut instanceof TokenAmount && currencyIn instanceof Token && Object.values(stablePool.tokens).includes(currencyAmountOut.token) && Object.values(stablePool.tokens).includes(currencyIn)) {
      var source = StablePairWrapper.wrapSinglePairFromPool(stablePool, stablePool.indexFromToken(currencyAmountOut.token), stablePool.indexFromToken(currencyIn)); // return value does not matter, we just need the stablePool pricing to be stored in the pair

      source.getInputAmount(amountOut, stablePool);
      var stableTrade = new TradeV3(new RouteV3([source], originalStablePool, currencyIn, currencyAmountOut.token), currencyAmountOut, exports.TradeType.EXACT_OUTPUT);
      return [stableTrade];
    }

    for (var i = 0; i < sources.length; i++) {
      var _source3 = sources[i]; // source irrelevant

      if (!_source3.token0.equals(amountOut.token) && !_source3.token1.equals(amountOut.token)) continue;
      if (_source3.reserve0.equalTo(ZERO) || _source3.reserve1.equalTo(ZERO)) continue;
      var amountIn = void 0;

      try {
        ;

        var _ref6 = _source3 instanceof Pair ? _source3.getInputAmount(amountOut) : _source3.getInputAmount(amountOut, stablePool);

        amountIn = _ref6[0];
      } catch (error) {
        // not enough liquidity in this source
        if (error.isInsufficientReservesError) {
          continue;
        }

        throw error;
      } // we have arrived at the input token, so this is the first trade of one of the paths


      if (amountIn.token.equals(tokenIn)) {
        sortedInsert(bestTrades, new TradeV3(new RouteV3([_source3].concat(currentSources), originalStablePool, currencyIn, originalAmountOut.currency), originalAmountOut, exports.TradeType.EXACT_OUTPUT), maxNumResults, tradeComparatorV3);
      } else if (maxHops > 1 && sources.length > 1) {
        var sourcesExcludingThisSource = sources.slice(0, i).concat(sources.slice(i + 1, sources.length)); // otherwise, consider all the other paths that arrive at this token as long as we have not exceeded maxHops

        TradeV3.bestTradeExactOutIteration(originalStablePool, stablePool, sourcesExcludingThisSource, currencyIn, amountIn, {
          maxNumResults: maxNumResults,
          maxHops: maxHops - 1
        }, [_source3].concat(currentSources), originalAmountOut, bestTrades);
      }
    }

    return bestTrades;
  };

  TradeV3.bestTradeExactOut = function bestTradeExactOut(stablePool, sources, currencyIn, currencyAmountOut, _temp3) {
    var _ref7 = _temp3 === void 0 ? {} : _temp3,
        _ref7$maxNumResults = _ref7.maxNumResults,
        maxNumResults = _ref7$maxNumResults === void 0 ? 3 : _ref7$maxNumResults,
        _ref7$maxHops = _ref7.maxHops,
        maxHops = _ref7$maxHops === void 0 ? 3 : _ref7$maxHops;

    return this.bestTradeExactOutIteration(stablePool, stablePool.clone(), sources, currencyIn, currencyAmountOut, {
      maxNumResults: maxNumResults,
      maxHops: maxHops
    }, [], currencyAmountOut, []);
  };

  TradeV3.bestTradeExactIn = function bestTradeExactIn(stablePool, sources, currencyAmountIn, currencyOut, _temp4) {
    var _ref8 = _temp4 === void 0 ? {} : _temp4,
        _ref8$maxNumResults = _ref8.maxNumResults,
        maxNumResults = _ref8$maxNumResults === void 0 ? 3 : _ref8$maxNumResults,
        _ref8$maxHops = _ref8.maxHops,
        maxHops = _ref8$maxHops === void 0 ? 3 : _ref8$maxHops;

    return this.bestTradeExactInIteration(stablePool, stablePool.clone(), sources, currencyAmountIn, currencyOut, {
      maxNumResults: maxNumResults,
      maxHops: maxHops
    }, [], currencyAmountIn, []);
  };

  return TradeV3;
}();

// the first verion to include the stable pool for less friction

var RouteV4 = /*#__PURE__*/function () {
  function RouteV4(pools, stablePool, input, output) {
    !(pools.length > 0) ?  invariant(false, 'poolS')  : void 0;
    !pools.every(function (pool) {
      return pool.chainId === pools[0].chainId;
    }) ?  invariant(false, 'CHAIN_IDS')  : void 0;
    !(input instanceof Token && pools[0].involvesToken(input) || input === NETWORK_CCY[pools[0].chainId] && pools[0].involvesToken(WRAPPED_NETWORK_TOKENS[pools[0].chainId])) ?  invariant(false, 'INPUT')  : void 0;
    !(typeof output === 'undefined' || output instanceof Token && pools[pools.length - 1].involvesToken(output) || output === NETWORK_CCY[pools[0].chainId] && pools[pools.length - 1].involvesToken(WRAPPED_NETWORK_TOKENS[pools[0].chainId])) ?  invariant(false, 'OUTPUT')  : void 0;
    var path = [input instanceof Token ? input : WRAPPED_NETWORK_TOKENS[pools[0].chainId]];

    for (var _iterator = _createForOfIteratorHelperLoose(pools.entries()), _step; !(_step = _iterator()).done;) {
      var _step$value = _step.value,
          i = _step$value[0],
          pool = _step$value[1];
      var currentInput = path[i];
      !(currentInput.equals(pool.token0) || currentInput.equals(pool.token1)) ?  invariant(false, 'PATH')  : void 0;

      var _output = currentInput.equals(pool.token0) ? pool.token1 : pool.token0;

      path.push(_output);
    }

    this.stablePool = stablePool;
    this.pools = pools;
    this.path = path;
    this.midPrice = Price.fromRouteV4(this);
    this.input = input;
    this.output = output !== null && output !== void 0 ? output : path[path.length - 1];
  }

  _createClass(RouteV4, [{
    key: "chainId",
    get: function get() {
      return this.pools[0].chainId;
    }
  }]);

  return RouteV4;
}();

/**
 * Returns the percent difference between the mid price and the execution price, i.e. price impact.
 * @param midPrice mid price before the trade
 * @param inputAmount the input amount of the trade
 * @param outputAmount the output amount of the trade
 */

function computePriceImpact$2(midPrice, inputAmount, outputAmount) {
  var exactQuote = midPrice.raw.multiply(inputAmount.raw); // calculate slippage := (exactQuote - outputAmount) / exactQuote

  var slippage = exactQuote.subtract(outputAmount.raw).divide(exactQuote);
  return new Percent(slippage.numerator, slippage.denominator);
} // function computePriceImpactWeightedPair(pair: WeightedPair, inputAmount: CurrencyAmount, outputAmount: CurrencyAmount): Percent {
//   const artificialMidPrice = new Price(
//     inputAmount.currency,
//     outputAmount.currency,
//     pair.reserveOf(wrappedCurrency(inputAmount.currency, pair.chainId)).raw,
//     pair.reserveOf(wrappedCurrency(outputAmount.currency, pair.chainId)).raw)
//   const exactQuote = artificialMidPrice.raw.multiply(inputAmount.raw)
//   // calculate slippage := (exactQuote - outputAmount) / exactQuote
//   const slippage = exactQuote.subtract(outputAmount.raw).divide(exactQuote)
//   return new Percent(slippage.numerator, slippage.denominator)
// }
// comparator function that allows sorting trades by their output amounts, in decreasing order, and then input amounts
// in increasing order. i.e. the best trades have the most outputs for the least inputs and are sorted first


function inputOutputComparatorV4(a, b) {
  // must have same input and output token for comparison
  !currencyEquals(a.inputAmount.currency, b.inputAmount.currency) ?  invariant(false, 'INPUT_CURRENCY')  : void 0;
  !currencyEquals(a.outputAmount.currency, b.outputAmount.currency) ?  invariant(false, 'OUTPUT_CURRENCY')  : void 0;

  if (a.outputAmount.equalTo(b.outputAmount)) {
    if (a.inputAmount.equalTo(b.inputAmount)) {
      return 0;
    } // trade A requires less input than trade B, so A should come first


    if (a.inputAmount.lessThan(b.inputAmount)) {
      return -1;
    } else {
      return 1;
    }
  } else {
    // tradeA has less output than trade B, so should come second
    if (a.outputAmount.lessThan(b.outputAmount)) {
      return 1;
    } else {
      return -1;
    }
  }
} // extension of the input output comparator that also considers other dimensions of the trade in ranking them

function tradeComparatorV4(a, b) {
  var ioComp = inputOutputComparatorV4(a, b);

  if (ioComp !== 0) {
    return ioComp;
  } // consider lowest slippage next, since these are less likely to fail


  if (a.priceImpact.lessThan(b.priceImpact)) {
    return -1;
  } else if (a.priceImpact.greaterThan(b.priceImpact)) {
    return 1;
  } // finally consider the number of hops since each hop costs gas


  return a.route.path.length - b.route.path.length;
}
/**
 * Given a currency amount and a chain ID, returns the equivalent representation as the token amount.
 * In other words, if the currency is ETHER, returns the WETH token amount for the given chain. Otherwise, returns
 * the input currency amount.
 */

function wrappedAmount$2(currencyAmount, chainId) {
  if (currencyAmount instanceof TokenAmount) return currencyAmount;
  if (currencyAmount.currency === NETWORK_CCY[chainId]) return new TokenAmount(WRAPPED_NETWORK_TOKENS[chainId], currencyAmount.raw);
    invariant(false, 'CURRENCY')  ;
}

function wrappedCurrency$2(currency, chainId) {
  if (currency instanceof Token) return currency;
  if (currency === NETWORK_CCY[chainId]) return WRAPPED_NETWORK_TOKENS[chainId];
    invariant(false, 'CURRENCY')  ;
}
/**
 * Represents a trade executed against a list of pairs.
 * Does not account for slippage, i.e. trades that front run this trade and move the price.
 */


var TradeV4 = /*#__PURE__*/function () {
  function TradeV4(route, amount, tradeType) {
    var amounts = new Array(route.path.length);
    var nextpools = new Array(route.pools.length);
    var stablePool = route.stablePool.clone();

    if (tradeType === exports.TradeType.EXACT_INPUT) {
      !currencyEquals(amount.currency, route.input) ?  invariant(false, 'INPUT')  : void 0;
      amounts[0] = wrappedAmount$2(amount, route.chainId);

      for (var i = 0; i < route.path.length - 1; i++) {
        var pool = route.pools[i];
        var outputAmount = void 0;
        var nextpool = void 0;

        if (pool instanceof Pair) {
          var _pool$getOutputAmount = pool.getOutputAmount(amounts[i]);

          outputAmount = _pool$getOutputAmount[0];
          nextpool = _pool$getOutputAmount[1];
        } else if (pool instanceof WeightedPair) {
          var _pool$clone$getOutput = pool.clone().getOutputAmount(amounts[i]);

          outputAmount = _pool$clone$getOutput[0];
          nextpool = _pool$clone$getOutput[1];
        } else {
          var _pool$getOutputAmount2 = pool.getOutputAmount(amounts[i], stablePool);

          outputAmount = _pool$getOutputAmount2[0];
          nextpool = _pool$getOutputAmount2[1];
        } // const [outputAmount, nextpool] = pool instanceof Pair || pool instanceof WeightedPair ?
        //   pool.getOutputAmount(amounts[i]) :
        //   pool.getOutputAmount(amounts[i], stablePool)


        amounts[i + 1] = outputAmount;
        nextpools[i] = nextpool;
      }
    } else {
      !currencyEquals(amount.currency, route.output) ?  invariant(false, 'OUTPUT')  : void 0;
      amounts[amounts.length - 1] = wrappedAmount$2(amount, route.chainId);

      for (var _i = route.path.length - 1; _i > 0; _i--) {
        var _pool = route.pools[_i - 1];
        var inputAmount = void 0;

        var _nextpool = void 0;

        if (_pool instanceof Pair) {
          var _pool$getInputAmount = _pool.getInputAmount(amounts[_i]);

          inputAmount = _pool$getInputAmount[0];
          _nextpool = _pool$getInputAmount[1];
        } else if (_pool instanceof WeightedPair) {
          var _pool$clone$getInputA = _pool.clone().getInputAmount(amounts[_i]);

          inputAmount = _pool$clone$getInputA[0];
          _nextpool = _pool$clone$getInputA[1];
        } else {
          var _pool$getInputAmount2 = _pool.getInputAmount(amounts[_i], stablePool);

          inputAmount = _pool$getInputAmount2[0];
          _nextpool = _pool$getInputAmount2[1];
        } // const [inputAmount, nextpool] = pool instanceof Pair || pool instanceof WeightedPair ?
        //   pool.getInputAmount(amounts[i]) :
        //   pool.getInputAmount(amounts[i], stablePool)


        amounts[_i - 1] = inputAmount;
        nextpools[_i - 1] = _nextpool;
      }
    }

    this.route = route;
    this.tradeType = tradeType;
    this.inputAmount = tradeType === exports.TradeType.EXACT_INPUT ? amount : route.input === NETWORK_CCY[route.chainId] ? CurrencyAmount.networkCCYAmount(route.chainId, amounts[0].raw) : amounts[0];
    this.outputAmount = tradeType === exports.TradeType.EXACT_OUTPUT ? amount : route.output === NETWORK_CCY[route.chainId] ? CurrencyAmount.networkCCYAmount(route.chainId, amounts[amounts.length - 1].raw) : amounts[amounts.length - 1];
    this.executionPrice = new Price(this.inputAmount.currency, this.outputAmount.currency, this.inputAmount.raw, this.outputAmount.raw);
    this.nextMidPrice = Price.fromRouteV4(new RouteV4(nextpools, stablePool.clone(), route.input));
    this.priceImpact = computePriceImpact$2(route.midPrice, this.inputAmount, this.outputAmount); //   this.route.pools[this.route.pools.length - 1] instanceof WeightedPair
    //     ? computePriceImpactWeightedPair((this.route.pools[this.route.pools.length - 1] as WeightedPair).clone(), this.inputAmount, this.outputAmount)
    //     : computePriceImpact(route.midPrice, this.inputAmount, this.outputAmount)
  }
  /**
   * Constructs an exact in trade with the given amount in and route
   * @param route route of the exact in trade
   * @param amountIn the amount being passed in
   */


  TradeV4.exactIn = function exactIn(route, amountIn) {
    return new TradeV4(route, amountIn, exports.TradeType.EXACT_INPUT);
  }
  /**
   * Constructs an exact out trade with the given amount out and route
   * @param route route of the exact out trade
   * @param amountOut the amount returned by the trade
   */
  ;

  TradeV4.exactOut = function exactOut(route, amountOut) {
    return new TradeV4(route, amountOut, exports.TradeType.EXACT_OUTPUT);
  }
  /**
   * Get the minimum amount that must be received from this trade for the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
   */
  ;

  var _proto = TradeV4.prototype;

  _proto.minimumAmountOut = function minimumAmountOut(slippageTolerance) {
    !!slippageTolerance.lessThan(ZERO) ?  invariant(false, 'SLIPPAGE_TOLERANCE')  : void 0;

    if (this.tradeType === exports.TradeType.EXACT_OUTPUT) {
      return this.outputAmount;
    } else {
      var slippageAdjustedAmountOut = new Fraction(ONE).add(slippageTolerance).invert().multiply(this.outputAmount.raw).quotient;
      return this.outputAmount instanceof TokenAmount ? new TokenAmount(this.outputAmount.token, slippageAdjustedAmountOut) : CurrencyAmount.networkCCYAmount(this.route.chainId, slippageAdjustedAmountOut);
    }
  }
  /**
   * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
   */
  ;

  _proto.maximumAmountIn = function maximumAmountIn(slippageTolerance) {
    !!slippageTolerance.lessThan(ZERO) ?  invariant(false, 'SLIPPAGE_TOLERANCE')  : void 0;

    if (this.tradeType === exports.TradeType.EXACT_INPUT) {
      return this.inputAmount;
    } else {
      var slippageAdjustedAmountIn = new Fraction(ONE).add(slippageTolerance).multiply(this.inputAmount.raw).quotient;
      return this.inputAmount instanceof TokenAmount ? new TokenAmount(this.inputAmount.token, slippageAdjustedAmountIn) : CurrencyAmount.networkCCYAmount(this.route.chainId, slippageAdjustedAmountIn);
    }
  }
  /**
   * Given a list of pairs, and a fixed amount in, returns the top `maxNumResults` trades that go from an input token
   * amount to an output token, making at most `maxHops` hops.
   * Note this does not consider aggregation, as routes are linear. It's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param pairs the pairs to consider in finding the best trade
   * @param currencyAmountIn exact amount of input currency to spend
   * @param currencyOut the desired currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
   * @param currentPairs used in recursion; the current list of pairs
   * @param originalAmountIn used in recursion; the original value of the currencyAmountIn parameter
   * @param bestTrades used in recursion; the current list of best trades
   */
  ;

  TradeV4.bestTradeExactInIteration = function bestTradeExactInIteration(originalStablePool, stablePool, pools, currencyAmountIn, currencyOut, _temp, // used in recursion.
  currentpools, originalAmountIn, bestTrades) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$maxNumResults = _ref.maxNumResults,
        maxNumResults = _ref$maxNumResults === void 0 ? 3 : _ref$maxNumResults,
        _ref$maxHops = _ref.maxHops,
        maxHops = _ref$maxHops === void 0 ? 3 : _ref$maxHops;

    if (currentpools === void 0) {
      currentpools = [];
    }

    if (originalAmountIn === void 0) {
      originalAmountIn = currencyAmountIn;
    }

    if (bestTrades === void 0) {
      bestTrades = [];
    }

    !(pools.length > 0) ?  invariant(false, 'PAIRS')  : void 0;
    !(maxHops > 0) ?  invariant(false, 'MAX_HOPS')  : void 0;
    !(originalAmountIn === currencyAmountIn || currentpools.length > 0) ?  invariant(false, 'INVALID_RECURSION')  : void 0;
    var chainId = currencyAmountIn instanceof TokenAmount ? currencyAmountIn.token.chainId : currencyOut instanceof Token ? currencyOut.chainId : undefined;
    !(chainId !== undefined) ?  invariant(false, 'CHAIN_ID')  : void 0; // create copy of stablePool object no not change the original one
    // const stablePoolForIteration = stablePool.clone()

    var amountIn = wrappedAmount$2(currencyAmountIn, chainId);
    var tokenOut = wrappedCurrency$2(currencyOut, chainId);

    if ( // check if it can be only a single stable swap trade
    currencyAmountIn instanceof TokenAmount && currencyOut instanceof Token && Object.values(stablePool.tokens).includes(currencyAmountIn.token) && Object.values(stablePool.tokens).includes(currencyOut)) {
      var pool = StablePairWrapper.wrapSinglePairFromPool(stablePool, stablePool.indexFromToken(currencyAmountIn.token), stablePool.indexFromToken(currencyOut)); // write pricings into the pool

      pool.getOutputAmount(currencyAmountIn, stablePool);
      var stableTrade = new TradeV4(new RouteV4([pool], originalStablePool, currencyAmountIn.token, currencyOut), currencyAmountIn, exports.TradeType.EXACT_INPUT);
      return [stableTrade];
    }

    for (var i = 0; i < pools.length; i++) {
      var _pool2 = pools[i];
      if (!_pool2.token0.equals(amountIn.token) && !_pool2.token1.equals(amountIn.token)) continue;
      if (_pool2.reserve0.equalTo(ZERO) || _pool2.reserve1.equalTo(ZERO)) continue;
      var amountOut = void 0; // if( pool instanceof WeightedPair)  {console.log("out": pool.getInputAmount(amountOut) }

      try {
        if (_pool2.type === exports.PoolType.Pair) {
          ;

          var _pool2$getOutputAmoun = _pool2.getOutputAmount(amountIn);

          amountOut = _pool2$getOutputAmoun[0];
        } else if (_pool2.type === exports.PoolType.WeightedPair) {
          ;

          var _pool2$clone$getOutpu = _pool2.clone().getOutputAmount(amountIn);

          amountOut = _pool2$clone$getOutpu[0];
        } else {
          var _pool2$getOutputAmoun2 = _pool2.getOutputAmount(amountIn, stablePool);

          amountOut = _pool2$getOutputAmoun2[0];
        } // ;[amountOut] = pool instanceof Pair || pool instanceof WeightedPair ? pool.getOutputAmount(amountIn) : pool.getOutputAmount(amountIn, stablePool)

      } catch (error) {
        // input too low
        if (error.isInsufficientInputAmountError) {
          continue;
        }

        throw error;
      } // we have arrived at the output token, so this is the final trade of one of the paths


      if (amountOut.token.equals(tokenOut)) {
        sortedInsert(bestTrades, new TradeV4(new RouteV4([].concat(currentpools, [_pool2]), originalStablePool, originalAmountIn.currency, currencyOut), originalAmountIn, exports.TradeType.EXACT_INPUT), maxNumResults, tradeComparatorV4);
      } else if (maxHops > 1 && pools.length > 1) {
        var poolsExcludingThispool = pools.slice(0, i).concat(pools.slice(i + 1, pools.length)); // otherwise, consider all the other paths that lead from this token as long as we have not exceeded maxHops

        TradeV4.bestTradeExactInIteration(originalStablePool, stablePool, poolsExcludingThispool, amountOut, currencyOut, {
          maxNumResults: maxNumResults,
          maxHops: maxHops - 1
        }, [].concat(currentpools, [_pool2]), originalAmountIn, bestTrades);
      }
    }

    return bestTrades;
  }
  /**
   * similar to the above method but instead targets a fixed output amount
   * given a list of pairs, and a fixed amount out, returns the top `maxNumResults` trades that go from an input token
   * to an output token amount, making at most `maxHops` hops
   * note this does not consider aggregation, as routes are linear. it's possible a better route exists by splitting
   * the amount in among multiple routes.
   * @param stablePool the stalePool used for the iteration - it will undergo changes
   * @param pools the pairs / wrapped pairs to consider in finding the best trade
   * @param currencyIn the currency to spend
   * @param currencyAmountOut the exact amount of currency out
   * @param maxNumResults maximum number of results to return
   * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
   * @param currentpools used in recursion; the current list of pairs
   * @param originalAmountOut used in recursion; the original value of the currencyAmountOut parameter
   * @param bestTrades used in recursion; the current list of best trades
   */
  ;

  TradeV4.bestTradeExactOutIteration = function bestTradeExactOutIteration(originalStablePool, stablePool, pools, currencyIn, currencyAmountOut, _temp2, // used in recursion.
  currentpools, originalAmountOut, bestTrades) {
    var _ref2 = _temp2 === void 0 ? {} : _temp2,
        _ref2$maxNumResults = _ref2.maxNumResults,
        maxNumResults = _ref2$maxNumResults === void 0 ? 3 : _ref2$maxNumResults,
        _ref2$maxHops = _ref2.maxHops,
        maxHops = _ref2$maxHops === void 0 ? 3 : _ref2$maxHops;

    if (currentpools === void 0) {
      currentpools = [];
    }

    if (originalAmountOut === void 0) {
      originalAmountOut = currencyAmountOut;
    }

    if (bestTrades === void 0) {
      bestTrades = [];
    }

    !(pools.length > 0) ?  invariant(false, 'PAIRS')  : void 0;
    !(maxHops > 0) ?  invariant(false, 'MAX_HOPS')  : void 0;
    !(originalAmountOut === currencyAmountOut || currentpools.length > 0) ?  invariant(false, 'INVALID_RECURSION')  : void 0;
    var chainId = currencyAmountOut instanceof TokenAmount ? currencyAmountOut.token.chainId : currencyIn instanceof Token ? currencyIn.chainId : undefined;
    !(chainId !== undefined) ?  invariant(false, 'CHAIN_ID')  : void 0; // create copy of stablePool object
    // const stablePoolForIteration = stablePool.clone()

    var amountOut = wrappedAmount$2(currencyAmountOut, chainId);
    var tokenIn = wrappedCurrency$2(currencyIn, chainId);

    if ( // check if it can be only a single stable swap trade
    currencyAmountOut instanceof TokenAmount && currencyIn instanceof Token && Object.values(stablePool.tokens).includes(currencyAmountOut.token) && Object.values(stablePool.tokens).includes(currencyIn)) {
      var pool = StablePairWrapper.wrapSinglePairFromPool(stablePool, stablePool.indexFromToken(currencyAmountOut.token), stablePool.indexFromToken(currencyIn)); // return value does not matter, we just need the stablePool pricing to be stored in the pair

      pool.getInputAmount(amountOut, stablePool);
      var stableTrade = new TradeV4(new RouteV4([pool], originalStablePool, currencyIn, currencyAmountOut.token), currencyAmountOut, exports.TradeType.EXACT_OUTPUT);
      return [stableTrade];
    }

    for (var i = 0; i < pools.length; i++) {
      var _pool3 = pools[i]; // pool irrelevant

      if (!_pool3.token0.equals(amountOut.token) && !_pool3.token1.equals(amountOut.token)) continue;
      if (_pool3.reserve0.equalTo(ZERO) || _pool3.reserve1.equalTo(ZERO)) continue;
      var amountIn = void 0;

      try {
        if (_pool3.type === exports.PoolType.Pair) {
          ;

          var _pool3$getInputAmount = _pool3.getInputAmount(amountOut);

          amountIn = _pool3$getInputAmount[0];
        } else if (_pool3.type === exports.PoolType.WeightedPair) {
          ;

          var _pool3$clone$getInput = _pool3.clone().getInputAmount(amountOut);

          amountIn = _pool3$clone$getInput[0];
        } else {
          ;

          var _pool3$getInputAmount2 = _pool3.getInputAmount(amountOut, stablePool);

          amountIn = _pool3$getInputAmount2[0];
        }
      } catch (error) {
        // not enough liquidity in this pool
        if (error.isInsufficientReservesError) {
          continue;
        }

        throw error;
      } // we have arrived at the input token, so this is the first trade of one of the paths


      if (amountIn.token.equals(tokenIn)) {
        sortedInsert(bestTrades, new TradeV4(new RouteV4([_pool3].concat(currentpools), originalStablePool, currencyIn, originalAmountOut.currency), originalAmountOut, exports.TradeType.EXACT_OUTPUT), maxNumResults, tradeComparatorV4);
      } else if (maxHops > 1 && pools.length > 1) {
        var poolsExcludingThispool = pools.slice(0, i).concat(pools.slice(i + 1, pools.length)); // otherwise, consider all the other paths that arrive at this token as long as we have not exceeded maxHops

        TradeV4.bestTradeExactOutIteration(originalStablePool, stablePool, poolsExcludingThispool, currencyIn, amountIn, {
          maxNumResults: maxNumResults,
          maxHops: maxHops - 1
        }, [_pool3].concat(currentpools), originalAmountOut, bestTrades);
      }
    }

    return bestTrades;
  };

  TradeV4.bestTradeExactOut = function bestTradeExactOut(stablePool, pools, currencyIn, currencyAmountOut, _temp3) {
    var _ref3 = _temp3 === void 0 ? {} : _temp3,
        _ref3$maxNumResults = _ref3.maxNumResults,
        maxNumResults = _ref3$maxNumResults === void 0 ? 3 : _ref3$maxNumResults,
        _ref3$maxHops = _ref3.maxHops,
        maxHops = _ref3$maxHops === void 0 ? 3 : _ref3$maxHops;

    return this.bestTradeExactOutIteration(stablePool, stablePool.clone(), pools, currencyIn, currencyAmountOut, {
      maxNumResults: maxNumResults,
      maxHops: maxHops
    }, [], currencyAmountOut, []);
  };

  TradeV4.bestTradeExactIn = function bestTradeExactIn(stablePool, pools, currencyAmountIn, currencyOut, _temp4) {
    var _ref4 = _temp4 === void 0 ? {} : _temp4,
        _ref4$maxNumResults = _ref4.maxNumResults,
        maxNumResults = _ref4$maxNumResults === void 0 ? 3 : _ref4$maxNumResults,
        _ref4$maxHops = _ref4.maxHops,
        maxHops = _ref4$maxHops === void 0 ? 3 : _ref4$maxHops;

    return this.bestTradeExactInIteration(stablePool, stablePool.clone(), pools, currencyAmountIn, currencyOut, {
      maxNumResults: maxNumResults,
      maxHops: maxHops
    }, [], currencyAmountIn, []);
  };

  return TradeV4;
}();

var ONE$3 = /*#__PURE__*/ethers.BigNumber.from(1);
var TEN$1 = /*#__PURE__*/JSBI.BigInt(10);
var TWO$2 = /*#__PURE__*/ethers.BigNumber.from(2);
var SQRT2x100 = /*#__PURE__*/ethers.BigNumber.from('141421356237309504880');
var ONE_E18 = /*#__PURE__*/ethers.BigNumber.from('1000000000000000000');
function sqrrt(a) {
  var c = ONE$3;

  if (a.gt(3)) {
    c = a;
    var b = a.div(TWO$2).add(ONE$3);

    while (b < c) {
      c = b;
      b = a.div(b).add(b).div(TWO$2);
    }
  } else if (!a.eq(0)) {
    c = ONE$3;
  }

  return c;
}
function getTotalValue(pair, payoutToken) {
  var reserve0 = pair.reserve0;
  var reserve1 = pair.reserve1;

  var _ref = payoutToken.equals(pair.token0) ? [reserve1, pair.weight0, pair.weight1] : [reserve0, pair.weight1, pair.weight0],
      reservesOther = _ref[0],
      weightPayoutToken = _ref[1],
      weightOther = _ref[2];

  return SQRT2x100.mul(reservesOther.toBigNumber()).div(sqrrt(ethers.BigNumber.from(JSBI.add(JSBI.multiply(weightOther, weightOther), JSBI.multiply(weightPayoutToken, weightPayoutToken)).toString()))).div(ONE_E18);
}
/**
* - calculates the value in payoutToken of the input LP amount provided
* @param _pair general pair that has the RequiemSwap interface implemented
* @param amount_ the amount of LP to price in REQT
*  - is consistent with the uniswapV2-type case
*/

function valuation(pair, totalSupply, amount, payoutToken) {
  var totalValue = getTotalValue(pair, payoutToken);
  return totalValue.mul(amount).div(totalSupply);
} // markdown function for bond valuation

function markdown(pair, payoutToken) {
  var _ref2 = payoutToken.equals(pair.token0) ? [pair.reserve1.toBigNumber(), ethers.BigNumber.from(pair.weight1.toString()), ethers.BigNumber.from(pair.weight0.toString())] : [pair.reserve0.toBigNumber(), ethers.BigNumber.from(pair.weight0.toString()), ethers.BigNumber.from(pair.weight1.toString())],
      reservesOther = _ref2[0],
      weightOther = _ref2[1],
      weightPayoutToken = _ref2[2]; // adjusted markdown scaling up the reserve as the trading mechnism allows
  // higher or lower valuation for payoutToken reserve


  return reservesOther.add(weightOther.mul(reservesOther).div(weightPayoutToken)).mul(ethers.BigNumber.from(JSBI.exponentiate(TEN$1, JSBI.BigInt(payoutToken.decimals))).div(getTotalValue(pair, payoutToken)));
}

var RESOLUTION = /*#__PURE__*/ethers.BigNumber.from(112);
var resPrec = /*#__PURE__*/ethers.BigNumber.from(2).pow(RESOLUTION);
var ZERO$2 = /*#__PURE__*/ethers.BigNumber.from(0); // const Q112 = BigNumber.from('0x10000000000000000000000000000');
// const Q224 = BigNumber.from('0x100000000000000000000000000000000000000000000000000000000');
// const LOWER_MASK = BigNumber.from('0xffffffffffffffffffffffffffff'); // decimal of UQ*x112 (lower 112 bits)

function decode(x) {
  return x.div(RESOLUTION);
}
function decode112with18(x) {
  return x.div(ethers.BigNumber.from('5192296858534827'));
}
function fraction(numerator, denominator) {
  !denominator.gt(ZERO$2) ?  invariant(false, "FixedPoint::fraction: division by zero")  : void 0;
  if (numerator.isZero()) return ZERO$2; // if (numerator.lte(BigNumber.) <= type(uint144).max) {

  var result = numerator.mul(resPrec).div(denominator); //   require(result <= type(uint224).max, "FixedPoint::fraction: overflow");

  return result; // } else {
  //    return numerator.mul(Q112).div(denominator);
  // }
}

var ONE_E16 = /*#__PURE__*/ethers.BigNumber.from('10000000000000000');
var ONE_E18$1 = /*#__PURE__*/ethers.BigNumber.from('10000000000000000');
var ONE_E9 = /*#__PURE__*/ethers.BigNumber.from('1000000000');
function payoutFor(value, bondPrice) {
  // return BigNumber.from(
  //     JSBI.divide(
  //         JSBI.multiply(JSBI.BigInt(value.toString()), ONE_E18),
  //         JSBI.BigInt(bondPrice.toString())
  //     ).toString()
  // ).div(ONE_E16)
  return decode112with18(fraction(value.mul(ONE_E18$1), bondPrice)).div(ONE_E16);
}
function fullPayoutFor(pair, currentDebt, totalSupply, amount, payoutToken, terms) {
  var value = valuation(pair, totalSupply, amount, payoutToken);
  var bondPrice_ = bondPrice(terms.controlVariable, totalSupply, currentDebt, terms.minimumPrice);
  return payoutFor(value, bondPrice_);
}
/**
 *  @notice calculate current ratio of debt to REQT supply
 *  @return debtRatio_ uint
 */

function debtRatio(totalSupply, currentDebt) {
  return decode112with18(fraction(currentDebt.mul(ONE_E9), totalSupply)).div(ONE_E18$1);
}
/**
 *  @notice calculate current bond premium
 *  @return price_ uint
 */

function bondPrice(controlVariable, totalSupply, currentDebt, minimumPrice) {
  var price_ = controlVariable.mul(debtRatio(totalSupply, currentDebt)).add(ONE_E18$1).div(ONE_E16);

  if (price_.lt(minimumPrice)) {
    price_ = minimumPrice;
  }

  return price_;
}
/**
 *  @notice calculate current bond premium
 *  @return price_ uint
 */

function bondPriceUsingDebtRatio(controlVariable, debtRatio, minimumPrice) {
  var price_ = controlVariable.mul(debtRatio).add(ONE_E18$1).div(ONE_E16);

  if (price_.lt(minimumPrice)) {
    price_ = minimumPrice;
  }

  return price_;
}
function fullPayoutForUsingDebtRatio(pair, debtRatio, totalSupply, amount, payoutToken, terms) {
  var value = valuation(pair, totalSupply, amount, payoutToken);
  var bondPrice_ = bondPriceUsingDebtRatio(terms.controlVariable, debtRatio, terms.minimumPrice);
  return payoutFor(value, bondPrice_);
}

function toHex(currencyAmount) {
  return "0x" + currencyAmount.raw.toString(16);
}

var ZERO_HEX = '0x0';
/**
 * Represents the Router, and has static methods for helping execute trades.
 */

var Router = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function Router() {}
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trade to produce call parameters for
   * @param options options for the call parameters
   */


  Router.swapCallParameters = function swapCallParameters(trade, options) {
    var etherIn = trade.inputAmount.currency === NETWORK_CCY[trade.route.chainId];
    var etherOut = trade.outputAmount.currency === NETWORK_CCY[trade.route.chainId]; // the router does not support both ether in and out

    !!(etherIn && etherOut) ?  invariant(false, 'ETHER_IN_OUT')  : void 0;
    !(!('ttl' in options) || options.ttl > 0) ?  invariant(false, 'TTL')  : void 0;
    var to = validateAndParseAddress(options.recipient);
    var amountIn = toHex(trade.maximumAmountIn(options.allowedSlippage));
    var amountOut = toHex(trade.minimumAmountOut(options.allowedSlippage));
    var path = trade.route.path.map(function (token) {
      return token.address;
    });
    var deadline = 'ttl' in options ? "0x" + (Math.floor(new Date().getTime() / 1000) + options.ttl).toString(16) : "0x" + options.deadline.toString(16);
    var useFeeOnTransfer = Boolean(options.feeOnTransfer);
    var methodName;
    var args;
    var value;

    switch (trade.tradeType) {
      case exports.TradeType.EXACT_INPUT:
        if (etherIn) {
          methodName = useFeeOnTransfer ? 'swapExactETHForTokensSupportingFeeOnTransferTokens' : 'swapExactETHForTokens'; // (uint amountOutMin, address[] calldata path, address to, uint deadline)

          args = [amountOut, path, to, deadline];
          value = amountIn;
        } else if (etherOut) {
          methodName = useFeeOnTransfer ? 'swapExactTokensForETHSupportingFeeOnTransferTokens' : 'swapExactTokensForETH'; // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)

          args = [amountIn, amountOut, path, to, deadline];
          value = ZERO_HEX;
        } else {
          methodName = useFeeOnTransfer ? 'swapExactTokensForTokensSupportingFeeOnTransferTokens' : 'swapExactTokensForTokens'; // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)

          args = [amountIn, amountOut, path, to, deadline];
          value = ZERO_HEX;
        }

        break;

      case exports.TradeType.EXACT_OUTPUT:
        !!useFeeOnTransfer ?  invariant(false, 'EXACT_OUT_FOT')  : void 0;

        if (etherIn) {
          methodName = 'swapETHForExactTokens'; // (uint amountOut, address[] calldata path, address to, uint deadline)

          args = [amountOut, path, to, deadline];
          value = amountIn;
        } else if (etherOut) {
          methodName = 'swapTokensForExactETH'; // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)

          args = [amountOut, amountIn, path, to, deadline];
          value = ZERO_HEX;
        } else {
          methodName = 'swapTokensForExactTokens'; // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)

          args = [amountOut, amountIn, path, to, deadline];
          value = ZERO_HEX;
        }

        break;
    }

    return {
      methodName: methodName,
      args: args,
      value: value
    };
  };

  return Router;
}();

var ERC20 = [
	{
		constant: true,
		inputs: [
		],
		name: "decimals",
		outputs: [
			{
				name: "",
				type: "uint8"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
			{
				name: "",
				type: "address"
			}
		],
		name: "balanceOf",
		outputs: [
			{
				name: "",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	}
];

var _TOKEN_DECIMALS_CACHE;
var TOKEN_DECIMALS_CACHE = (_TOKEN_DECIMALS_CACHE = {}, _TOKEN_DECIMALS_CACHE[exports.ChainId.BSC_MAINNET] = {
  '0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A': 9 // DGD

}, _TOKEN_DECIMALS_CACHE);
/**
 * Contains methods for constructing instances of pairs and tokens from on-chain data.
 */

var Fetcher = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function Fetcher() {}
  /**
   * Fetch information for a given token on the given chain, using the given ethers provider.
   * @param chainId chain of the token
   * @param address address of the token on the chain
   * @param provider provider used to fetch the token
   * @param symbol optional symbol of the token
   * @param name optional name of the token
   */


  Fetcher.fetchTokenData = function fetchTokenData(chainId, address, provider, symbol, name) {
    try {
      var _TOKEN_DECIMALS_CACHE2, _TOKEN_DECIMALS_CACHE3;

      var _temp3 = function _temp3(parsedDecimals) {
        return new Token(chainId, address, parsedDecimals, symbol, name);
      };

      if (provider === undefined) provider = providers.getDefaultProvider(networks.getNetwork(chainId));

      var _temp4 = typeof ((_TOKEN_DECIMALS_CACHE2 = TOKEN_DECIMALS_CACHE) === null || _TOKEN_DECIMALS_CACHE2 === void 0 ? void 0 : (_TOKEN_DECIMALS_CACHE3 = _TOKEN_DECIMALS_CACHE2[chainId]) === null || _TOKEN_DECIMALS_CACHE3 === void 0 ? void 0 : _TOKEN_DECIMALS_CACHE3[address]) === 'number';

      return Promise.resolve(_temp4 ? _temp3(TOKEN_DECIMALS_CACHE[chainId][address]) : Promise.resolve(new contracts.Contract(address, ERC20, provider).decimals().then(function (decimals) {
        var _TOKEN_DECIMALS_CACHE4, _extends2, _extends3;

        TOKEN_DECIMALS_CACHE = _extends({}, TOKEN_DECIMALS_CACHE, (_extends3 = {}, _extends3[chainId] = _extends({}, (_TOKEN_DECIMALS_CACHE4 = TOKEN_DECIMALS_CACHE) === null || _TOKEN_DECIMALS_CACHE4 === void 0 ? void 0 : _TOKEN_DECIMALS_CACHE4[chainId], (_extends2 = {}, _extends2[address] = decimals, _extends2)), _extends3));
        return decimals;
      })).then(_temp3));
    } catch (e) {
      return Promise.reject(e);
    }
  }
  /**
   * Fetches information about a pair and constructs a pair from the given two tokens.
   * @param tokenA first token
   * @param tokenB second token
   * @param provider the provider to use to fetch the data
   */
  ;

  Fetcher.fetchPairData = function fetchPairData(tokenA, tokenB, provider) {
    try {
      if (provider === undefined) provider = providers.getDefaultProvider(networks.getNetwork(tokenA.chainId));
      !(tokenA.chainId === tokenB.chainId) ? "development" !== "production" ? invariant(false, 'CHAIN_ID') : invariant(false) : void 0;
      var address = Pair.getAddress(tokenA, tokenB);
      return Promise.resolve(new contracts.Contract(address, IPancakePair.abi, provider).getReserves()).then(function (_ref) {
        var reserves0 = _ref[0],
            reserves1 = _ref[1];
        var balances = tokenA.sortsBefore(tokenB) ? [reserves0, reserves1] : [reserves1, reserves0];
        return new Pair(new TokenAmount(tokenA, balances[0]), new TokenAmount(tokenB, balances[1]));
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  return Fetcher;
}();

// import { Token } from './entities/token'

/**
 * Contains methods for constructing instances of pairs and tokens from on-chain data.
 */

var StablesFetcher = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function StablesFetcher() {}
  /**
   * Fetches information about the stablePool and constructs a StablePool Object from the contract deployed.
   * @param tokenA first token
   * @param tokenB second token
   * @param provider the provider to use to fetch the data
   */


  StablesFetcher.fetchStablePoolData = function fetchStablePoolData(chainId, provider) {
    try {
      var address = StablePool.getRouterAddress(chainId);
      console.log("address", address);
      return Promise.resolve(new ethers.ethers.Contract(address, StableSwap, provider).getTokens()).then(function (tokenAddresses) {
        console.log("TokenAddresses", tokenAddresses); // const tokenReserves = await new ethers.Contract(address, StableSwap, provider).getTokenBalances()

        var indexes = [];

        for (var i = 0; i < tokenAddresses.length; i++) {
          indexes.push(i);
        } // const tokenMap = Object.assign({},
        //   ...(tokenAddresses as string[]).map((_, index) => ({
        //     [index]: new TokenAmount(
        //       STABLES_INDEX_MAP[chainId][index],
        //       tokenReserves[index])
        //   })))


        return StablePool.mock();
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  return StablesFetcher;
}();

function toHex$1(currencyAmount) {
  return "0x" + currencyAmount.raw.toString(16);
}

var ZERO_HEX$1 = '0x0';
/**
 * Represents the Router, and has static methods for helping execute trades.
 */

var RouterV3 = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function RouterV3() {}
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trade to produce call parameters for
   * @param options options for the call parameters
   */


  RouterV3.swapCallParameters = function swapCallParameters(trade, options) {
    var etherIn = trade.inputAmount.currency === NETWORK_CCY[trade.route.chainId];
    var etherOut = trade.outputAmount.currency === NETWORK_CCY[trade.route.chainId]; // the router does not support both ether in and out

    !!(etherIn && etherOut) ?  invariant(false, 'ETHER_IN_OUT')  : void 0;
    !(!('ttl' in options) || options.ttl > 0) ?  invariant(false, 'TTL')  : void 0;
    var to = validateAndParseAddress(options.recipient);
    var amountIn = toHex$1(trade.maximumAmountIn(options.allowedSlippage));
    var amountOut = toHex$1(trade.minimumAmountOut(options.allowedSlippage));
    var methodName;
    var args = [];
    var value;
    var deadline = 'ttl' in options ? "0x" + (Math.floor(new Date().getTime() / 1000) + options.ttl).toString(16) : "0x" + options.deadline.toString(16);

    if (!options.multiSwap && trade.route.routerIds.length === 1 && trade.route.routerIds[0] === 1) {
      var path = trade.route.path.map(function (token) {
        return token.address;
      });
      var useFeeOnTransfer = Boolean(options.feeOnTransfer);

      switch (trade.tradeType) {
        case exports.TradeType.EXACT_INPUT:
          if (etherIn) {
            methodName = useFeeOnTransfer ? 'swapExactETHForTokensSupportingFeeOnTransferTokens' : 'swapExactETHForTokens'; // (uint amountOutMin, address[] calldata path, address to, uint deadline)

            args = [amountOut, path, to, deadline];
            value = amountIn;
          } else if (etherOut) {
            methodName = useFeeOnTransfer ? 'swapExactTokensForETHSupportingFeeOnTransferTokens' : 'swapExactTokensForETH'; // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)

            args = [amountIn, amountOut, path, to, deadline];
            value = ZERO_HEX$1;
          } else {
            methodName = useFeeOnTransfer ? 'swapExactTokensForTokensSupportingFeeOnTransferTokens' : 'swapExactTokensForTokens'; // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)

            args = [amountIn, amountOut, path, to, deadline];
            value = ZERO_HEX$1;
          }

          break;

        case exports.TradeType.EXACT_OUTPUT:
          !!useFeeOnTransfer ?  invariant(false, 'EXACT_OUT_FOT')  : void 0;

          if (etherIn) {
            methodName = 'swapETHForExactTokens'; // (uint amountOut, address[] calldata path, address to, uint deadline)

            args = [amountOut, path, to, deadline];
            value = amountIn;
          } else if (etherOut) {
            methodName = 'swapTokensForExactETH'; // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)

            args = [amountOut, amountIn, path, to, deadline];
            value = ZERO_HEX$1;
          } else {
            methodName = 'swapTokensForExactTokens'; // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)

            args = [amountOut, amountIn, path, to, deadline];
            value = ZERO_HEX$1;
          }

          break;
      }
    } else {
      var _path = [];

      for (var i = 0; i < trade.route.pathMatrix.length; i++) {
        _path.push(trade.route.pathMatrix[i].map(function (token) {
          return token.address;
        }));
      }

      var routerId = trade.route.routerIds.map(function (id) {
        return id.toString();
      });

      switch (trade.tradeType) {
        case exports.TradeType.EXACT_INPUT:
          if (etherIn) {
            methodName = 'multiSwapExactETHForTokens'; // function multiSwapExactETHForTokens( address[][] calldata path, uint256[] memory routerId,
            // uint256 amountOutMin, uint256 deadline )

            args = [_path, routerId, amountOut, deadline];
            value = amountIn;
          } else if (etherOut) {
            methodName = 'multiSwapExactTokensForETH'; // multiSwapExactTokensForETH( address[][] calldata path, uint256[] memory routerId, uint256 amountIn,
            // uint256 amountOutMin, uint256 deadline )

            args = [_path, routerId, amountIn, amountOut, deadline];
            value = ZERO_HEX$1;
          } else {
            methodName = 'multiSwapExactTokensForTokens'; // multiSwapExactTokensForTokens( address[][] calldata path, uint256[] memory routerId, 
            // uint256 amountIn, uint256 amountOutMin, uint256 deadline )

            args = [_path, routerId, amountIn, amountOut, deadline];
            value = ZERO_HEX$1;
          }

          break;

        case exports.TradeType.EXACT_OUTPUT:
          if (etherIn) {
            methodName = 'multiSwapETHForExactTokens'; // multiSwapETHForExactTokens( address[][] calldata path, uint256[] memory routerId, uint256 amountOut, uint256 deadline )

            args = [_path, routerId, amountOut, deadline];
            value = amountIn;
          } else if (etherOut) {
            methodName = 'multiSwapTokensForExactETH'; // multiSwapTokensForExactETH( address[][] calldata path, uint256[] memory routerId,
            // uint256 amountOut, uint256 amountInMax, uint256 deadline )

            args = [_path, routerId, amountOut, amountIn, deadline];
            value = ZERO_HEX$1;
          } else {
            methodName = 'multiSwapTokensForExactTokens'; // multiSwapTokensForExactTokens( address[][] calldata path, uint256[] memory routerId, 
            // uint256 amountOut, uint256 amountInMax,  uint256 deadline )

            args = [_path, routerId, amountOut, amountIn, deadline];
            value = ZERO_HEX$1;
          }

          break;
      }
    }

    return {
      methodName: methodName,
      args: args,
      value: value
    };
  };

  return RouterV3;
}();

function toHex$2(currencyAmount) {
  return "0x" + currencyAmount.raw.toString(16);
}

var ZERO_HEX$2 = '0x0';
/**
 * Represents the Router, and has static methods for helping execute trades.
 */

var RouterV4 = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function RouterV4() {}
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trade to produce call parameters for
   * @param options options for the call parameters
   */


  RouterV4.swapCallParameters = function swapCallParameters(trade, options) {
    var etherIn = trade.inputAmount.currency === NETWORK_CCY[trade.route.chainId];
    var etherOut = trade.outputAmount.currency === NETWORK_CCY[trade.route.chainId]; // the router does not support both ether in and out

    !!(etherIn && etherOut) ?  invariant(false, 'ETHER_IN_OUT')  : void 0;
    !(!('ttl' in options) || options.ttl > 0) ?  invariant(false, 'TTL')  : void 0;
    var to = validateAndParseAddress(options.recipient);
    var amountIn = toHex$2(trade.maximumAmountIn(options.allowedSlippage));
    var amountOut = toHex$2(trade.minimumAmountOut(options.allowedSlippage));
    var methodName;
    var args = [];
    var value;
    var deadline = 'ttl' in options ? "0x" + (Math.floor(new Date().getTime() / 1000) + options.ttl).toString(16) : "0x" + options.deadline.toString(16);

    if (!options.multiSwap) {
      var path = trade.route.path.map(function (token) {
        return token.address;
      });
      var useFeeOnTransfer = Boolean(options.feeOnTransfer);

      switch (trade.tradeType) {
        case exports.TradeType.EXACT_INPUT:
          if (etherIn) {
            methodName = useFeeOnTransfer ? 'swapExactETHForTokensSupportingFeeOnTransferTokens' : 'swapExactETHForTokens'; // (uint amountOutMin, address[] calldata path, address to, uint deadline)

            args = [amountOut, path, to, deadline];
            value = amountIn;
          } else if (etherOut) {
            methodName = useFeeOnTransfer ? 'swapExactTokensForETHSupportingFeeOnTransferTokens' : 'swapExactTokensForETH'; // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)

            args = [amountIn, amountOut, path, to, deadline];
            value = ZERO_HEX$2;
          } else {
            methodName = useFeeOnTransfer ? 'swapExactTokensForTokensSupportingFeeOnTransferTokens' : 'swapExactTokensForTokens'; // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)

            args = [amountIn, amountOut, path, to, deadline];
            value = ZERO_HEX$2;
          }

          break;

        case exports.TradeType.EXACT_OUTPUT:
          !!useFeeOnTransfer ?  invariant(false, 'EXACT_OUT_FOT')  : void 0;

          if (etherIn) {
            methodName = 'swapETHForExactTokens'; // (uint amountOut, address[] calldata path, address to, uint deadline)

            args = [amountOut, path, to, deadline];
            value = amountIn;
          } else if (etherOut) {
            methodName = 'swapTokensForExactETH'; // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)

            args = [amountOut, amountIn, path, to, deadline];
            value = ZERO_HEX$2;
          } else {
            methodName = 'swapTokensForExactTokens'; // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)

            args = [amountOut, amountIn, path, to, deadline];
            value = ZERO_HEX$2;
          }

          break;
      }
    } else {
      var _path = trade.route.path.map(function (token) {
        return token.address;
      });

      var pools = trade.route.pools.map(function (pool) {
        return pool.getAddressForRouter();
      });

      switch (trade.tradeType) {
        case exports.TradeType.EXACT_INPUT:
          if (etherIn) {
            methodName = 'onSwapExactETHForTokens'; // function multiSwapExactETHForTokens( address[][] calldata path, uint256[] memory routerId,
            // uint256 amountOutMin, uint256 deadline )

            args = [pools, _path, amountOut, to, deadline];
            value = amountIn;
          } else if (etherOut) {
            methodName = 'onSwapExactTokensForETH'; // multiSwapExactTokensForETH( address[][] calldata path, uint256[] memory pools, uint256 amountIn,
            // uint256 amountOutMin, uint256 deadline )

            args = [pools, _path, amountIn, amountOut, to, deadline];
            value = ZERO_HEX$2;
          } else {
            methodName = 'onSwapExactTokensForTokens'; // function onSwapExactTokensForTokens(
            //   address[] memory pools,
            //   address[] memory tokens,
            //   uint256 amountIn,
            //   uint256 amountOutMin,
            //   address to,
            //   uint256 deadline

            args = [pools, _path, amountIn, amountOut, to, deadline];
            value = ZERO_HEX$2;
          }

          break;

        case exports.TradeType.EXACT_OUTPUT:
          if (etherIn) {
            methodName = 'onSwapETHForExactTokens'; // multiSwapETHForExactTokens( address[][] calldata path, uint256[] memory pools, uint256 amountOut, uint256 deadline )

            args = [pools, _path, amountOut, to, deadline];
            value = amountIn;
          } else if (etherOut) {
            methodName = 'onSwapTokensForExactETH'; // multiSwapTokensForExactETH( address[][] calldata path, uint256[] memory pools,
            // uint256 amountOut, uint256 amountInMax, uint256 deadline )

            args = [pools, _path, amountOut, amountIn, to, deadline];
            value = ZERO_HEX$2;
          } else {
            methodName = 'onSwapTokensForExactTokens'; // multiSwapTokensForExactTokens( address[][] calldata path, uint256[] memory pools, 
            // uint256 amountOut, uint256 amountInMax,  uint256 deadline )

            args = [pools, _path, amountOut, amountIn, to, deadline];
            value = ZERO_HEX$2;
          }

          break;
      }
    }

    return {
      methodName: methodName,
      args: args,
      value: value
    };
  };

  return RouterV4;
}();

exports.JSBI = JSBI;
exports.Currency = Currency;
exports.CurrencyAmount = CurrencyAmount;
exports.ETHER = ETHER;
exports.FACTORY_ADDRESS = FACTORY_ADDRESS;
exports.Fetcher = Fetcher;
exports.Fraction = Fraction;
exports.INIT_CODE_HASH = INIT_CODE_HASH;
exports.INIT_CODE_HASH_WEIGHTED = INIT_CODE_HASH_WEIGHTED;
exports.InsufficientInputAmountError = InsufficientInputAmountError;
exports.InsufficientReservesError = InsufficientReservesError;
exports.MINIMUM_LIQUIDITY = MINIMUM_LIQUIDITY;
exports.NETWORK_CCY = NETWORK_CCY;
exports.Pair = Pair;
exports.Percent = Percent;
exports.Price = Price;
exports.Route = Route;
exports.RouteV3 = RouteV3;
exports.RouteV4 = RouteV4;
exports.Router = Router;
exports.RouterV3 = RouterV3;
exports.RouterV4 = RouterV4;
exports.STABLECOINS = STABLECOINS;
exports.STABLES_INDEX_MAP = STABLES_INDEX_MAP;
exports.STABLES_LP_TOKEN = STABLES_LP_TOKEN;
exports.STABLE_POOL_ADDRESS = STABLE_POOL_ADDRESS;
exports.STABLE_POOL_LP_ADDRESS = STABLE_POOL_LP_ADDRESS;
exports.StablePairWrapper = StablePairWrapper;
exports.StablePool = StablePool;
exports.StablesFetcher = StablesFetcher;
exports.SwapStorage = SwapStorage;
exports.Token = Token;
exports.TokenAmount = TokenAmount;
exports.Trade = Trade;
exports.TradeV3 = TradeV3;
exports.TradeV4 = TradeV4;
exports.WEIGHTED_FACTORY_ADDRESS = WEIGHTED_FACTORY_ADDRESS;
exports.WETH = WETH;
exports.WRAPPED_NETWORK_TOKENS = WRAPPED_NETWORK_TOKENS;
exports.WeightedPair = WeightedPair;
exports.bondPrice = bondPrice;
exports.bondPriceUsingDebtRatio = bondPriceUsingDebtRatio;
exports.currencyEquals = currencyEquals;
exports.debtRatio = debtRatio;
exports.decode = decode;
exports.decode112with18 = decode112with18;
exports.findPositionInMaxExpArray = findPositionInMaxExpArray;
exports.fraction = fraction;
exports.fullPayoutFor = fullPayoutFor;
exports.fullPayoutForUsingDebtRatio = fullPayoutForUsingDebtRatio;
exports.generalExp = generalExp;
exports.generalLog = generalLog;
exports.getAmountIn = getAmountIn;
exports.getAmountOut = getAmountOut;
exports.getTotalValue = getTotalValue;
exports.inputOutputComparator = inputOutputComparator;
exports.inputOutputComparatorV3 = inputOutputComparatorV3;
exports.inputOutputComparatorV4 = inputOutputComparatorV4;
exports.markdown = markdown;
exports.optimalExp = optimalExp;
exports.optimalLog = optimalLog;
exports.payoutFor = payoutFor;
exports.power = power;
exports.sqrrt = sqrrt;
exports.tradeComparator = tradeComparator;
exports.tradeComparatorV3 = tradeComparatorV3;
exports.tradeComparatorV4 = tradeComparatorV4;
exports.valuation = valuation;
//# sourceMappingURL=sdk.cjs.development.js.map
