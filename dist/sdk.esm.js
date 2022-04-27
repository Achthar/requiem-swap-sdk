import { BigNumber, ethers } from 'ethers';
import invariant from 'tiny-invariant';
import warning from 'tiny-warning';
import { getAddress, getCreate2Address } from '@ethersproject/address';
import _Decimal from 'decimal.js-light';
import _Big from 'big.js';
import toFormat from 'toformat';
import { BigNumber as BigNumber$1 } from '@ethersproject/bignumber';
import { keccak256, pack } from '@ethersproject/solidity';
import { Contract } from '@ethersproject/contracts';

var _SOLIDITY_TYPE_MAXIMA;
var TradeType;

(function (TradeType) {
  TradeType[TradeType["EXACT_INPUT"] = 0] = "EXACT_INPUT";
  TradeType[TradeType["EXACT_OUTPUT"] = 1] = "EXACT_OUTPUT";
})(TradeType || (TradeType = {}));

var FACTORY_ADDRESS = {
  56: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
  97: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
  80001: '0xf10Bd0dA1f0e69c3334D7F8116C9082746EBC1B4',
  43113: '0xFb94c4CeA93f8369Fe18C3078060605eE2B14eC3'
};
var WEIGHTED_FACTORY_ADDRESS = {
  43113: '0xacd3602152763C3AAFA705D8a90C36661ecD7d46',
  42261: '0x0459e858F17ef5D927625f34602432f4fac6941e',
  110001: '0xe092CB3124aF36a0B851839D8EC51CaaD9a3DCD0'
}; // export const INIT_CODE_HASH = '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5'

var INIT_CODE_HASH = {
  56: '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5',
  97: '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5',
  80001: '0xc2b3644608b464a0df0eb711ce9c6ce7535d1bd4d0154b8389738a3e7fbb1a61',
  43113: '0x98fcd7ed545dc443aa0c7e57e5f54affba6cf755a7eadfd269143f9bf62024d8'
};
var INIT_CODE_HASH_WEIGHTED = {
  43113: '0xbeec252b6527ff023d9f20fa336f9f131a002be662ce64ef7f9ed17b5ea8b591',
  42261: '0x98fcd7ed545dc443aa0c7e57e5f54affba6cf755a7eadfd269143f9bf62024d8',
  110001: '0x98fcd7ed545dc443aa0c7e57e5f54affba6cf755a7eadfd269143f9bf62024d8'
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
var MINIMUM_LIQUIDITY = /*#__PURE__*/BigNumber.from(1000); // exports for internal consumption

var ZERO = /*#__PURE__*/BigNumber.from(0);
var ONE = /*#__PURE__*/BigNumber.from(1);
var TWO = /*#__PURE__*/BigNumber.from(2);
var THREE = /*#__PURE__*/BigNumber.from(3);
var FIVE = /*#__PURE__*/BigNumber.from(5);
var TEN = /*#__PURE__*/BigNumber.from(10);
var _100 = /*#__PURE__*/BigNumber.from(100);
var SolidityType;

(function (SolidityType) {
  SolidityType["uint8"] = "uint8";
  SolidityType["uint256"] = "uint256";
})(SolidityType || (SolidityType = {}));

var SOLIDITY_TYPE_MAXIMA = (_SOLIDITY_TYPE_MAXIMA = {}, _SOLIDITY_TYPE_MAXIMA[SolidityType.uint8] = /*#__PURE__*/BigNumber.from('0xff'), _SOLIDITY_TYPE_MAXIMA[SolidityType.uint256] = /*#__PURE__*/BigNumber.from('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'), _SOLIDITY_TYPE_MAXIMA);

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
  !value.gte(ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false, value + " is not a " + solidityType + ".") : invariant(false) : void 0;
  !value.lte(SOLIDITY_TYPE_MAXIMA[solidityType]) ? process.env.NODE_ENV !== "production" ? invariant(false, value + " is not a " + solidityType + ".") : invariant(false) : void 0;
} // warns if addresses are not checksummed

function validateAndParseAddress(address) {
  try {
    var checksummedAddress = getAddress(address);
    process.env.NODE_ENV !== "production" ? warning(address === checksummedAddress, address + " is not checksummed.") : void 0;
    return checksummedAddress;
  } catch (error) {
     process.env.NODE_ENV !== "production" ? invariant(false, address + " is not a valid address.") : invariant(false) ;
  }
}
function parseBigintIsh(bigintIsh) {
  return bigintIsh instanceof BigNumber ? bigintIsh : typeof bigintIsh === 'bigint' ? BigNumber.from(bigintIsh.toString()) : BigNumber.from(bigintIsh);
} // mock the on-chain sqrt function

function sqrt(y) {
  validateSolidityTypeInstance(y, SolidityType.uint256);
  var z = ZERO;
  var x;

  if (y.gt(THREE)) {
    z = y;
    x = y.div(TWO).add(ONE);

    while (x.lt(z)) {
      z = x;
      x = y.div(x).add(x).div(TWO);
    }
  } else if (!y.eq(ZERO)) {
    z = ONE;
  }

  return z;
} // given an array of items sorted by `comparator`, insert an item into its sort index and constrain the size to

var _NETWORK_CCY;

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
function Currency(chainId, decimals, symbol, name) {
  this.decimals = decimals;
  this.symbol = symbol;
  this.name = name;
  this.chainId = chainId;
};
var ChainId;

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
})(ChainId || (ChainId = {}));

var NETWORK_CCY = (_NETWORK_CCY = {}, _NETWORK_CCY[ChainId.BSC_MAINNET] = /*#__PURE__*/new Currency(ChainId.BSC_MAINNET, 18, 'BNB', 'BNB'), _NETWORK_CCY[ChainId.BSC_TESTNET] = /*#__PURE__*/new Currency(ChainId.BSC_TESTNET, 18, 'BNB', 'BNB'), _NETWORK_CCY[ChainId.ARBITRUM_MAINNET] = /*#__PURE__*/new Currency(ChainId.ARBITRUM_MAINNET, 18, 'ETH', 'ETH'), _NETWORK_CCY[ChainId.ARBITRUM_TETSNET_RINKEBY] = /*#__PURE__*/new Currency(ChainId.ARBITRUM_TETSNET_RINKEBY, 18, 'ETH', 'ETH'), _NETWORK_CCY[ChainId.AVAX_MAINNET] = /*#__PURE__*/new Currency(ChainId.AVAX_MAINNET, 18, 'AVAX', 'AVAX'), _NETWORK_CCY[ChainId.AVAX_TESTNET] = /*#__PURE__*/new Currency(ChainId.AVAX_TESTNET, 18, 'AVAX', 'AVAX'), _NETWORK_CCY[ChainId.MATIC_MAINNET] = /*#__PURE__*/new Currency(ChainId.MATIC_MAINNET, 18, 'MATIC', 'MATIC'), _NETWORK_CCY[ChainId.MATIC_TESTNET] = /*#__PURE__*/new Currency(ChainId.MATIC_TESTNET, 18, 'MATIC', 'MATIC'), _NETWORK_CCY[ChainId.OASIS_MAINNET] = /*#__PURE__*/new Currency(ChainId.OASIS_MAINNET, 18, 'ROSE', 'ROSE'), _NETWORK_CCY[ChainId.OASIS_TESTNET] = /*#__PURE__*/new Currency(ChainId.OASIS_TESTNET, 18, 'ROSE', 'ROSE'), _NETWORK_CCY[ChainId.QUARKCHAIN_DEV_S0] = /*#__PURE__*/new Currency(ChainId.QUARKCHAIN_DEV_S0, 18, 'QKC', 'QKC'), _NETWORK_CCY);

var _WETH, _WRAPPED_NETWORK_TOKE;
/**
 * Represents an ERC20 token with a unique address and some metadata.
 */

var Token = /*#__PURE__*/function (_Currency) {
  _inheritsLoose(Token, _Currency);

  function Token(chainId, address, decimals, symbol, name, projectLink) {
    var _this;

    _this = _Currency.call(this, chainId, decimals, symbol, name) || this;
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
    !(this.chainId === other.chainId) ? process.env.NODE_ENV !== "production" ? invariant(false, 'CHAIN_IDS') : invariant(false) : void 0;
    !(this.address !== other.address) ? process.env.NODE_ENV !== "production" ? invariant(false, 'ADDRESSES') : invariant(false) : void 0;
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
var WETH = (_WETH = {}, _WETH[ChainId.BSC_MAINNET] = /*#__PURE__*/new Token(ChainId.BSC_MAINNET, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'Wrapped BNB', 'https://www.binance.org'), _WETH[ChainId.BSC_TESTNET] = /*#__PURE__*/new Token(ChainId.BSC_TESTNET, '0xaE8E19eFB41e7b96815649A6a60785e1fbA84C1e', 18, 'WBNB', 'Wrapped BNB', 'https://www.binance.org'), _WETH[ChainId.ARBITRUM_MAINNET] = /*#__PURE__*/new Token(ChainId.ARBITRUM_MAINNET, '0xc778417E063141139Fce010982780140Aa0cD5Ab', 18, 'WETH', 'Wrapped ETH', 'https://www.binance.org'), _WETH[ChainId.ARBITRUM_TETSNET_RINKEBY] = /*#__PURE__*/new Token(ChainId.ARBITRUM_TETSNET_RINKEBY, '0xaE8E19eFB41e7b96815649A6a60785e1fbA84C1e', 18, 'WBNB', 'Wrapped BNB', 'https://www.binance.org'), _WETH[ChainId.AVAX_MAINNET] = /*#__PURE__*/new Token(ChainId.AVAX_MAINNET, '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', 18, 'WAVAX', 'Wrapped AVAX', 'https://www.binance.org'), _WETH[ChainId.AVAX_TESTNET] = /*#__PURE__*/new Token(ChainId.AVAX_TESTNET, '0xd00ae08403B9bbb9124bB305C09058E32C39A48c', 18, 'WAVAX', 'Wrapped AVAX', 'https://www.binance.org'), _WETH[ChainId.MATIC_MAINNET] = /*#__PURE__*/new Token(ChainId.MATIC_MAINNET, '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', 18, 'WMATIC', 'Wrapped MATIC', 'https://www.binance.org'), _WETH[ChainId.MATIC_TESTNET] = /*#__PURE__*/new Token(ChainId.MATIC_TESTNET, '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889', 18, 'WMATIC', 'Wrapped MATIC', 'https://www.binance.org'), _WETH); // this has not to be mixed up with the ERC20 token WETH on BSC or MATIC
// these are the respective wrapped network tokens, e.g. WBNB for Binance
// or WMATIC for Polygon

var WRAPPED_NETWORK_TOKENS = (_WRAPPED_NETWORK_TOKE = {}, _WRAPPED_NETWORK_TOKE[ChainId.BSC_MAINNET] = /*#__PURE__*/new Token(ChainId.BSC_MAINNET, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'Wrapped BNB', 'https://www.binance.org'), _WRAPPED_NETWORK_TOKE[ChainId.BSC_TESTNET] = /*#__PURE__*/new Token(ChainId.BSC_TESTNET, '0xaE8E19eFB41e7b96815649A6a60785e1fbA84C1e', 18, 'WBNB', 'Wrapped BNB', 'https://www.binance.org'), _WRAPPED_NETWORK_TOKE[ChainId.ARBITRUM_MAINNET] = /*#__PURE__*/new Token(ChainId.ARBITRUM_MAINNET, '0xc778417E063141139Fce010982780140Aa0cD5Ab', 18, 'WETH', 'Wrapped ETH', 'https://www.binance.org'), _WRAPPED_NETWORK_TOKE[ChainId.ARBITRUM_TETSNET_RINKEBY] = /*#__PURE__*/new Token(ChainId.ARBITRUM_TETSNET_RINKEBY, '0xaE8E19eFB41e7b96815649A6a60785e1fbA84C1e', 18, 'WBNB', 'Wrapped BNB', 'https://www.binance.org'), _WRAPPED_NETWORK_TOKE[ChainId.AVAX_MAINNET] = /*#__PURE__*/new Token(ChainId.AVAX_MAINNET, '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', 18, 'WAVAX', 'Wrapped AVAX', 'https://www.binance.org'), _WRAPPED_NETWORK_TOKE[ChainId.AVAX_TESTNET] = /*#__PURE__*/new Token(ChainId.AVAX_TESTNET, '0xd00ae08403B9bbb9124bB305C09058E32C39A48c', 18, 'WAVAX', 'Wrapped AVAX', 'https://www.binance.org'), _WRAPPED_NETWORK_TOKE[ChainId.MATIC_MAINNET] = /*#__PURE__*/new Token(ChainId.MATIC_MAINNET, '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', 18, 'WMATIC', 'Wrapped MATIC', 'https://www.binance.org'), _WRAPPED_NETWORK_TOKE[ChainId.MATIC_TESTNET] = /*#__PURE__*/new Token(ChainId.MATIC_TESTNET, '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889', 18, 'WMATIC', 'Wrapped MATIC', 'https://www.binance.org'), _WRAPPED_NETWORK_TOKE[ChainId.OASIS_TESTNET] = /*#__PURE__*/new Token(ChainId.OASIS_TESTNET, '0x792296e2a15e6Ceb5f5039DecaE7A1f25b00B0B0', 18, 'wROSE', 'Wrapped ROSE', 'https://docs.oasis.dev/'), _WRAPPED_NETWORK_TOKE[ChainId.OASIS_MAINNET] = /*#__PURE__*/new Token(ChainId.OASIS_MAINNET, '0xfb40cd35C0cF322fA3cfB8D67b533Bd9ad7df056', 18, 'wROSE', 'Wrapped ROSE', 'https://docs.oasis.dev/'), _WRAPPED_NETWORK_TOKE[ChainId.QUARKCHAIN_DEV_S0] = /*#__PURE__*/new Token(ChainId.OASIS_MAINNET, '0x56fB4da0E246003DEc7dD108e47f5d8e8F4cC493', 18, 'wQKC', 'Wrapped QKC', 'https://docs.oasis.dev/'), _WRAPPED_NETWORK_TOKE);
var STABLECOINS = {
  43113: [/*#__PURE__*/new Token(ChainId.AVAX_TESTNET, '0xca9ec7085ed564154a9233e1e7d8fef460438eea', 6, 'USDC', 'USD Coin'), /*#__PURE__*/new Token(ChainId.AVAX_TESTNET, '0xffb3ed4960cac85372e6838fbc9ce47bcf2d073e', 6, 'USDT', 'Tether USD'), /*#__PURE__*/new Token(ChainId.AVAX_TESTNET, '0xaea51e4fee50a980928b4353e852797b54deacd8', 18, 'DAI', 'Dai Stablecoin'), /*#__PURE__*/new Token(ChainId.AVAX_TESTNET, '0xccf7ed44c5a0f3cb5c9a9b9f765f8d836fb93ba1', 18, 'TUSD', 'True USD')],
  42261: [/*#__PURE__*/new Token(ChainId.OASIS_TESTNET, '0x9aEeeD65aE87e3b28793aefAeED59c3f10ef956b', 6, 'USDC', 'USD Coin'), /*#__PURE__*/new Token(ChainId.OASIS_TESTNET, '0xfA0D8065755Fb3b6520149e86Ac5A3Dc3ee5Dc92', 6, 'USDT', 'Tether USD'), /*#__PURE__*/new Token(ChainId.OASIS_TESTNET, '0xf10Bd0dA1f0e69c3334D7F8116C9082746EBC1B4', 18, 'DAI', 'Dai Stablecoin'), /*#__PURE__*/new Token(ChainId.OASIS_TESTNET, '0x4e8848da06E40E866b82f6b52417494936c9509b', 18, 'TUSD', 'True USD')],
  110001: [/*#__PURE__*/new Token(ChainId.QUARKCHAIN_DEV_S0, '0xE59c1Ddf4fAAC4Fa7C8c93d9392d4bBa55383268', 6, 'USDC', 'USD Coin'), /*#__PURE__*/new Token(ChainId.QUARKCHAIN_DEV_S0, '0x1a69a6e206c680A8559c59b951527437CBCe6Ed7', 6, 'USDT', 'Tether USD'), /*#__PURE__*/new Token(ChainId.QUARKCHAIN_DEV_S0, '0x51b90a5Bc99B7c76EDf3863E1d61ca6197a6e542', 18, 'DAI', 'Dai Stablecoin'), /*#__PURE__*/new Token(ChainId.QUARKCHAIN_DEV_S0, '0xD71C821a373E16D607277DB6C1356c1209C7d866', 18, 'TUSD', 'True USD')],
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

var _toSignificantRoundin, _toFixedRounding;
var Rounding;

(function (Rounding) {
  Rounding[Rounding["ROUND_DOWN"] = 0] = "ROUND_DOWN";
  Rounding[Rounding["ROUND_HALF_UP"] = 1] = "ROUND_HALF_UP";
  Rounding[Rounding["ROUND_UP"] = 2] = "ROUND_UP";
})(Rounding || (Rounding = {}));

var Decimal = /*#__PURE__*/toFormat(_Decimal);
var Big = /*#__PURE__*/toFormat(_Big);
var toSignificantRounding = (_toSignificantRoundin = {}, _toSignificantRoundin[Rounding.ROUND_DOWN] = Decimal.ROUND_DOWN, _toSignificantRoundin[Rounding.ROUND_HALF_UP] = Decimal.ROUND_HALF_UP, _toSignificantRoundin[Rounding.ROUND_UP] = Decimal.ROUND_UP, _toSignificantRoundin);
var toFixedRounding = (_toFixedRounding = {}, _toFixedRounding[Rounding.ROUND_DOWN] = 0, _toFixedRounding[Rounding.ROUND_HALF_UP] = 1, _toFixedRounding[Rounding.ROUND_UP] = 3, _toFixedRounding);
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

    if (this.denominator.eq(otherParsed.denominator)) {
      return new Fraction(this.numerator.add(otherParsed.numerator), this.denominator);
    }

    return new Fraction(this.numerator.mul(otherParsed.denominator).add(otherParsed.numerator.mul(this.denominator)), this.denominator.mul(otherParsed.denominator));
  };

  _proto.subtract = function subtract(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));

    if (this.denominator.eq(otherParsed.denominator)) {
      return new Fraction(this.numerator.sub(otherParsed.numerator), this.denominator);
    }

    return new Fraction(this.numerator.mul(otherParsed.denominator).sub(otherParsed.numerator.mul(this.denominator)), this.denominator.mul(otherParsed.denominator));
  };

  _proto.lessThan = function lessThan(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return this.numerator.mul(otherParsed.denominator).lt(otherParsed.numerator.mul(this.denominator));
  };

  _proto.equalTo = function equalTo(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return this.numerator.mul(otherParsed.denominator).eq(otherParsed.numerator.mul(this.denominator));
  };

  _proto.greaterThan = function greaterThan(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return this.numerator.mul(otherParsed.denominator).gt(otherParsed.numerator.mul(this.denominator));
  };

  _proto.multiply = function multiply(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return new Fraction(this.numerator.mul(otherParsed.numerator), this.denominator.mul(otherParsed.denominator));
  };

  _proto.divide = function divide(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return new Fraction(this.numerator.mul(otherParsed.denominator), this.denominator.mul(otherParsed.numerator));
  };

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (format === void 0) {
      format = {
        groupSeparator: ''
      };
    }

    if (rounding === void 0) {
      rounding = Rounding.ROUND_HALF_UP;
    }

    !Number.isInteger(significantDigits) ? process.env.NODE_ENV !== "production" ? invariant(false, significantDigits + " is not an integer.") : invariant(false) : void 0;
    !(significantDigits > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, significantDigits + " is not positive.") : invariant(false) : void 0;
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
      rounding = Rounding.ROUND_HALF_UP;
    }

    !Number.isInteger(decimalPlaces) ? process.env.NODE_ENV !== "production" ? invariant(false, decimalPlaces + " is not an integer.") : invariant(false) : void 0;
    !(decimalPlaces >= 0) ? process.env.NODE_ENV !== "production" ? invariant(false, decimalPlaces + " is negative.") : invariant(false) : void 0;
    Big.DP = decimalPlaces;
    Big.RM = toFixedRounding[rounding];
    return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(decimalPlaces, format);
  };

  _createClass(Fraction, [{
    key: "quotient",
    get: function get() {
      return this.numerator.div(this.denominator);
    } // remainder after floor division

  }, {
    key: "remainder",
    get: function get() {
      return new Fraction(this.numerator.mod(this.denominator), this.denominator);
    }
  }]);

  return Fraction;
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

var Big$1 = /*#__PURE__*/toFormat(_Big);
var CurrencyAmount = /*#__PURE__*/function (_Fraction) {
  _inheritsLoose(CurrencyAmount, _Fraction);

  // amount _must_ be raw, i.e. in the native representation
  function CurrencyAmount(currency, amount) {
    var _this;

    var parsedAmount = parseBigintIsh(amount);
    validateSolidityTypeInstance(parsedAmount, SolidityType.uint256);
    _this = _Fraction.call(this, parsedAmount, TEN.pow(currency.decimals)) || this;
    _this.currency = currency;
    return _this;
  }
  /**
   * Helper that calls the constructor with the more flexible network currency
   * dependent on the selected chainId
   * @param amount ether amount in wei
   */


  CurrencyAmount.networkCCYAmount = function networkCCYAmount(chainId, amount) {
    return new CurrencyAmount(NETWORK_CCY[chainId], amount);
  };

  var _proto = CurrencyAmount.prototype;

  _proto.add = function add(other) {
    !currencyEquals(this.currency, other.currency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
    return new CurrencyAmount(this.currency, this.raw.add(other.raw));
  };

  _proto.subtract = function subtract(other) {
    !currencyEquals(this.currency, other.currency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
    return new CurrencyAmount(this.currency, this.raw.sub(other.raw));
  };

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (significantDigits === void 0) {
      significantDigits = 6;
    }

    if (rounding === void 0) {
      rounding = Rounding.ROUND_DOWN;
    }

    return _Fraction.prototype.toSignificant.call(this, significantDigits, format, rounding);
  };

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (decimalPlaces === void 0) {
      decimalPlaces = this.currency.decimals;
    }

    if (rounding === void 0) {
      rounding = Rounding.ROUND_DOWN;
    }

    !(decimalPlaces <= this.currency.decimals) ? process.env.NODE_ENV !== "production" ? invariant(false, 'DECIMALS') : invariant(false) : void 0;
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
    return BigNumber$1.from(this.numerator.toString());
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
    !this.token.equals(other.token) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
    return new TokenAmount(this.token, this.raw.add(other.raw));
  };

  _proto.subtract = function subtract(other) {
    !this.token.equals(other.token) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
    return new TokenAmount(this.token, this.raw.sub(other.raw));
  };

  return TokenAmount;
}(CurrencyAmount);

var Price = /*#__PURE__*/function (_Fraction) {
  _inheritsLoose(Price, _Fraction);

  // denominator and numerator _must_ be raw, i.e. in the native representation
  function Price(baseCurrency, quoteCurrency, denominator, numerator) {
    var _this;

    _this = _Fraction.call(this, numerator, denominator) || this;
    _this.baseCurrency = baseCurrency;
    _this.quoteCurrency = quoteCurrency;
    _this.scalar = new Fraction(TEN.pow(baseCurrency.decimals), TEN.pow(quoteCurrency.decimals));
    return _this;
  } // upgraded version to include StablePairWrappers in a Route
  // as well as weighted pairs


  Price.fromRoute = function fromRoute(route, poolDict) {
    var prices = []; // console.log("=========PATH", route.path.map(x=>x.symbol))
    // console.log("=========PATH PAIRs", route.pairData.map(x=>[x.token0.symbol, x.token1.symbol]))

    for (var _iterator = _createForOfIteratorHelperLoose(route.pairData.entries()), _step; !(_step = _iterator()).done;) {
      var _step$value = _step.value,
          i = _step$value[0],
          pool = _step$value[1];
      var price = pool.poolPrice(route.path[i], route.path[i + 1], poolDict);
      prices.push(price);
    } // console.log("=========PRICE", prices.map(p=>[p.baseCurrency.symbol, p.quoteCurrency.symbol]))


    return prices.slice(1).reduce(function (accumulator, currentValue) {
      return accumulator.multiply(currentValue);
    }, prices[0]);
  };

  var _proto = Price.prototype;

  _proto.invert = function invert() {
    return new Price(this.quoteCurrency, this.baseCurrency, this.numerator, this.denominator);
  };

  _proto.multiply = function multiply(other) {
    !currencyEquals(this.quoteCurrency, other.baseCurrency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;

    var fraction = _Fraction.prototype.multiply.call(this, other);

    return new Price(this.baseCurrency, other.quoteCurrency, fraction.denominator, fraction.numerator);
  } // performs floor division on overflow
  ;

  _proto.quote = function quote(chainId, currencyAmount) {
    !currencyEquals(currencyAmount.currency, this.baseCurrency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;

    if (this.quoteCurrency instanceof Token) {
      return new TokenAmount(this.quoteCurrency, _Fraction.prototype.multiply.call(this, currencyAmount.raw).quotient);
    }

    return CurrencyAmount.networkCCYAmount(chainId, _Fraction.prototype.multiply.call(this, currencyAmount.raw).quotient);
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

// SPDX-License-Identifier: MIT

/* solhint-disable */

/**
 * @dev Exponentiation and logarithm functions for 18 decimal fixed point numbers (both base and exponent/argument).
 *
 * Exponentiation and logarithm with arbitrary bases (x^y and log_x(y)) are implemented by conversion to natural
 * exponentiation and logarithm (where the base is Euler's number).
 *
 * @author Fernando Martinelli - @fernandomartinelli
 * @author Sergio Yuhjtman - @sergioyuhjtman
 * @author Daniel Fernandez - @dmf7z
 */
// All fixed point multiplications and divisions are inlined. This means we need to divide by ONE when multiplying
// two numbers, and multiply by ONE when dividing them.

var ZERO$1 = /*#__PURE__*/BigNumber$1.from(0); // All arguments and return values are 18 decimal fixed point numbers.

var ONE_18 = /*#__PURE__*/BigNumber$1.from('1000000000000000000'); // Internally, intermediate values are computed with higher precision as 20 decimal fixed point numbers, and in the
// case of ln36, 36 decimals.

var ONE_20 = /*#__PURE__*/BigNumber$1.from('100000000000000000000');
var ONE_36 = /*#__PURE__*/BigNumber$1.from('1000000000000000000000000000000000000'); // The domain of natural exponentiation is bound by the word size and number of decimals used.
//
// Because internally the result will be stored using 20 decimals, the largest possible result is
// (2^255 - 1) / 10^20, which makes the largest exponent ln((2^255 - 1) / 10^20) = 130.700829182905140221.
// The smallest possible result is 10^(-18), which makes largest negative argument
// ln(10^(-18)) = -41.446531673892822312.
// We use 130.0 and -41.0 to have some safety margin.
// const MAX_NATURAL_EXPONENT = BigNumber.from('130000000000000000000');
// const MIN_NATURAL_EXPONENT = BigNumber.from(-'41000000000000000000');
// Bounds for ln_36's argument. Both ln(0.9) and ln(1.1) can be represented with 36 decimal places in a fixed point
// 256 bit integer.

var LN_36_LOWER_BOUND = /*#__PURE__*/ONE_18.sub( /*#__PURE__*/BigNumber$1.from('100000000000000000'));
var LN_36_UPPER_BOUND = /*#__PURE__*/ONE_18.add( /*#__PURE__*/BigNumber$1.from('100000000000000000')); // const MILD_EXPONENT_BOUND = ethers.constants.MaxUint256.div(ONE_20);
// 18 decimal constants

var x0 = /*#__PURE__*/BigNumber$1.from('128000000000000000000'); // 2ˆ7

var a0 = /*#__PURE__*/BigNumber$1.from('38877084059945950922200000000000000000000000000000000000'); // eˆ(x0) (no decimals)

var x1 = /*#__PURE__*/BigNumber$1.from('64000000000000000000'); // 2ˆ6

var a1 = /*#__PURE__*/BigNumber$1.from('6235149080811616882910000000'); // eˆ(x1) (no decimals)
// 20 decimal constants

var x2 = /*#__PURE__*/BigNumber$1.from('3200000000000000000000'); // 2ˆ5

var a2 = /*#__PURE__*/BigNumber$1.from('7896296018268069516100000000000000'); // eˆ(x2)

var x3 = /*#__PURE__*/BigNumber$1.from('1600000000000000000000'); // 2ˆ4

var a3 = /*#__PURE__*/BigNumber$1.from('888611052050787263676000000'); // eˆ(x3)

var x4 = /*#__PURE__*/BigNumber$1.from('800000000000000000000'); // 2ˆ3

var a4 = /*#__PURE__*/BigNumber$1.from('298095798704172827474000'); // eˆ(x4)

var x5 = /*#__PURE__*/BigNumber$1.from('400000000000000000000'); // 2ˆ2

var a5 = /*#__PURE__*/BigNumber$1.from('5459815003314423907810'); // eˆ(x5)

var x6 = /*#__PURE__*/BigNumber$1.from('200000000000000000000'); // 2ˆ1

var a6 = /*#__PURE__*/BigNumber$1.from('738905609893065022723'); // eˆ(x6)

var x7 = /*#__PURE__*/BigNumber$1.from('100000000000000000000'); // 2ˆ0

var a7 = /*#__PURE__*/BigNumber$1.from('271828182845904523536'); // eˆ(x7)

var x8 = /*#__PURE__*/BigNumber$1.from('50000000000000000000'); // 2ˆ-1

var a8 = /*#__PURE__*/BigNumber$1.from('164872127070012814685'); // eˆ(x8)

var x9 = /*#__PURE__*/BigNumber$1.from('25000000000000000000'); // 2ˆ-2

var a9 = /*#__PURE__*/BigNumber$1.from('128402541668774148407'); // eˆ(x9)

var x10 = /*#__PURE__*/BigNumber$1.from('12500000000000000000'); // 2ˆ-3

var a10 = /*#__PURE__*/BigNumber$1.from('113314845306682631683'); // eˆ(x10)

var x11 = /*#__PURE__*/BigNumber$1.from('6250000000000000000'); // 2ˆ-4

var a11 = /*#__PURE__*/BigNumber$1.from('106449445891785942956'); // eˆ(x11)

/**
 * @dev Exponentiation (x^y) with unsigned 18 decimal fixed point base and exponent.
 *
 * Reverts if ln(x) * y is smaller than `MIN_NATURAL_EXPONENT`, or larger than `MAX_NATURAL_EXPONENT`.
 */

function pow(x, y) {
  if (y.eq(0)) {
    // We solve the 0^0 indetermination by making it equal one.
    return ONE_18;
  }

  if (x.eq(0)) {
    return ZERO$1;
  }

  var x_int256 = x;
  var y_int256 = y;
  var logx_times_y;

  if (LN_36_LOWER_BOUND.lt(x_int256) && x_int256.lt(LN_36_UPPER_BOUND)) {
    var ln_36_x = _ln_36(x_int256); // ln_36_x has 36 decimal places, so multiplying by y_int256 isn't as straightforward, since we can't just
    // bring y_int256 to 36 decimal places, as it might overflow. Instead, we perform two 18 decimal
    // multiplications and add the results: one with the first 18 decimals of ln_36_x, and one with the
    // (downscaled) last 18 decimals.


    logx_times_y = ln_36_x.div(ONE_18).mul(y_int256).add(ln_36_x.mod(ONE_18).mul(y_int256).div(ONE_18));
  } else {
    logx_times_y = _ln(x_int256).mul(y_int256);
  }

  logx_times_y = logx_times_y.div(ONE_18);
  return exp(logx_times_y); // that +1 differs from the original variant
}
/**
 * @dev Natural exponentiation (e^x) with signed 18 decimal fixed point exponent.
 *
 * Reverts if `x` is smaller than MIN_NATURAL_EXPONENT, or larger than `MAX_NATURAL_EXPONENT`.
 */

function exp(x) {
  if (x.lt(ZERO$1)) {
    // We only handle positive exponents: e^(-x) is computed as 1 / e^x. We can safely make x positive since it
    // fits in the signed 256 bit range (as it is larger than MIN_NATURAL_EXPONENT).
    // Fixed point division requires multiplying by ONE_18.
    return ONE_18.mul(ONE_18).div(exp(x.mul(-1)));
  } // First, we use the fact that e^(x+y) = e^x * e^y to decompose x into a sum of powers of two, which we call x_n,
  // where x_n == 2^(7 - n), and e^x_n = a_n has been precomputed. We choose the first x_n, x0, to equal 2^7
  // because all larger powers are larger than MAX_NATURAL_EXPONENT, and therefore not present in the
  // decomposition.
  // At the end of this process we will have the product of all e^x_n = a_n that apply, and the remainder of this
  // decomposition, which will be lower than the smallest x_n.
  // exp(x) = k_0 * a_0 * k_1 * a_1 * ... + k_n * a_n * exp(remainder), where each k_n equals either 0 or 1.
  // We mutate x by subtracting x_n, making it the remainder of the decomposition.
  // The first two a_n (e^(2^7) and e^(2^6)) are too large if stored as 18 decimal numbers, and could cause
  // intermediate overflows. Instead we store them as plain integers, with 0 decimals.
  // Additionally, x0 + x1 is larger than MAX_NATURAL_EXPONENT, which means they will not both be present in the
  // decomposition.
  // For each x_n, we test if that term is present in the decomposition (if x is larger than it), and if so deduct
  // it and compute the accumulated product.


  var firstAN;

  if (x.gte(x0)) {
    x = x.sub(x0);
    firstAN = a0;
  } else if (x.gte(x1)) {
    x = x.sub(x1);
    firstAN = a1;
  } else {
    firstAN = BigNumber$1.from(1); // One with no decimal places
  } // We now transform x into a 20 decimal fixed point number, to have enhanced precision when computing the
  // smaller terms.


  x = x.mul(100); // `product` is the accumulated product of all a_n (except a0 and a1), which starts at 20 decimal fixed point
  // one. Recall that fixed point multiplication requires dividing by ONE_20.

  var product = ONE_20;

  if (x.gte(x2)) {
    x = x.sub(x2);
    product = product.mul(a2).div(ONE_20);
  }

  if (x.gte(x3)) {
    x = x.sub(x3);
    product = product.mul(a3).div(ONE_20);
  }

  if (x.gte(x4)) {
    x = x.sub(x4);
    product = product.mul(a4).div(ONE_20);
  }

  if (x.gte(x5)) {
    x = x.sub(x5);
    product = product.mul(a5).div(ONE_20);
  }

  if (x.gte(x6)) {
    x = x.sub(x6);
    product = product.mul(a6).div(ONE_20);
  }

  if (x.gte(x7)) {
    x = x.sub(x7);
    product = product.mul(a7).div(ONE_20);
  }

  if (x.gte(x8)) {
    x = x.sub(x8);
    product = product.mul(a8).div(ONE_20);
  }

  if (x.gte(x9)) {
    x = x.sub(x9);
    product = product.mul(a9).div(ONE_20);
  } // x10 and x11 are unnecessary here since we have high enough precision already.
  // Now we need to compute e^x, where x is small (in particular, it is smaller than x9). We use the Taylor series
  // expansion for e^x: 1 + x + (x^2 / 2!) + (x^3 / 3!) + ... + (x^n / n!).


  var seriesSum = ONE_20; // The initial one in the sum, with 20 decimal places.

  var term; // Each term in the sum, where the nth term is (x^n / n!).
  // The first term is simply x.

  term = x;
  seriesSum = seriesSum.add(term); // Each term (x^n / n!) equals the previous one times x, divided by n. Since x is a fixed point number,
  // multiplying by it requires dividing by ONE_20, but dividing by the non-fixed point n values does not.

  term = term.mul(x).div(ONE_20).div(2);
  seriesSum = seriesSum.add(term);
  term = term.mul(x).div(ONE_20).div(3);
  seriesSum = seriesSum.add(term);
  term = term.mul(x).div(ONE_20).div(4);
  seriesSum = seriesSum.add(term);
  term = term.mul(x).div(ONE_20).div(5);
  seriesSum = seriesSum.add(term);
  term = term.mul(x).div(ONE_20).div(6);
  seriesSum = seriesSum.add(term);
  term = term.mul(x).div(ONE_20).div(7);
  seriesSum = seriesSum.add(term);
  term = term.mul(x).div(ONE_20).div(8);
  seriesSum = seriesSum.add(term);
  term = term.mul(x).div(ONE_20).div(9);
  seriesSum = seriesSum.add(term);
  term = term.mul(x).div(ONE_20).div(10);
  seriesSum = seriesSum.add(term);
  term = term.mul(x).div(ONE_20).div(11);
  seriesSum = seriesSum.add(term);
  term = term.mul(x).div(ONE_20).div(12);
  seriesSum = seriesSum.add(term); // 12 Taylor terms are sufficient for 18 decimal precision.
  // We now have the first a_n (with no decimals), and the product of all other a_n present, and the Taylor
  // approximation of the exponentiation of the remainder (both with 20 decimals). All that remains is to multiply
  // all three (one 20 decimal fixed point multiplication, dividing by ONE_20, and one integer multiplication),
  // and then drop two digits to return an 18 decimal value.

  return product.mul(seriesSum).div(ONE_20).mul(firstAN).div(100);
}
/**
 * @dev Logarithm (log(arg, base), with signed 18 decimal fixed point base and argument.
 */

function log(arg, base) {
  // This performs a simple base change: log(arg, base) = ln(arg) / ln(base).
  // Both logBase and logArg are computed as 36 decimal fixed point numbers, either by using ln_36, or by
  // upscaling.
  var logBase;

  if (LN_36_LOWER_BOUND.lt(base) && base.lt(LN_36_UPPER_BOUND)) {
    logBase = _ln_36(base);
  } else {
    logBase = _ln(base).mul(ONE_18);
  }

  var logArg;

  if (LN_36_LOWER_BOUND.lt(arg) && arg.lt(LN_36_UPPER_BOUND)) {
    logArg = _ln_36(arg);
  } else {
    logArg = _ln(arg).mul(ONE_18);
  } // When dividing, we multiply by ONE_18 to arrive at a result with 18 decimal places


  return logArg.mul(ONE_18).div(logBase);
}
/**
 * @dev Natural logarithm (ln(a)) with signed 18 decimal fixed point argument.
 */

function ln(a) {
  // The real natural logarithm is not defined for negative numbers or zero.
  if (LN_36_LOWER_BOUND.lt(a) && a.lt(LN_36_UPPER_BOUND)) {
    return _ln_36(a).div(ONE_18);
  } else {
    return _ln(a);
  }
}
/**
 * @dev Internal natural logarithm (ln(a)) with signed 18 decimal fixed point argument.
 */

function _ln(a) {
  if (a.lt(ONE_18)) {
    // Since ln(a^k) = k * ln(a), we can compute ln(a) as ln(a) = ln((1/a)^(-1)) = - ln((1/a)). If a is less
    // than one, 1/a will be greater than one, and this if statement will not be entered in the recursive call.
    // Fixed point division requires multiplying by ONE_18.
    return _ln(ONE_18.mul(ONE_18).div(a)).mul(-1);
  } // First, we use the fact that ln^(a * b) = ln(a) + ln(b) to decompose ln(a) into a sum of powers of two, which
  // we call x_n, where x_n == 2^(7 - n), which are the natural logarithm of precomputed quantities a_n (that is,
  // ln(a_n) = x_n). We choose the first x_n, x0, to equal 2^7 because the exponential of all larger powers cannot
  // be represented as 18 fixed point decimal numbers in 256 bits, and are therefore larger than a.
  // At the end of this process we will have the sum of all x_n = ln(a_n) that apply, and the remainder of this
  // decomposition, which will be lower than the smallest a_n.
  // ln(a) = k_0 * x_0 + k_1 * x_1 + ... + k_n * x_n + ln(remainder), where each k_n equals either 0 or 1.
  // We mutate a by subtracting a_n, making it the remainder of the decomposition.
  // For reasons related to how `exp` works, the first two a_n (e^(2^7) and e^(2^6)) are not stored as fixed point
  // numbers with 18 decimals, but instead as plain integers with 0 decimals, so we need to multiply them by
  // ONE_18 to convert them to fixed point.
  // For each a_n, we test if that term is present in the decomposition (if a is larger than it), and if so divide
  // by it and compute the accumulated sum.


  var sum = ZERO$1;

  if (a.gte(a0.mul(ONE_18))) {
    a = a.div(a0); // Integer, not fixed point division

    sum = sum.add(x0);
  }

  if (a.gte(a1.mul(ONE_18))) {
    a = a.div(a1); // Integer, not fixed point division

    sum = sum.add(x1);
  } // All other a_n and x_n are stored as 20 digit fixed point numbers, so we convert the sum and a to this format.


  sum = sum.mul(100);
  a = a.mul(100); // Because further a_n are  20 digit fixed point numbers, we multiply by ONE_20 when dividing by them.

  if (a.gte(a2)) {
    a = a.mul(ONE_20).div(a2);
    sum = sum.add(x2);
  }

  if (a.gte(a3)) {
    a = a.mul(ONE_20).div(a3);
    sum = sum.add(x3);
  }

  if (a.gte(a4)) {
    a = a.mul(ONE_20).div(a4);
    sum = sum.add(x4);
  }

  if (a.gte(a5)) {
    a = a.mul(ONE_20).div(a5);
    sum = sum.add(x5);
  }

  if (a.gte(a6)) {
    a = a.mul(ONE_20).div(a6);
    sum = sum.add(x6);
  }

  if (a.gte(a7)) {
    a = a.mul(ONE_20).div(a7);
    sum = sum.add(x7);
  }

  if (a.gte(a8)) {
    a = a.mul(ONE_20).div(a8);
    sum = sum.add(x8);
  }

  if (a.gte(a9)) {
    a = a.mul(ONE_20).div(a9);
    sum = sum.add(x9);
  }

  if (a.gte(a10)) {
    a = a.mul(ONE_20).div(a10);
    sum = sum.add(x10);
  }

  if (a.gte(a11)) {
    a = a.mul(ONE_20).div(a11);
    sum = sum.add(x11);
  } // a is now a small number (smaller than a_11, which roughly equals 1.06). This means we can use a Taylor series
  // that converges rapidly for values of `a` close to one - the same one used in ln_36.
  // Let z = (a - 1) / (a + 1).
  // ln(a) =2.mul((z + z^.div( 3) + z^5 / 5 + z^7 / 7 + ... + z^(2 * n + 1) / (2 * n + 1))
  // Recall that 20 digit fixed point division requires multiplying by ONE_20, and multiplication requires
  // division by ONE_20.


  var z = a.sub(ONE_20).mul(ONE_20).div(a.add(ONE_20));
  var z_squared = z.mul(z).div(ONE_20); // num is the numerator of the series: the z^(2 * n + 1) term

  var num = z; // seriesSum holds the accumulated sum of each term in the series, starting with the initial z

  var seriesSum = num; // In each step, the numerator is multiplied by z^2

  num = num.mul(z_squared).div(ONE_20);
  seriesSum = seriesSum.add(num.div(3));
  num = num.mul(z_squared).div(ONE_20);
  seriesSum = seriesSum.add(num.div(5));
  num = num.mul(z_squared).div(ONE_20);
  seriesSum = seriesSum.add(num.div(7));
  num = num.mul(z_squared).div(ONE_20);
  seriesSum = seriesSum.add(num.div(9));
  num = num.mul(z_squared).div(ONE_20);
  seriesSum = seriesSum.add(num.div(11)); // 6 Taylor terms are sufficient for 36 decimal precision.
  // Finally, we multiply by 2 (non fixed point) to compute ln(remainder)

  seriesSum = seriesSum.mul(2); // We now have the sum of all x_n present, and the Taylor approximation of the logarithm of the remainder (both
  // with 20 decimals). All that remains is to sum these two, and then drop two digits to return a 18 decimal
  // value.

  return sum.add(seriesSum).div(100);
}
/**
 * @dev Intrnal high precision (36 decimal places) natural logarithm (ln(x)) with signed 18 decimal fixed point argument,
 * for x close to one.
 *
 * Should only be used if x is between LN_36_LOWER_BOUND and LN_36_UPPER_BOUND.
 */

function _ln_36(x) {
  // Since ln(1) = 0, a value of x close to one will yield a very small result, which makes using 36 digits
  // worthwhile.
  // First, we transform x to a 36 digit fixed point value.
  x = x.mul(ONE_18); // We will use the following Taylor expansion, which converges very rapidly. Let z = (x - 1) / (x + 1).
  // ln(x) = 2 * (z + z^3 / 3 + z^5 / 5 + z^7 / 7 + ... + z^(2 * n + 1) / (2 * n + 1))
  // Recall that 36 digit fixed point division requires multiplying by ONE_36, and multiplication requires
  // division by ONE_36.

  var z = x.sub(ONE_36).mul(ONE_36).div(x.add(ONE_36));
  var z_squared = z.mul(z).div(ONE_36); // num is the numerator of the series: the z^(2 * n + 1) term

  var num = z; // seriesSum holds the accumulated sum of each term in the series, starting with the initial z

  var seriesSum = num; // In each step, the numerator is multiplied by z^2

  num = num.mul(z_squared).div(ONE_36);
  seriesSum = seriesSum.add(num.div(3));
  num = num.mul(z_squared).div(ONE_36);
  seriesSum = seriesSum.add(num.div(5));
  num = num.mul(z_squared).div(ONE_36);
  seriesSum = seriesSum.add(num.div(7));
  num = num.mul(z_squared).div(ONE_36);
  seriesSum = seriesSum.add(num.div(9));
  num = num.mul(z_squared).div(ONE_36);
  seriesSum = seriesSum.add(num.div(11));
  num = num.mul(z_squared).div(ONE_36);
  seriesSum = seriesSum.add(num.div(13));
  num = num.mul(z_squared).div(ONE_36);
  seriesSum = seriesSum.add(num.div(15)); // 8 Taylor terms are sufficient for 36 decimal precision.
  // All that remains is multiplying by 2 (non fixed point).

  return seriesSum.mul(2);
}

// import invariant from 'tiny-invariant'
var ONE$1 = ONE_18;
/* solhint-disable private-vars-leading-underscore */
// const ONE = BigNumber.from(1e18); // 18 decimal places

var MAX_POW_RELATIVE_ERROR = /*#__PURE__*/BigNumber$1.from(10000); // 10^(-14)
// Minimum base for the power function when the exponent is 'free' (larger than ONE).

var MIN_POW_BASE_FREE_EXPONENT = /*#__PURE__*/BigNumber$1.from('700000000000000000');
function mulDown(a, b) {
  var product = a.mul(b);
  return product.div(ONE$1);
}
function mulUp(a, b) {
  var product = a.mul(b);

  if (product.eq(0)) {
    return BigNumber$1.from(0);
  } else {
    // The traditional divUp formula is:
    // divUp(x, y) := (x + y - 1) / y
    // To avoid intermediate overflow in the addition, we distribute the division and get:
    // divUp(x, y) := (x - 1) / y + 1
    // Note that this requires x != 0, which we already tested for.
    return product.sub(1).div(ONE$1).add(1);
  }
}
function divDown(a, b) {
  if (a.eq(ZERO$1)) {
    return ZERO$1;
  } else {
    var aInflated = a.mul(ONE$1);
    return aInflated.div(b);
  }
}
function divUp(a, b) {
  if (a.eq(ZERO$1)) {
    return ZERO$1;
  } else {
    var aInflated = a.mul(ONE$1); // The traditional divUp formula is:
    // divUp(x, y) := (x + y - 1) / y
    // To avoid intermediate overflow in the addition, we distribute the division and get:
    // divUp(x, y) := (x - 1) / y + 1
    // Note that this requires x != 0, which we already tested for.

    return aInflated.sub(1).div(b).add(1);
  }
}
/**
 * @dev Returns x^y, assuming both are fixed point numbers, rounding down. The result is guaranteed to not be above
 * the true value (that is, the error function expected - actual is always positive).
 */

function powDown(x, y) {
  var raw = pow(x, y);
  var maxError = mulUp(raw, MAX_POW_RELATIVE_ERROR).add(1);

  if (raw.lt(maxError)) {
    return ZERO$1;
  } else {
    return raw.sub(maxError);
  }
}
/**
 * @dev Returns x^y, assuming both are fixed point numbers, rounding up. The result is guaranteed to not be below
 * the true value (that is, the error function expected - actual is always negative).
 */

function powUp(x, y) {
  var raw = pow(x, y);
  var maxError = mulUp(raw, MAX_POW_RELATIVE_ERROR).add(1);
  return raw.add(maxError);
}
/**
 * @dev Returns the complement of a value (1 - x), capped to 0 if x is larger than 1.
 *
 * Useful when computing the complement for values with some level of relative error, as it strips this error and
 * prevents intermediate negative values.
 */

function complement(x) {
  return x.lt(ONE$1) ? ONE$1.sub(x) : ZERO$1;
}
/**
 * @dev Returns the largest of two numbers of 256 bits.
 */

function max(a, b) {
  return a.gte(b) ? a : b;
}
/**
 * @dev Returns the smallest of two numbers of 256 bits.
 */

function min(a, b) {
  return a.lt(b) ? a : b;
}

// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
// These functions start with an underscore, as if they were part of a contract and not a library. At some point this
// should be fixed.
// solhint-disable private-vars-leading-underscore
// A minimum normalized weight imposes a maximum weight ratio. We need this due to limitations in the
// implementation of the power function, as these ratios are often exponents.
// const _MIN_WEIGHT = BigNumber.from(0.01e18);
// Having a minimum normalized weight imposes a limit on the maximum number of tokens;
// i.e., the largest possible pool is one where all tokens have exactly the minimum weight.
// const _MAX_WEIGHTED_TOKENS = BigNumber.from(100);
// Pool limits that arise from limitations in the fixed point power function (and the imposed 1:100 maximum weight
// ratio).
// Swap limits: amounts swapped may not be larger than this percentage of total balance.

var _MAX_IN_RATIO = /*#__PURE__*/BigNumber$1.from('300000000000000000'); //0.3e18


var _MAX_OUT_RATIO = /*#__PURE__*/BigNumber$1.from('300000000000000000'); //0.3e18
// Invariant growth limit: non-proportional joins cannot cause the invariant to increase by more than this ratio.


var _MAX_INVARIANT_RATIO = /*#__PURE__*/BigNumber$1.from('3000000000000000000'); //3e18
// Invariant shrink limit: non-proportional exits cannot cause the invariant to decrease by less than this ratio.


var _MIN_INVARIANT_RATIO = /*#__PURE__*/BigNumber$1.from('700000000000000000'); //0.7e18
// About swap fees on joins and exits:
// Any join or exit that is not perfectly balanced (e.g. all single token joins or exits) is mathematically
// equivalent to a perfectly balanced join or  exit followed by a series of swaps. Since these swaps would charge
// swap fees, it follows that (some) joins and exits should as well.
// On these operations, we split the token amounts in 'taxable' and 'non-taxable' portions, where the 'taxable' part
// is the one to which swap fees are applied.
// Invariant is used to collect protocol swap fees by comparing its value between two times.
// So we can round always to the same direction. It is also used to initiate the BPT amount
// and, because there is a minimum BPT, we round down the invariant.


function _calculateInvariant(normalizedWeights, balances) {
  /**********************************************************************************************
  // invariant               _____                                                             //
  // wi = weight index i      | |      wi                                                      //
  // bi = balance index i     | |  bi ^   = i                                                  //
  // i = invariant                                                                             //
  **********************************************************************************************/
  var _invariant = ONE$1;

  for (var i = 0; i < normalizedWeights.length; i++) {
    _invariant = mulDown(_invariant, powUp(balances[i], normalizedWeights[i]));
  }

  !_invariant.gt(0) ? process.env.NODE_ENV !== "production" ? invariant(false, "ZERO_INVARIANT") : invariant(false) : void 0;
  return _invariant;
} // Computes how many tokens can be taken out of a pool if `amountIn` are sent, given the
// current balances and weights.

function _calcOutGivenIn(balanceIn, weightIn, balanceOut, weightOut, amountIn) {
  /**********************************************************************************************
  // outGivenIn                                                                                //
  // aO = amountOut                                                                            //
  // bO = balanceOut                                                                           //
  // bI = balanceIn              /      /            bI             \    (wI / wO) \           //
  // aI = amountIn    aO = bO * |  1 - | --------------------------  | ^            |          //
  // wI = weightIn               \      \       ( bI + aI )         /              /           //
  // wO = weightOut                                                                            //
  **********************************************************************************************/
  // Amount out, so we round down overall.
  // The multiplication rounds down, and the subtrahend (power) rounds up (so the base rounds up too).
  // Because bI / (bI + aI) <= 1, the exponent rounds down.
  // Cannot exceed maximum in ratio
  !amountIn.lte(mulDown(balanceIn, _MAX_IN_RATIO)) ? process.env.NODE_ENV !== "production" ? invariant(false, "MAX_IN_RATIO") : invariant(false) : void 0;
  var denominator = balanceIn.add(amountIn);
  var base = divUp(balanceIn, denominator);
  var exponent = divDown(weightIn, weightOut);
  var power = powUp(base, exponent);
  return mulDown(balanceOut, complement(power));
} // Computes how many tokens must be sent to a pool in order to take `amountOut`, given the
// current balances and weights.

function _calcInGivenOut(balanceIn, weightIn, balanceOut, weightOut, amountOut) {
  /**********************************************************************************************
  // inGivenOut                                                                                //
  // aO = amountOut                                                                            //
  // bO = balanceOut                                                                           //
  // bI = balanceIn              /  /            bO             \    (wO / wI)      \          //
  // aI = amountIn    aI = bI * |  | --------------------------  | ^            - 1  |         //
  // wI = weightIn               \  \       ( bO - aO )         /                   /          //
  // wO = weightOut                                                                            //
  **********************************************************************************************/
  // Amount in, so we round up overall.
  // The multiplication rounds up, and the power rounds up (so the base rounds up too).
  // Because b0 / (b0 - a0) >= 1, the exponent rounds up.
  // Cannot exceed maximum out ratio
  !amountOut.lte(mulDown(balanceOut, _MAX_OUT_RATIO)) ? process.env.NODE_ENV !== "production" ? invariant(false, "MAX_OUT_RATIO") : invariant(false) : void 0;
  var base = divUp(balanceOut, balanceOut.sub(amountOut));
  var exponent = divUp(weightOut, weightIn);
  var power = powUp(base, exponent); // Because the base is larger than one (and the power rounds up), the power should always be larger than one, so
  // the following subtraction should never revert.

  var ratio = power.sub(ONE$1);
  return mulUp(balanceIn, ratio);
}
function _calcLpOutGivenExactTokensIn(balances, normalizedWeights, amountsIn, lpTotalSupply, swapFeePercentage) {
  // BPT out, so we round down overall.
  var balanceRatiosWithFee = [];
  var invariantRatioWithFees = ZERO$1;

  for (var i = 0; i < balances.length; i++) {
    balanceRatiosWithFee.push(divDown(balances[i].add(amountsIn[i]), balances[i]));
    invariantRatioWithFees = invariantRatioWithFees.add(mulDown(balanceRatiosWithFee[i], normalizedWeights[i]));
  }

  var _computeJoinExactToke = _computeJoinExactTokensInInvariantRatio(balances, normalizedWeights, amountsIn, balanceRatiosWithFee, invariantRatioWithFees, swapFeePercentage),
      invariantRatio = _computeJoinExactToke.invariantRatio,
      swapFees = _computeJoinExactToke.swapFees;

  var lpOut = invariantRatio.gt(ONE$1) ? mulDown(lpTotalSupply, invariantRatio.sub(ONE$1)) : ZERO$1;
  return {
    lpOut: lpOut,
    swapFees: swapFees
  };
}
/**
 * @dev Intermediate function to avoid stack-too-deep "
 */

function _computeJoinExactTokensInInvariantRatio(balances, normalizedWeights, amountsIn, balanceRatiosWithFee, invariantRatioWithFees, swapFeePercentage) {
  // Swap fees are charged on all tokens that are being added in a larger proportion than the overall invariant
  // increase.
  var swapFees = [];
  var invariantRatio = ONE$1;

  for (var i = 0; i < balances.length; i++) {
    var amountInWithoutFee = void 0;

    if (balanceRatiosWithFee[i].gt(invariantRatioWithFees)) {
      var nonTaxableAmount = mulDown(balances[i], invariantRatioWithFees.sub(ONE$1));
      var taxableAmount = amountsIn[i].sub(nonTaxableAmount);
      var swapFee = mulUp(taxableAmount, swapFeePercentage);
      amountInWithoutFee = nonTaxableAmount.add(taxableAmount.sub(swapFee));
      swapFees[i] = swapFee;
    } else {
      amountInWithoutFee = amountsIn[i];
    }

    var balanceRatio = divDown(balances[i].add(amountInWithoutFee), balances[i]);
    invariantRatio = mulDown(invariantRatio, powDown(balanceRatio, normalizedWeights[i]));
  }

  return {
    invariantRatio: invariantRatio,
    swapFees: swapFees
  };
}
function _calcTokenInGivenExactLpOut(balance, normalizedWeight, lpAmountOut, lpTotalSupply, swapFeePercentage) {
  /******************************************************************************************
  // tokenInForExactLpOut                                                                 //
  // a = amountIn                                                                          //
  // b = balance                      /  /    totalBPT + LpOut      \    (1 / w)       \  //
  // LpOut = lpAmountOut   a = b * |  | --------------------------  | ^          - 1  |  //
  // lp = totalBPT                   \  \       totalBPT            /                  /  //
  // w = weight                                                                            //
  ******************************************************************************************/
  // Token in, so we round up overall.
  // Calculate the factor by which the invariant will increase after minting BPTAmountOut
  var invariantRatio = divUp(lpTotalSupply.add(lpAmountOut), lpTotalSupply);
  !invariantRatio.lte(_MAX_INVARIANT_RATIO) ? process.env.NODE_ENV !== "production" ? invariant(false, "MAX_OUT_LP") : invariant(false) : void 0; // Calculate by how much the token balance has to increase to match the invariantRatio

  var balanceRatio = powUp(invariantRatio, divUp(ONE$1, normalizedWeight));
  var amountInWithoutFee = mulUp(balance, balanceRatio.sub(ONE$1)); // We can now compute how much extra balance is being deposited and used in virtual swaps, and charge swap fees
  // accordingly.

  var taxablePercentage = complement(normalizedWeight);
  var taxableAmount = mulUp(amountInWithoutFee, taxablePercentage);
  var nonTaxableAmount = amountInWithoutFee.sub(taxableAmount);
  var taxableAmountPlusFees = divUp(taxableAmount, ONE$1.sub(swapFeePercentage));
  return {
    swapFee: taxableAmountPlusFees.sub(taxableAmount),
    amountIn: nonTaxableAmount.add(taxableAmountPlusFees)
  };
}
function _calcAllTokensInGivenExactLpOut(balances, lpAmountOut, totalBPT) {
  /************************************************************************************
  // tokensInForExactLpOut                                                          //
  // (per token)                                                                     //
  // aI = amountIn                   /   LpOut   \                                  //
  // b = balance           aI = b * | ------------ |                                 //
  // LpOut = lpAmountOut           \  totalBPT  /                                  //
  // lp = totalBPT                                                                  //
  ************************************************************************************/
  // Tokens in, so we round up overall.
  var lpRatio = divUp(lpAmountOut, totalBPT);
  var amountsIn = [];

  for (var i = 0; i < balances.length; i++) {
    amountsIn.push(mulUp(balances[i], lpRatio));
  }

  return amountsIn;
}
function _calcLpInGivenExactTokensOut(balances, normalizedWeights, amountsOut, lpTotalSupply, swapFeePercentage) {
  // BPT in, so we round up overall.
  var balanceRatiosWithoutFee = Array(balances.length);
  var invariantRatioWithoutFees = ZERO$1;

  for (var i = 0; i < balances.length; i++) {
    balanceRatiosWithoutFee[i] = divUp(balances[i].sub(amountsOut[i]), balances[i]);
    invariantRatioWithoutFees = invariantRatioWithoutFees.add(mulUp(balanceRatiosWithoutFee[i], normalizedWeights[i]));
  }

  var _computeExitExactToke = _computeExitExactTokensOutInvariantRatio(balances, normalizedWeights, amountsOut, balanceRatiosWithoutFee, invariantRatioWithoutFees, swapFeePercentage),
      invariantRatio = _computeExitExactToke.invariantRatio,
      swapFees = _computeExitExactToke.swapFees;

  var lpIn = mulUp(lpTotalSupply, complement(invariantRatio));
  return {
    lpIn: lpIn,
    swapFees: swapFees
  };
}
/**
 * @dev Intermediate function to avoid stack-too-deep "
 */

function _computeExitExactTokensOutInvariantRatio(balances, normalizedWeights, amountsOut, balanceRatiosWithoutFee, invariantRatioWithoutFees, swapFeePercentage) {
  var swapFees = Array(balances.length);
  var invariantRatio = ONE$1;

  for (var i = 0; i < balances.length; i++) {
    // Swap fees are typically charged on 'token in', but there is no 'token in' here, so we apply it to
    // 'token out'. This results in slightly larger price impact.
    var amountOutWithFee = void 0;

    if (invariantRatioWithoutFees.gt(balanceRatiosWithoutFee[i])) {
      var nonTaxableAmount = mulDown(balances[i], complement(invariantRatioWithoutFees));
      var taxableAmount = amountsOut[i].sub(nonTaxableAmount);
      var taxableAmountPlusFees = divUp(taxableAmount, ONE$1.sub(swapFeePercentage));
      swapFees[i] = taxableAmountPlusFees.sub(taxableAmount);
      amountOutWithFee = nonTaxableAmount.add(taxableAmountPlusFees);
    } else {
      amountOutWithFee = amountsOut[i];
    }

    var balanceRatio = divDown(balances[i].sub(amountOutWithFee), balances[i]);
    invariantRatio = mulDown(invariantRatio, powDown(balanceRatio, normalizedWeights[i]));
  }

  return {
    invariantRatio: invariantRatio,
    swapFees: swapFees
  };
}
function _calcTokenOutGivenExactLpIn(balance, normalizedWeight, lpAmountIn, lpTotalSupply, swapFeePercentage) {
  /*****************************************************************************************
  // exactBPTInForTokenOut                                                                //
  // a = amountOut                                                                        //
  // b = balance                     /      /    totalBPT - lpIn       \    (1 / w)  \   //
  // lpIn = lpAmountIn    a = b * |  1 - | --------------------------  | ^           |  //
  // lp = totalBPT                  \      \       totalBPT            /             /   //
  // w = weight                                                                           //
  *****************************************************************************************/
  // Token out, so we round down overall. The multiplication rounds down, but the power rounds up (so the base
  // rounds up). Because (totalBPT - lpIn) / totalBPT <= 1, the exponent rounds down.
  // Calculate the factor by which the invariant will decrease after burning BPTAmountIn
  var invariantRatio = divUp(lpTotalSupply.sub(lpAmountIn), lpTotalSupply);
  !(invariantRatio >= _MIN_INVARIANT_RATIO) ? process.env.NODE_ENV !== "production" ? invariant(false, "MIN_LP_IN") : invariant(false) : void 0; // Calculate by how much the token balance has to decrease to match invariantRatio

  var balanceRatio = powUp(invariantRatio, divDown(ONE$1, normalizedWeight)); // Because of rounding up, balanceRatio can be greater than one. Using complement prevents reverts.

  var amountOutWithoutFee = mulDown(balance, complement(balanceRatio)); // We can now compute how much excess balance is being withdrawn as a result of the virtual swaps, which result
  // in swap fees.

  var taxablePercentage = complement(normalizedWeight); // Swap fees are typically charged on 'token in', but there is no 'token in' here, so we apply it
  // to 'token out'. This results in slightly larger price impact. Fees are rounded up.

  var taxableAmount = mulUp(amountOutWithoutFee, taxablePercentage);
  var nonTaxableAmount = amountOutWithoutFee.sub(taxableAmount);
  var swapFee = mulUp(taxableAmount, swapFeePercentage);
  return {
    swapFee: swapFee,
    amountOut: nonTaxableAmount.add(taxableAmount.sub(swapFee))
  };
}
function _calcTokensOutGivenExactLpIn(balances, lpAmountIn, totalBPT) {
  /**********************************************************************************************
  // exactBPTInForTokensOut                                                                    //
  // (per token)                                                                               //
  // aO = amountOut                  /        lpIn         \                                  //
  // b = balance           a0 = b * | ---------------------  |                                 //
  // lpIn = lpAmountIn             \       totalBPT       /                                  //
  // lp = totalBPT                                                                            //
  **********************************************************************************************/
  // Since we're computing an amount out, we round down overall. This means rounding down on both the
  // multiplication and division.
  var lpRatio = divDown(lpAmountIn, totalBPT);
  var amountsOut = [];

  for (var i = 0; i < balances.length; i++) {
    amountsOut.push(mulDown(balances[i], lpRatio));
  }

  return amountsOut;
}
function _calcDueTokenProtocolSwapFeeAmount(balance, normalizedWeight, previousInvariant, currentInvariant, protocolSwapFeePercentage) {
  /*********************************************************************************
  /*  protocolSwapFeePercentage * balanceToken * ( 1 - (previousInvariant / currentInvariant) ^ (1 / weightToken))
  *********************************************************************************/
  if (currentInvariant.lte(previousInvariant)) {
    // This shouldn't happen outside of rounding errors, but have this safeguard nonetheless to prevent the Pool
    // from entering a locked state in which joins and exits revert while computing accumulated swap fees.
    return ZERO$1;
  } // We round down to prevent issues in the Pool's accounting, even if it means paying slightly less in protocol
  // fees to the Vault.
  // Fee percentage and balance multiplications round down, while the subtrahend (power) rounds up (as does the
  // base). Because previousInvariant / currentInvariant <= 1, the exponent rounds down.


  var base = divUp(previousInvariant, currentInvariant);
  var exponent = divDown(ONE$1, normalizedWeight); // Because the exponent is larger than one, the base of the power function has a lower bound. We cap to this
  // value to avoid numeric issues, which means in the extreme case (where the invariant growth is larger than
  // 1 / min exponent) the Pool will pay less in protocol fees than it should.

  base = max(base, MIN_POW_BASE_FREE_EXPONENT);
  var power = powUp(base, exponent);
  var tokenAccruedFees = mulDown(balance, complement(power));
  return mulDown(tokenAccruedFees, protocolSwapFeePercentage);
}

// SPDX-License-Identifier: MIT
var FEE_DENOMINATOR = /*#__PURE__*/BigNumber$1.from(10000000000);
function calculateRemoveLiquidityOneTokenExactIn(self, outIndex, lpAmount, lpSupply, tokenBalances) {
  return _calcTokenOutGivenExactLpIn(tokenBalances[outIndex].mul(self.tokenMultipliers[outIndex]), self.normalizedWeights[outIndex], lpAmount, lpSupply, self.fee);
}
function calculateRemoveLiquidityExactIn(self, lpAmount, lpSupply, tokenBalances) {
  return _calcAllTokensInGivenExactLpOut(_xp(tokenBalances, self.tokenMultipliers), lpAmount, lpSupply);
}
/**
 * Estimate amount of LP token minted or burned at deposit or withdrawal
 */

function calculateTokenAmount(self, amounts, lpSupply, deposit, tokenBalances) {
  var lpTokenAmount = ZERO$1;

  if (deposit) {
    var _calcLpOutGivenExactT = _calcLpOutGivenExactTokensIn(_xp(tokenBalances, self.tokenMultipliers), self.normalizedWeights, _xp(amounts, self.tokenMultipliers), lpSupply, self.fee.mul(1e8)),
        lpOut = _calcLpOutGivenExactT.lpOut;

    lpTokenAmount = lpOut;
  } else {
    var _calcLpInGivenExactTo = _calcLpInGivenExactTokensOut(_xp(tokenBalances, self.tokenMultipliers), self.normalizedWeights, _xp(amounts, self.tokenMultipliers), lpSupply, self.fee.mul(1e8)),
        lpIn = _calcLpInGivenExactTo.lpIn;

    lpTokenAmount = lpIn;
  }

  return lpTokenAmount;
}
function calculateSwapGivenIn(self, inIndex, outIndex, amountIn, tokenBalances) {
  // use in amount with fee alredy deducted
  var amountInWithFee = amountIn.mul(self.tokenMultipliers[inIndex]).mul(FEE_DENOMINATOR.sub(self.fee)); // calculate out amount

  var amountOut = _calcOutGivenIn(tokenBalances[inIndex].mul(self.tokenMultipliers[inIndex]).mul(FEE_DENOMINATOR), self.normalizedWeights[inIndex], tokenBalances[outIndex].mul(self.tokenMultipliers[outIndex]).mul(FEE_DENOMINATOR), self.normalizedWeights[outIndex], amountInWithFee); // downscale out amount


  return amountOut.div(FEE_DENOMINATOR).div(self.tokenMultipliers[outIndex]);
}
function calculateSwapGivenOut(self, inIndex, outIndex, amountOut, tokenBalances) {
  // calculate in amount with upscaled balances
  var amountIn = _calcInGivenOut(tokenBalances[inIndex].mul(self.tokenMultipliers[inIndex]).mul(FEE_DENOMINATOR), self.normalizedWeights[inIndex], tokenBalances[outIndex].mul(self.tokenMultipliers[outIndex]).mul(FEE_DENOMINATOR), self.normalizedWeights[outIndex], amountOut.mul(self.tokenMultipliers[outIndex]).mul(FEE_DENOMINATOR)); // adjust for fee and scale down - rounding up


  return amountIn.div(FEE_DENOMINATOR.sub(self.fee)).div(self.tokenMultipliers[inIndex]).add(1);
}
function _xp(balances, rates) {
  var result = [];

  for (var i = 0; i < balances.length; i++) {
    result.push(rates[i].mul(balances[i]));
  }

  return result;
}

var ZERO$2 = /*#__PURE__*/BigNumber$1.from(0);
var ONE$2 = /*#__PURE__*/BigNumber$1.from(1);
var TWO$1 = /*#__PURE__*/BigNumber$1.from(2);
var TENK = /*#__PURE__*/BigNumber$1.from(10000);

var _256 = /*#__PURE__*/BigNumber$1.from('256');

var _128 = /*#__PURE__*/BigNumber$1.from('128');

var MIN_PRECISION = 32;
var MAX_PRECISION = 127;
var FIXED_1 = /*#__PURE__*/BigNumber$1.from('0x080000000000000000000000000000000');
var FIXED_2 = /*#__PURE__*/BigNumber$1.from('0x100000000000000000000000000000000');
var MAX_NUM = /*#__PURE__*/BigNumber$1.from('0x200000000000000000000000000000000');
var LN2_NUMERATOR = /*#__PURE__*/BigNumber$1.from('0x3f80fe03f80fe03f80fe03f80fe03f8');
var LN2_DENOMINATOR = /*#__PURE__*/BigNumber$1.from('0x5b9de1d10bf4103d647b0955897ba80');
var OPT_LOG_MAX_VAL = /*#__PURE__*/BigNumber$1.from('0x15bf0a8b1457695355fb8ac404e7a79e3');
var OPT_EXP_MAX_VAL = /*#__PURE__*/BigNumber$1.from('0x800000000000000000000000000000000'); // const LAMBERT_CONV_RADIUS = BigNumber.from('0x002f16ac6c59de6f8d5d6f63c1482a7c86')
// const LAMBERT_POS2_SAMPLE = BigNumber.from('0x0003060c183060c183060c183060c18306')
// const LAMBERT_POS2_MAXVAL = BigNumber.from('0x01af16ac6c59de6f8d5d6f63c1482a7c80')
// const LAMBERT_POS3_MAXVAL = BigNumber.from('0x6b22d43e72c326539cceeef8bb48f255ff')
// const MAX_UNF_WEIGHT = BigNumber.from('0x10c6f7a0b5ed8d36b4c7f34938583621fafc8b0079a2834d26fa3fcc9ea9')

var maxExpArray = /*#__PURE__*/new Array(128);
maxExpArray[32] = /*#__PURE__*/BigNumber$1.from('0x1c35fedd14ffffffffffffffffffffffff');
maxExpArray[33] = /*#__PURE__*/BigNumber$1.from('0x1b0ce43b323fffffffffffffffffffffff');
maxExpArray[34] = /*#__PURE__*/BigNumber$1.from('0x19f0028ec1ffffffffffffffffffffffff');
maxExpArray[35] = /*#__PURE__*/BigNumber$1.from('0x18ded91f0e7fffffffffffffffffffffff');
maxExpArray[36] = /*#__PURE__*/BigNumber$1.from('0x17d8ec7f0417ffffffffffffffffffffff');
maxExpArray[37] = /*#__PURE__*/BigNumber$1.from('0x16ddc6556cdbffffffffffffffffffffff');
maxExpArray[38] = /*#__PURE__*/BigNumber$1.from('0x15ecf52776a1ffffffffffffffffffffff');
maxExpArray[39] = /*#__PURE__*/BigNumber$1.from('0x15060c256cb2ffffffffffffffffffffff');
maxExpArray[40] = /*#__PURE__*/BigNumber$1.from('0x1428a2f98d72ffffffffffffffffffffff');
maxExpArray[41] = /*#__PURE__*/BigNumber$1.from('0x13545598e5c23fffffffffffffffffffff');
maxExpArray[42] = /*#__PURE__*/BigNumber$1.from('0x1288c4161ce1dfffffffffffffffffffff');
maxExpArray[43] = /*#__PURE__*/BigNumber$1.from('0x11c592761c666fffffffffffffffffffff');
maxExpArray[44] = /*#__PURE__*/BigNumber$1.from('0x110a688680a757ffffffffffffffffffff');
maxExpArray[45] = /*#__PURE__*/BigNumber$1.from('0x1056f1b5bedf77ffffffffffffffffffff');
maxExpArray[46] = /*#__PURE__*/BigNumber$1.from('0x0faadceceeff8bffffffffffffffffffff');
maxExpArray[47] = /*#__PURE__*/BigNumber$1.from('0x0f05dc6b27edadffffffffffffffffffff');
maxExpArray[48] = /*#__PURE__*/BigNumber$1.from('0x0e67a5a25da4107fffffffffffffffffff');
maxExpArray[49] = /*#__PURE__*/BigNumber$1.from('0x0dcff115b14eedffffffffffffffffffff');
maxExpArray[50] = /*#__PURE__*/BigNumber$1.from('0x0d3e7a392431239fffffffffffffffffff');
maxExpArray[51] = /*#__PURE__*/BigNumber$1.from('0x0cb2ff529eb71e4fffffffffffffffffff');
maxExpArray[52] = /*#__PURE__*/BigNumber$1.from('0x0c2d415c3db974afffffffffffffffffff');
maxExpArray[53] = /*#__PURE__*/BigNumber$1.from('0x0bad03e7d883f69bffffffffffffffffff');
maxExpArray[54] = /*#__PURE__*/BigNumber$1.from('0x0b320d03b2c343d5ffffffffffffffffff');
maxExpArray[55] = /*#__PURE__*/BigNumber$1.from('0x0abc25204e02828dffffffffffffffffff');
maxExpArray[56] = /*#__PURE__*/BigNumber$1.from('0x0a4b16f74ee4bb207fffffffffffffffff');
maxExpArray[57] = /*#__PURE__*/BigNumber$1.from('0x09deaf736ac1f569ffffffffffffffffff');
maxExpArray[58] = /*#__PURE__*/BigNumber$1.from('0x0976bd9952c7aa957fffffffffffffffff');
maxExpArray[59] = /*#__PURE__*/BigNumber$1.from('0x09131271922eaa606fffffffffffffffff');
maxExpArray[60] = /*#__PURE__*/BigNumber$1.from('0x08b380f3558668c46fffffffffffffffff');
maxExpArray[61] = /*#__PURE__*/BigNumber$1.from('0x0857ddf0117efa215bffffffffffffffff');
maxExpArray[62] = /*#__PURE__*/BigNumber$1.from('0x07ffffffffffffffffffffffffffffffff');
maxExpArray[63] = /*#__PURE__*/BigNumber$1.from('0x07abbf6f6abb9d087fffffffffffffffff');
maxExpArray[64] = /*#__PURE__*/BigNumber$1.from('0x075af62cbac95f7dfa7fffffffffffffff');
maxExpArray[65] = /*#__PURE__*/BigNumber$1.from('0x070d7fb7452e187ac13fffffffffffffff');
maxExpArray[66] = /*#__PURE__*/BigNumber$1.from('0x06c3390ecc8af379295fffffffffffffff');
maxExpArray[67] = /*#__PURE__*/BigNumber$1.from('0x067c00a3b07ffc01fd6fffffffffffffff');
maxExpArray[68] = /*#__PURE__*/BigNumber$1.from('0x0637b647c39cbb9d3d27ffffffffffffff');
maxExpArray[69] = /*#__PURE__*/BigNumber$1.from('0x05f63b1fc104dbd39587ffffffffffffff');
maxExpArray[70] = /*#__PURE__*/BigNumber$1.from('0x05b771955b36e12f7235ffffffffffffff');
maxExpArray[71] = /*#__PURE__*/BigNumber$1.from('0x057b3d49dda84556d6f6ffffffffffffff');
maxExpArray[72] = /*#__PURE__*/BigNumber$1.from('0x054183095b2c8ececf30ffffffffffffff');
maxExpArray[73] = /*#__PURE__*/BigNumber$1.from('0x050a28be635ca2b888f77fffffffffffff');
maxExpArray[74] = /*#__PURE__*/BigNumber$1.from('0x04d5156639708c9db33c3fffffffffffff');
maxExpArray[75] = /*#__PURE__*/BigNumber$1.from('0x04a23105873875bd52dfdfffffffffffff');
maxExpArray[76] = /*#__PURE__*/BigNumber$1.from('0x0471649d87199aa990756fffffffffffff');
maxExpArray[77] = /*#__PURE__*/BigNumber$1.from('0x04429a21a029d4c1457cfbffffffffffff');
maxExpArray[78] = /*#__PURE__*/BigNumber$1.from('0x0415bc6d6fb7dd71af2cb3ffffffffffff');
maxExpArray[79] = /*#__PURE__*/BigNumber$1.from('0x03eab73b3bbfe282243ce1ffffffffffff');
maxExpArray[80] = /*#__PURE__*/BigNumber$1.from('0x03c1771ac9fb6b4c18e229ffffffffffff');
maxExpArray[81] = /*#__PURE__*/BigNumber$1.from('0x0399e96897690418f785257fffffffffff');
maxExpArray[82] = /*#__PURE__*/BigNumber$1.from('0x0373fc456c53bb779bf0ea9fffffffffff');
maxExpArray[83] = /*#__PURE__*/BigNumber$1.from('0x034f9e8e490c48e67e6ab8bfffffffffff');
maxExpArray[84] = /*#__PURE__*/BigNumber$1.from('0x032cbfd4a7adc790560b3337ffffffffff');
maxExpArray[85] = /*#__PURE__*/BigNumber$1.from('0x030b50570f6e5d2acca94613ffffffffff');
maxExpArray[86] = /*#__PURE__*/BigNumber$1.from('0x02eb40f9f620fda6b56c2861ffffffffff');
maxExpArray[87] = /*#__PURE__*/BigNumber$1.from('0x02cc8340ecb0d0f520a6af58ffffffffff');
maxExpArray[88] = /*#__PURE__*/BigNumber$1.from('0x02af09481380a0a35cf1ba02ffffffffff');
maxExpArray[89] = /*#__PURE__*/BigNumber$1.from('0x0292c5bdd3b92ec810287b1b3fffffffff');
maxExpArray[90] = /*#__PURE__*/BigNumber$1.from('0x0277abdcdab07d5a77ac6d6b9fffffffff');
maxExpArray[91] = /*#__PURE__*/BigNumber$1.from('0x025daf6654b1eaa55fd64df5efffffffff');
maxExpArray[92] = /*#__PURE__*/BigNumber$1.from('0x0244c49c648baa98192dce88b7ffffffff');
maxExpArray[93] = /*#__PURE__*/BigNumber$1.from('0x022ce03cd5619a311b2471268bffffffff');
maxExpArray[94] = /*#__PURE__*/BigNumber$1.from('0x0215f77c045fbe885654a44a0fffffffff');
maxExpArray[95] = /*#__PURE__*/BigNumber$1.from('0x01ffffffffffffffffffffffffffffffff');
maxExpArray[96] = /*#__PURE__*/BigNumber$1.from('0x01eaefdbdaaee7421fc4d3ede5ffffffff');
maxExpArray[97] = /*#__PURE__*/BigNumber$1.from('0x01d6bd8b2eb257df7e8ca57b09bfffffff');
maxExpArray[98] = /*#__PURE__*/BigNumber$1.from('0x01c35fedd14b861eb0443f7f133fffffff');
maxExpArray[99] = /*#__PURE__*/BigNumber$1.from('0x01b0ce43b322bcde4a56e8ada5afffffff');
maxExpArray[100] = /*#__PURE__*/BigNumber$1.from('0x019f0028ec1fff007f5a195a39dfffffff');
maxExpArray[101] = /*#__PURE__*/BigNumber$1.from('0x018ded91f0e72ee74f49b15ba527ffffff');
maxExpArray[102] = /*#__PURE__*/BigNumber$1.from('0x017d8ec7f04136f4e5615fd41a63ffffff');
maxExpArray[103] = /*#__PURE__*/BigNumber$1.from('0x016ddc6556cdb84bdc8d12d22e6fffffff');
maxExpArray[104] = /*#__PURE__*/BigNumber$1.from('0x015ecf52776a1155b5bd8395814f7fffff');
maxExpArray[105] = /*#__PURE__*/BigNumber$1.from('0x015060c256cb23b3b3cc3754cf40ffffff');
maxExpArray[106] = /*#__PURE__*/BigNumber$1.from('0x01428a2f98d728ae223ddab715be3fffff');
maxExpArray[107] = /*#__PURE__*/BigNumber$1.from('0x013545598e5c23276ccf0ede68034fffff');
maxExpArray[108] = /*#__PURE__*/BigNumber$1.from('0x01288c4161ce1d6f54b7f61081194fffff');
maxExpArray[109] = /*#__PURE__*/BigNumber$1.from('0x011c592761c666aa641d5a01a40f17ffff');
maxExpArray[110] = /*#__PURE__*/BigNumber$1.from('0x0110a688680a7530515f3e6e6cfdcdffff');
maxExpArray[111] = /*#__PURE__*/BigNumber$1.from('0x01056f1b5bedf75c6bcb2ce8aed428ffff');
maxExpArray[112] = /*#__PURE__*/BigNumber$1.from('0x00faadceceeff8a0890f3875f008277fff');
maxExpArray[113] = /*#__PURE__*/BigNumber$1.from('0x00f05dc6b27edad306388a600f6ba0bfff');
maxExpArray[114] = /*#__PURE__*/BigNumber$1.from('0x00e67a5a25da41063de1495d5b18cdbfff');
maxExpArray[115] = /*#__PURE__*/BigNumber$1.from('0x00dcff115b14eedde6fc3aa5353f2e4fff');
maxExpArray[116] = /*#__PURE__*/BigNumber$1.from('0x00d3e7a3924312399f9aae2e0f868f8fff');
maxExpArray[117] = /*#__PURE__*/BigNumber$1.from('0x00cb2ff529eb71e41582cccd5a1ee26fff');
maxExpArray[118] = /*#__PURE__*/BigNumber$1.from('0x00c2d415c3db974ab32a51840c0b67edff');
maxExpArray[119] = /*#__PURE__*/BigNumber$1.from('0x00bad03e7d883f69ad5b0a186184e06bff');
maxExpArray[120] = /*#__PURE__*/BigNumber$1.from('0x00b320d03b2c343d4829abd6075f0cc5ff');
maxExpArray[121] = /*#__PURE__*/BigNumber$1.from('0x00abc25204e02828d73c6e80bcdb1a95bf');
maxExpArray[122] = /*#__PURE__*/BigNumber$1.from('0x00a4b16f74ee4bb2040a1ec6c15fbbf2df');
maxExpArray[123] = /*#__PURE__*/BigNumber$1.from('0x009deaf736ac1f569deb1b5ae3f36c130f');
maxExpArray[124] = /*#__PURE__*/BigNumber$1.from('0x00976bd9952c7aa957f5937d790ef65037');
maxExpArray[125] = /*#__PURE__*/BigNumber$1.from('0x009131271922eaa6064b73a22d0bd4f2bf');
maxExpArray[126] = /*#__PURE__*/BigNumber$1.from('0x008b380f3558668c46c91c49a2f8e967b9');
maxExpArray[127] = /*#__PURE__*/BigNumber$1.from('0x00857ddf0117efa215952912839f6473e6');

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
  !_baseN.gt(_baseD) ? process.env.NODE_ENV !== "production" ? invariant(false, "not support _baseN < _baseD") : invariant(false) : void 0;
  !_baseN.lt(MAX_NUM) ? process.env.NODE_ENV !== "production" ? invariant(false) : invariant(false) : void 0;
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
    return [generalExp(signedRightShift(baseLogTimesExp, BigNumber$1.from(MAX_PRECISION - precision)), BigNumber$1.from(precision)), precision];
  }
}
/**
 * @dev computes the largest integer smaller than or equal to the binary logarithm of the input.
 */

function floorLog2(_n) {
  var res = ZERO$2;

  if (_n.lt(_256)) {
    // At most 8 iterations
    while (_n.gt(ONE$2)) {
      _n = signedRightShift(_n, ONE$2);
      res = res.add(ONE$2);
    }
  } else {
    // Exactly 8 iterations
    for (var s = _128; s.gt(ZERO$2); s = signedRightShift(s, ONE$2)) {
      if (_n.gt(leftShift(ONE$2, s))) {
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
  var res = ZERO$2; // If x >= 2, then we compute the integer part of log2(x), which is larger than 0.

  if (x.gte(FIXED_2)) {
    var count = floorLog2(x.div(FIXED_1));
    x = signedRightShift(x, count); // now x < 2

    res = count.mul(FIXED_1);
  } // If x > 1, then we compute the fraction part of log2(x), which is larger than 0.


  if (x.gt(FIXED_1)) {
    for (var i = MAX_PRECISION; i > 0; --i) {
      x = x.mul(x).div(FIXED_1); // now 1 < x < 4

      if (x.gte(FIXED_2)) {
        x = signedRightShift(x, ONE$2); // now 1 < x < 2

        res = res.add(leftShift(ONE$2, BigNumber$1.from(i - 1)));
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
  var res = ZERO$2;
  var y;
  var z;
  var w;

  if (x.gte('0xd3094c70f034de4b96ff7d5b6f99fcd8')) {
    res = res.add(BigNumber$1.from('0x40000000000000000000000000000000'));
    x = x.mul(FIXED_1).div(BigNumber$1.from('0xd3094c70f034de4b96ff7d5b6f99fcd8'));
  } // add 1 / 2^1


  if (x.gte('0xa45af1e1f40c333b3de1db4dd55f29a7')) {
    res = res.add(BigNumber$1.from('0x20000000000000000000000000000000'));
    x = x.mul(FIXED_1).div(BigNumber$1.from('0xa45af1e1f40c333b3de1db4dd55f29a7'));
  } // add 1 / 2^2


  if (x.gte('0x910b022db7ae67ce76b441c27035c6a1')) {
    res = res.add(BigNumber$1.from('0x10000000000000000000000000000000'));
    x = x.mul(FIXED_1).div(BigNumber$1.from('0x910b022db7ae67ce76b441c27035c6a1'));
  } // add 1 / 2^3


  if (x.gte('0x88415abbe9a76bead8d00cf112e4d4a8')) {
    res = res.add(BigNumber$1.from('0x08000000000000000000000000000000'));
    x = x.mul(FIXED_1).div(BigNumber$1.from('0x88415abbe9a76bead8d00cf112e4d4a8'));
  } // add 1 / 2^4


  if (x.gte('0x84102b00893f64c705e841d5d4064bd3')) {
    res = res.add(BigNumber$1.from('0x04000000000000000000000000000000'));
    x = x.mul(FIXED_1).div(BigNumber$1.from('0x84102b00893f64c705e841d5d4064bd3'));
  } // add 1 / 2^5


  if (x.gte('0x8204055aaef1c8bd5c3259f4822735a2')) {
    res = res.add(BigNumber$1.from('0x02000000000000000000000000000000'));
    x = x.mul(FIXED_1).div(BigNumber$1.from('0x8204055aaef1c8bd5c3259f4822735a2'));
  } // add 1 / 2^6


  if (x.gte('0x810100ab00222d861931c15e39b44e99')) {
    res = res.add(BigNumber$1.from('0x01000000000000000000000000000000'));
    x = x.mul(FIXED_1).div(BigNumber$1.from('0x810100ab00222d861931c15e39b44e99'));
  } // add 1 / 2^7


  if (x.gte('0x808040155aabbbe9451521693554f733')) {
    res = res.add(BigNumber$1.from('0x00800000000000000000000000000000'));
    x = x.mul(FIXED_1).div(BigNumber$1.from('0x808040155aabbbe9451521693554f733'));
  } // add 1 / 2^8


  z = y = x.sub(FIXED_1);
  w = y.mul(y).div(FIXED_1);
  res = res.add(z.mul(BigNumber$1.from('0x100000000000000000000000000000000').sub(y)).div(BigNumber$1.from('0x100000000000000000000000000000000')));
  z = z.mul(w).div(FIXED_1); // add y^01 / 01 - y^02 / 02

  res = res.add(z.mul(BigNumber$1.from('0x0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa').sub(y)).div(BigNumber$1.from('0x200000000000000000000000000000000')));
  z = z.mul(w).div(FIXED_1); // add y^03 / 03 - y^04 / 04

  res = res.add(z.mul(BigNumber$1.from('0x099999999999999999999999999999999').sub(y)).div(BigNumber$1.from('0x300000000000000000000000000000000')));
  z = z.mul(w).div(FIXED_1); // add y^05 / 05 - y^06 / 06

  res = res.add(z.mul(BigNumber$1.from('0x092492492492492492492492492492492').sub(y)).div(BigNumber$1.from('0x400000000000000000000000000000000')));
  z = z.mul(w).div(FIXED_1); // add y^07 / 07 - y^08 / 08

  res = res.add(z.mul(BigNumber$1.from('0x08e38e38e38e38e38e38e38e38e38e38e').sub(y)).div(BigNumber$1.from('0x500000000000000000000000000000000')));
  z = z.mul(w).div(FIXED_1); // add y^09 / 09 - y^10 / 10

  res = res.add(z.mul(BigNumber$1.from('0x08ba2e8ba2e8ba2e8ba2e8ba2e8ba2e8b').sub(y)).div(BigNumber$1.from('0x600000000000000000000000000000000')));
  z = z.mul(w).div(FIXED_1); // add y^11 / 11 - y^12 / 12

  res = res.add(z.mul(BigNumber$1.from('0x089d89d89d89d89d89d89d89d89d89d89').sub(y)).div(BigNumber$1.from('0x700000000000000000000000000000000')));
  z = z.mul(w).div(FIXED_1); // add y^13 / 13 - y^14 / 14

  res = res.add(z.mul(BigNumber$1.from('0x088888888888888888888888888888888').sub(y)).div(BigNumber$1.from('0x800000000000000000000000000000000'))); // add y^15 / 15 - y^16 / 16

  return res;
}
function optimalExp(x) {
  var res = ZERO$2;
  var y;
  var z;
  z = y = x.mod(BigNumber$1.from('0x10000000000000000000000000000000')); // get the input modulo 2^(-3)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(BigNumber$1.from('0x10e1b3be415a0000'))); // add y^02 * (20! / 02!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(BigNumber$1.from('0x05a0913f6b1e0000'))); // add y^03 * (20! / 03!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(BigNumber$1.from('0x0168244fdac78000'))); // add y^04 * (20! / 04!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(BigNumber$1.from('0x004807432bc18000'))); // add y^05 * (20! / 05!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(BigNumber$1.from('0x000c0135dca04000'))); // add y^06 * (20! / 06!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(BigNumber$1.from('0x0001b707b1cdc000'))); // add y^07 * (20! / 07!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(BigNumber$1.from('0x000036e0f639b800'))); // add y^08 * (20! / 08!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(BigNumber$1.from('0x00000618fee9f800'))); // add y^09 * (20! / 09!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(BigNumber$1.from('0x0000009c197dcc00'))); // add y^10 * (20! / 10!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(BigNumber$1.from('0x0000000e30dce400'))); // add y^11 * (20! / 11!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(BigNumber$1.from('0x000000012ebd1300'))); // add y^12 * (20! / 12!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(BigNumber$1.from('0x0000000017499f00'))); // add y^13 * (20! / 13!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(BigNumber$1.from('0x0000000001a9d480'))); // add y^14 * (20! / 14!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(BigNumber$1.from('0x00000000001c6380'))); // add y^15 * (20! / 15!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(BigNumber$1.from('0x000000000001c638'))); // add y^16 * (20! / 16!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(BigNumber$1.from('0x0000000000001ab8'))); // add y^17 * (20! / 17!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(BigNumber$1.from('0x000000000000017c'))); // add y^18 * (20! / 18!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(BigNumber$1.from('0x0000000000000014'))); // add y^19 * (20! / 19!)

  z = z.mul(y).div(FIXED_1);
  res = res.add(z.mul(BigNumber$1.from('0x0000000000000001'))); // add y^20 * (20! / 20!)

  res = res.div(BigNumber$1.from('0x21c3677c82b40000')).add(y).add(FIXED_1); // divide by 20! and then add y^1 / 1! + y^0 / 0!

  if (!x.and(BigNumber$1.from('0x010000000000000000000000000000000')).isZero()) res = res.mul(BigNumber$1.from('0x1c3d6a24ed82218787d624d3e5eba95f9')).div(BigNumber$1.from('0x18ebef9eac820ae8682b9793ac6d1e776')); // multiply by e^2^(-3)

  if (!x.and(BigNumber$1.from('0x020000000000000000000000000000000')).isZero()) res = res.mul(BigNumber$1.from('0x18ebef9eac820ae8682b9793ac6d1e778')).div(BigNumber$1.from('0x1368b2fc6f9609fe7aceb46aa619baed4')); // multiply by e^2^(-2)

  if (!x.and(BigNumber$1.from('0x040000000000000000000000000000000')).isZero()) res = res.mul(BigNumber$1.from('0x1368b2fc6f9609fe7aceb46aa619baed5')).div(BigNumber$1.from('0x0bc5ab1b16779be3575bd8f0520a9f21f')); // multiply by e^2^(-1)

  if (!x.and(BigNumber$1.from('0x080000000000000000000000000000000')).isZero()) res = res.mul(BigNumber$1.from('0x0bc5ab1b16779be3575bd8f0520a9f21e')).div(BigNumber$1.from('0x0454aaa8efe072e7f6ddbab84b40a55c9')); // multiply by e^2^(+0)

  if (!x.and(BigNumber$1.from('0x100000000000000000000000000000000')).isZero()) res = res.mul(BigNumber$1.from('0x0454aaa8efe072e7f6ddbab84b40a55c5')).div(BigNumber$1.from('0x00960aadc109e7a3bf4578099615711ea')); // multiply by e^2^(+1)

  if (!x.and(BigNumber$1.from('0x200000000000000000000000000000000')).isZero()) res = res.mul(BigNumber$1.from('0x00960aadc109e7a3bf4578099615711d7')).div(BigNumber$1.from('0x0002bf84208204f5977f9a8cf01fdce3d')); // multiply by e^2^(+2)

  if (!x.and(BigNumber$1.from('0x400000000000000000000000000000000')).isZero()) res = res.mul(BigNumber$1.from('0x0002bf84208204f5977f9a8cf01fdc307')).div(BigNumber$1.from('0x0000003c6ab775dd0b95b4cbee7e65d11')); // multiply by e^2^(+3)

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
  var res = ZERO$2;
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

  return res.div(BigNumber$1.from('0x688589cc0e9505e2f2fee5580000000')).add(_x).add(leftShift(ONE$2, _precision)); // divide by 33! and then add x^1 / 1! + x^0 / 0!
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
   process.env.NODE_ENV !== "production" ? invariant(false) : invariant(false) ;
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
  !amountIn.gt(ZERO$2) ? process.env.NODE_ENV !== "production" ? invariant(false, "RequiemFormula: INSUFFICIENT_INPUT_AMOUNT") : invariant(false) : void 0; // if (amountIn.lte(ZERO) || amountIn.eq(ZERO))
  //     return ZERO

  !(reserveIn.gt(ZERO$2) && reserveOut.gt(ZERO$2)) ? process.env.NODE_ENV !== "production" ? invariant(false, "RequiemFormula: INSUFFICIENT_LIQUIDITY") : invariant(false) : void 0;
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
  var temp2 = leftShift(reserveOut, BigNumber$1.from(precision));
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
  !amountOut.gt(ZERO$2) ? process.env.NODE_ENV !== "production" ? invariant(false, "RequiemFormula: INSUFFICIENT_OUTPUT_AMOUNT") : invariant(false) : void 0; // if (amountOut.gte(ZERO) || amountOut.eq(ZERO))
  //     return ZERO

  !(reserveIn.gt(ZERO$2) && reserveOut.gt(ZERO$2)) ? process.env.NODE_ENV !== "production" ? invariant(false, "RequiemFormula: INSUFFICIENT_LIQUIDITY") : invariant(false) : void 0; // special case for equal weights

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
  var temp2 = leftShift(baseReserveIn, BigNumber$1.from(precision));
  return signedRightShift(temp1.sub(temp2), BigNumber$1.from(precision)).div(TENK.sub(swapFee)).add(1);
}

var WeightedSwapStorage = /*#__PURE__*/function () {
  function WeightedSwapStorage(tokenMultipliers, normalizedWeights, fee, adminFee) {
    this.tokenMultipliers = tokenMultipliers;
    this.normalizedWeights = normalizedWeights;
    this.fee = fee;
    this.adminFee = adminFee;
  }

  WeightedSwapStorage.mock = function mock() {
    return new WeightedSwapStorage([ZERO$1], [ZERO$1], ZERO$1, ZERO$1);
  };

  return WeightedSwapStorage;
}();

var StableSwapStorage = /*#__PURE__*/function () {
  function StableSwapStorage(tokenMultipliers, fee, adminFee, initialA, futureA, initialATime, futureATime, lpAddress) {
    this.lpAddress = lpAddress;
    this.tokenMultipliers = tokenMultipliers;
    this.fee = fee;
    this.adminFee = adminFee;
    this.initialA = initialA;
    this.futureA = futureA;
    this.initialATime = initialATime;
    this.futureATime = futureATime;
  }

  StableSwapStorage.mock = function mock() {
    var dummy = BigNumber.from(0);
    return new StableSwapStorage([dummy], dummy, dummy, dummy, dummy, dummy, dummy, '');
  };

  return StableSwapStorage;
}();

/**
  * A class that contains relevant stablePool information
  * It is mainly designed to save the map between the indices
  * and actual tokens in the pool and access the swap with addresses
  * instead of the index
  */

var Pool = /*#__PURE__*/function () {
  function Pool() {}

  var _proto = Pool.prototype;

  // public constructor(
  //     tokens: Token[],
  //     tokenBalances: BigNumber[]
  // ) {
  //     this.tokens = tokens
  //     this.tokenBalances = tokenBalances
  // }

  /**
   * Returns true if the token is either token0 or token1
   * @param token to check
   */
  _proto.involvesToken = function involvesToken(token) {
    var res = false;

    for (var i = 0; i < Object.keys(this.tokens).length; i++) {
       token.equals(this.tokens[i]);
    }

    return res;
  } // maps the index to the token in the stablePool
  ;

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
  } // public getOutputAmount(inputAmount: TokenAmount, tokenOut: Token): TokenAmount {
  //     const swap = this.calculateSwapGivenIn(inputAmount.token, tokenOut, inputAmount.raw)
  //     return new TokenAmount(tokenOut, swap.toBigInt())
  // }
  // public getInputAmount(outputAmount: TokenAmount, tokenIn: Token): TokenAmount {
  //     const swap = this.calculateSwapGivenOut(tokenIn, outputAmount.token, outputAmount.toBigNumber())
  //     return new TokenAmount(tokenIn, swap.toBigInt())
  // }

  /**
   * Returns the chain ID of the tokens in the pair.
   */
  ;

  _proto.token = function token(index) {
    return this.tokens[index];
  };

  _proto.reserveOf = function reserveOf(token) {
    !this.involvesToken(token) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;

    for (var i = 0; i < Object.keys(this.tokens).length; i++) {
      if (token.equals(this.tokens[i])) return this.tokenBalances[i];
    }

    return BigNumber.from(0);
  };

  // public getLiquidityValue(outIndex: number, userBalances: BigNumber[]): TokenAmount {
  //     let amount = BigNumber.from(0)
  //     for (let i = 0; i < userBalances.length; i++) {
  //         if (i !== outIndex)
  //             amount = amount.add(this.calculateSwapGivenIn(this.tokens[i], this.tokens[outIndex], userBalances[i]))
  //     }
  //     amount = amount.add(userBalances[outIndex])
  //     return new TokenAmount(this.tokens[outIndex], amount.toBigInt())
  // }
  _proto.setBalanceValueByIndex = function setBalanceValueByIndex(index, newBalance) {
    this.tokenBalances[index] = newBalance;
  };

  _proto.getTokenAmounts = function getTokenAmounts() {
    var _this2 = this;

    return this.tokens.map(function (t, i) {
      return new TokenAmount(t, _this2.tokenBalances[i]);
    });
  };

  _proto.setTokenBalances = function setTokenBalances(tokenBalances) {
    this.tokenBalances = tokenBalances;
  };

  _proto.subtractBalanceValue = function subtractBalanceValue(tokenAmount) {
    var newBalances = []; // safe way for replacement

    for (var i = 0; i < this.tokenBalances.length; i++) {
      newBalances.push(this.indexFromToken(tokenAmount.token) === i ? this.tokenBalances[i].sub(tokenAmount.toBigNumber()) : this.tokenBalances[i]);
    }

    this.setTokenBalances(newBalances);
  };

  _createClass(Pool, [{
    key: "chainId",
    get: function get() {
      return this.tokens[0].chainId;
    }
  }, {
    key: "name",
    get: function get() {
      return this._name;
    },
    set: function set(value) {
      this._name = value;
    }
  }]);

  return Pool;
}();
var PoolType;

(function (PoolType) {
  PoolType["Pair"] = "Pair";
  PoolType["StablePairWrapper"] = "StablePairWrapper";
  PoolType["AmplifiedWeightedPair"] = "AmplifiedWeightedPair";
  PoolType["PoolPairWrapper"] = "PoolPairWrapper";
})(PoolType || (PoolType = {}));

var _PAIR_HASH;

var _100$1 = /*#__PURE__*/BigNumber$1.from(100);

var PAIR_ADDRESS_CACHE = {};
var PAIR_HASH = (_PAIR_HASH = {}, _PAIR_HASH[ChainId.AVAX_TESTNET] = '0x9054fb12bf026c7ef2c6d1f68fbbead8f68cdbfa477faca7f9d8ec63173f87ff', _PAIR_HASH[ChainId.BSC_MAINNET] = '0x623d9ad8b6787321d0dff55d4f864a7cfdedfb1802a561c75cd01c62a079bc84', _PAIR_HASH[ChainId.AVAX_MAINNET] = '0x623d9ad8b6787321d0dff55d4f864a7cfdedfb1802a561c75cd01c62a079bc84', _PAIR_HASH[ChainId.OASIS_MAINNET] = '0x623d9ad8b6787321d0dff55d4f864a7cfdedfb1802a561c75cd01c62a079bc84', _PAIR_HASH[ChainId.OASIS_TESTNET] = '0x623d9ad8b6787321d0dff55d4f864a7cfdedfb1802a561c75cd01c62a079bc84', _PAIR_HASH[ChainId.BSC_TESTNET] = '0x623d9ad8b6787321d0dff55d4f864a7cfdedfb1802a561c75cd01c62a079bc84', _PAIR_HASH[ChainId.MATIC_MAINNET] = '0x623d9ad8b6787321d0dff55d4f864a7cfdedfb1802a561c75cd01c62a079bc84', _PAIR_HASH[ChainId.MATIC_TESTNET] = '0x623d9ad8b6787321d0dff55d4f864a7cfdedfb1802a561c75cd01c62a079bc84', _PAIR_HASH[ChainId.QUARKCHAIN_DEV_S0] = '0x623d9ad8b6787321d0dff55d4f864a7cfdedfb1802a561c75cd01c62a079bc84', _PAIR_HASH[ChainId.ARBITRUM_TETSNET_RINKEBY] = '0x623d9ad8b6787321d0dff55d4f864a7cfdedfb1802a561c75cd01c62a079bc84', _PAIR_HASH[ChainId.ARBITRUM_MAINNET] = '0x623d9ad8b6787321d0dff55d4f864a7cfdedfb1802a561c75cd01c62a079bc84', _PAIR_HASH);
var AmplifiedWeightedPair = /*#__PURE__*/function (_Pool) {
  _inheritsLoose(AmplifiedWeightedPair, _Pool);

  function AmplifiedWeightedPair(tokens, tokenBalances, virtualReserves, weightA, fee, amp, address) {
    var _this;

    _this = _Pool.call(this) || this;
    _this.tokenBalances = tokens[0].sortsBefore(tokens[1]) // does safety checks
    ? tokenBalances : [tokenBalances[1], tokenBalances[0]];
    _this.tokens = tokens[0].sortsBefore(tokens[1]) // does safety checks
    ? tokens : [tokens[1], tokens[0]];
    _this.ampBPS = amp;
    _this.weights = tokens[0].sortsBefore(tokens[1]) // does safety checks
    ? [weightA, _100$1.sub(weightA)] : [_100$1.sub(weightA), weightA];
    _this.virtualReserves = tokens[0].sortsBefore(tokens[1]) // does safety checks
    ? virtualReserves : [virtualReserves[1], virtualReserves[0]];
    _this.fee = fee;
    _this.liquidityToken = new Token(tokens[0].chainId, address ? ethers.utils.getAddress(address) : AmplifiedWeightedPair.getAddress(_this.tokens[0], _this.tokens[1], _this.weights[0]), 18, 'Requiem-LP', 'Requiem LPs');
    _this.type = PoolType.AmplifiedWeightedPair;
    _this.address = !address ? AmplifiedWeightedPair.getAddress(_this.token0, _this.token1, _this.weight0) : address;
    _this._name = tokens.map(function (t) {
      return t.symbol;
    }).join('-');
    return _this;
  }

  AmplifiedWeightedPair.getAddress = function getAddress(tokenA, tokenB, weightA) {
    var _PAIR_ADDRESS_CACHE, _PAIR_ADDRESS_CACHE$t, _PAIR_ADDRESS_CACHE$t2;

    var tokens = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]; // does safety checks

    var weights = tokenA.sortsBefore(tokenB) ? [weightA.toString(), _100$1.sub(weightA).toString()] : [_100$1.sub(weightA).toString(), weightA.toString()]; // does safety checks

    if (((_PAIR_ADDRESS_CACHE = PAIR_ADDRESS_CACHE) === null || _PAIR_ADDRESS_CACHE === void 0 ? void 0 : (_PAIR_ADDRESS_CACHE$t = _PAIR_ADDRESS_CACHE[tokens[0].address]) === null || _PAIR_ADDRESS_CACHE$t === void 0 ? void 0 : (_PAIR_ADDRESS_CACHE$t2 = _PAIR_ADDRESS_CACHE$t[tokens[1].address]) === null || _PAIR_ADDRESS_CACHE$t2 === void 0 ? void 0 : _PAIR_ADDRESS_CACHE$t2["" + weights[0]]) === undefined) {
      var _PAIR_ADDRESS_CACHE2, _PAIR_ADDRESS_CACHE3, _PAIR_ADDRESS_CACHE3$, _extends2, _extends3, _extends4;

      PAIR_ADDRESS_CACHE = _extends({}, PAIR_ADDRESS_CACHE, (_extends4 = {}, _extends4[tokens[0].address] = _extends({}, (_PAIR_ADDRESS_CACHE2 = PAIR_ADDRESS_CACHE) === null || _PAIR_ADDRESS_CACHE2 === void 0 ? void 0 : _PAIR_ADDRESS_CACHE2[tokens[0].address], (_extends3 = {}, _extends3[tokens[1].address] = _extends({}, (_PAIR_ADDRESS_CACHE3 = PAIR_ADDRESS_CACHE) === null || _PAIR_ADDRESS_CACHE3 === void 0 ? void 0 : (_PAIR_ADDRESS_CACHE3$ = _PAIR_ADDRESS_CACHE3[tokens[0].address]) === null || _PAIR_ADDRESS_CACHE3$ === void 0 ? void 0 : _PAIR_ADDRESS_CACHE3$[tokens[1].address], (_extends2 = {}, _extends2["" + weights[0]] = getCreate2Address(FACTORY_ADDRESS[tokens[0].chainId], keccak256(['bytes'], [pack(['address', 'address', 'uint32'], [tokens[0].address, tokens[1].address, weights[0]])]), PAIR_HASH[tokens[0].chainId]), _extends2)), _extends3)), _extends4));
    }

    return PAIR_ADDRESS_CACHE[tokens[0].address][tokens[1].address]["" + weights[0]];
  };

  AmplifiedWeightedPair.fromBigIntish = function fromBigIntish(tokens, tokenBalances, virtualReserves, weightA, fee, amp, address) {
    return new AmplifiedWeightedPair(tokens, tokenBalances.map(function (b) {
      return BigNumber$1.from(b);
    }), virtualReserves.map(function (b) {
      return BigNumber$1.from(b);
    }), BigNumber$1.from(weightA), BigNumber$1.from(fee), BigNumber$1.from(amp), address);
  };

  var _proto = AmplifiedWeightedPair.prototype;

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
  };

  _proto.poolPrice = function poolPrice(tokenIn, _) {
    return tokenIn.equals(this.token0) ? this.token0Price : this.token1Price;
  };

  _proto.poolPriceBases = function poolPriceBases(tokenIn, _) {
    if (tokenIn.equals(this.token0)) {
      return {
        priceBaseIn: this.tokenBalances[0].mul(this.weights[1]),
        priceBaseOut: this.tokenBalances[1].mul(this.weights[0])
      };
    } else {
      return {
        priceBaseIn: this.tokenBalances[1].mul(this.weights[0]),
        priceBaseOut: this.tokenBalances[0].mul(this.weights[1])
      };
    }
  }
  /**
   * Return the price of the given token in terms of the other token in the pair.
   * @param token token to return price of
   */
  ;

  _proto.priceOf = function priceOf(token) {
    !this.involvesToken(token) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
    return token.equals(this.token0) ? this.token0Price : this.token1Price;
  }
  /**
   * Returns the chain ID of the tokens in the pair.
   */
  ;

  _proto.reserveOf = function reserveOf(token) {
    !this.involvesToken(token) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
    return token.equals(this.token0) ? this.reserve0.raw : this.reserve1.raw;
  };

  _proto.virtualReserveOf = function virtualReserveOf(token) {
    !this.involvesToken(token) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
    return token.equals(this.token0) ? this.virtualReserve0.raw : this.virtualReserve1.raw;
  };

  _proto.weightOf = function weightOf(token) {
    !this.involvesToken(token) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
    return token.equals(this.token0) ? this.weight0 : this.weight1;
  };

  _proto.getLiquidityMinted = function getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB) {
    !totalSupply.token.equals(this.liquidityToken) ? process.env.NODE_ENV !== "production" ? invariant(false, 'LIQUIDITY') : invariant(false) : void 0;
    var tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
    ? [tokenAmountA, tokenAmountB] : [tokenAmountB, tokenAmountA];
    !(tokenAmounts[0].token.equals(this.token0) && tokenAmounts[1].token.equals(this.token1)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
    var liquidity;

    if (totalSupply.raw.eq(ZERO)) {
      liquidity = sqrt(tokenAmounts[0].raw.mul(tokenAmounts[1].raw)).sub(MINIMUM_LIQUIDITY);
    } else {
      var amount0 = tokenAmounts[0].raw.mul(totalSupply.raw).div(this.reserve0.raw);
      var amount1 = tokenAmounts[1].raw.mul(totalSupply.raw).div(this.reserve1.raw);
      liquidity = amount0.lte(amount1) ? amount0 : amount1;
    }

    if (!liquidity.gt(ZERO)) {
      throw new InsufficientInputAmountError();
    }

    return new TokenAmount(this.liquidityToken, liquidity);
  };

  _proto.getLiquidityValue = function getLiquidityValue(token, totalSupply, liquidity, feeOn, kLast) {
    if (feeOn === void 0) {
      feeOn = false;
    }

    !this.involvesToken(token) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
    !totalSupply.token.equals(this.liquidityToken) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOTAL_SUPPLY') : invariant(false) : void 0;
    !liquidity.token.equals(this.liquidityToken) ? process.env.NODE_ENV !== "production" ? invariant(false, 'LIQUIDITY') : invariant(false) : void 0;
    !liquidity.raw.lte(totalSupply.raw) ? process.env.NODE_ENV !== "production" ? invariant(false, 'LIQUIDITY') : invariant(false) : void 0;
    var totalSupplyAdjusted;

    if (!feeOn) {
      totalSupplyAdjusted = totalSupply;
    } else {
      !!!kLast ? process.env.NODE_ENV !== "production" ? invariant(false, 'K_LAST') : invariant(false) : void 0;
      var kLastParsed = parseBigintIsh(kLast);

      if (!kLastParsed.eq(ZERO)) {
        var rootK = sqrt(this.reserve0.raw.mul(this.reserve1.raw));
        var rootKLast = sqrt(kLastParsed);

        if (rootK.gt(rootKLast)) {
          var numerator = totalSupply.raw.mul(rootK.sub(rootKLast));
          var denominator = rootK.mul(FIVE).add(rootKLast);
          var feeLiquidity = numerator.div(denominator);
          totalSupplyAdjusted = totalSupply.add(new TokenAmount(this.liquidityToken, feeLiquidity));
        } else {
          totalSupplyAdjusted = totalSupply;
        }
      } else {
        totalSupplyAdjusted = totalSupply;
      }
    }

    return new TokenAmount(token, liquidity.raw.mul(this.reserveOf(token)).div(totalSupplyAdjusted.raw));
  };

  _proto.clone = function clone() {
    return new AmplifiedWeightedPair(this.tokens, this.tokenBalances, this.virtualReserves, this.weight0, this.fee, this.ampBPS);
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
    !this.involvesToken(token) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
    return token.equals(this.token0) ? this.token0PriceRaw : this.token1PriceRaw;
  } // calculates the swap output amount without
  // pinging the blockchain for data
  ;

  _proto.calculateSwapGivenIn = function calculateSwapGivenIn(tokenIn, tokenOut, inAmount) {
    var inputReserve = this.virtualReserveOf(tokenIn);
    var outputReserve = this.virtualReserveOf(tokenOut);
    var inputWeight = this.weightOf(tokenIn);
    var outputWeight = this.weightOf(tokenOut);
    return getAmountOut(inAmount, inputReserve, outputReserve, inputWeight, outputWeight, this.fee);
  } // calculates the swap output amount without
  // pinging the blockchain for data
  ;

  _proto.calculateSwapGivenOut = function calculateSwapGivenOut(tokenIn, tokenOut, outAmount) {
    if (this.reserve0.raw.eq(ZERO) || this.reserve1.raw.eq(ZERO) || outAmount.gte(this.reserveOf(tokenOut))) {
      throw new InsufficientReservesError();
    }

    var outputReserve = this.virtualReserveOf(tokenOut);
    var inputReserve = this.virtualReserveOf(tokenIn);
    var outputWeight = this.weightOf(tokenOut);
    var inputWeight = this.weightOf(tokenIn);
    return getAmountIn(outAmount, inputReserve, outputReserve, inputWeight, outputWeight, this.fee);
  };

  _proto.getOutputAmount = function getOutputAmount(inputAmount) {
    !this.involvesToken(inputAmount.token) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;

    if (this.reserve0.raw.eq(ZERO) || this.reserve1.raw.eq(ZERO)) {
      throw new InsufficientReservesError();
    }

    var inputReserve = this.virtualReserveOf(inputAmount.token);
    var outputReserve = this.virtualReserveOf(inputAmount.token.equals(this.token0) ? this.token1 : this.token0);
    var inputWeight = this.weightOf(inputAmount.token);
    var outputWeight = this.weightOf(inputAmount.token.equals(this.token0) ? this.token1 : this.token0);
    var outputAmount = new TokenAmount(inputAmount.token.equals(this.token0) ? this.token1 : this.token0, getAmountOut(inputAmount.toBigNumber(), inputReserve, outputReserve, inputWeight, outputWeight, this.fee)); // console.log("OA", outputAmount.raw.toString())

    if (outputAmount.raw.eq(ZERO)) {
      throw new InsufficientInputAmountError();
    }

    return [outputAmount, new AmplifiedWeightedPair([inputAmount.token, inputAmount.token.equals(this.token0) ? this.token1 : this.token0], // tokens
    [this.reserveOf(inputAmount.token).add(inputAmount.raw), this.reserveOf(outputAmount.token).sub(outputAmount.raw)], // reserves
    [inputReserve.add(inputAmount.raw), outputReserve.sub(outputAmount.raw)], // virtual reserves
    inputWeight, this.ampBPS, this.fee)];
  };

  _proto.getInputAmount = function getInputAmount(outputAmount) {
    !this.involvesToken(outputAmount.token) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;
    console.log("-- this 0", this.reserve0.raw, "1", this.reserve1.raw, "out", outputAmount.raw);

    if (this.reserve0.raw.eq(ZERO) || this.reserve1.raw.eq(ZERO) || outputAmount.raw.gte(this.reserveOf(outputAmount.token))) {
      throw new Error("insufficcient reserves");
    }

    var outputReserve = this.virtualReserveOf(outputAmount.token);
    var inputReserve = this.virtualReserveOf(outputAmount.token.equals(this.token0) ? this.token1 : this.token0);
    var outputWeight = this.weightOf(outputAmount.token);
    var inputWeight = this.weightOf(outputAmount.token.equals(this.token0) ? this.token1 : this.token0);
    var inputAmount = new TokenAmount(outputAmount.token.equals(this.token0) ? this.token1 : this.token0, getAmountIn(outputAmount.toBigNumber(), inputReserve, outputReserve, inputWeight, outputWeight, this.fee));
    return [inputAmount, new AmplifiedWeightedPair([inputAmount.token, outputAmount.token], [this.reserveOf(inputAmount.token).add(inputAmount.raw), this.reserveOf(outputAmount.token).sub(outputAmount.raw)], [inputReserve.add(inputAmount.raw), outputReserve.sub(outputAmount.raw)], inputWeight, this.ampBPS, this.fee)];
  };

  _createClass(AmplifiedWeightedPair, [{
    key: "amp",
    get: function get() {
      return this.ampBPS;
    }
    /**
     * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
     */

  }, {
    key: "token0Price",
    get: function get() {
      return new Price(this.token0, this.token1, this.tokenBalances[0].mul(this.weights[1]), this.tokenBalances[1].mul(this.weights[0]));
    }
    /**
     * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
     */

  }, {
    key: "token1Price",
    get: function get() {
      return new Price(this.token1, this.token0, this.tokenBalances[1].mul(this.weights[0]), this.tokenBalances[0].mul(this.weights[1]));
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
      return this.tokens[0];
    }
  }, {
    key: "token1",
    get: function get() {
      return this.tokens[1];
    }
  }, {
    key: "reserve0",
    get: function get() {
      return new TokenAmount(this.tokens[0], this.tokenBalances[0]);
    }
  }, {
    key: "reserve1",
    get: function get() {
      return new TokenAmount(this.tokens[1], this.tokenBalances[1]);
    }
  }, {
    key: "virtualReserve0",
    get: function get() {
      return new TokenAmount(this.tokens[0], this.virtualReserves[0]);
    }
  }, {
    key: "virtualReserve1",
    get: function get() {
      return new TokenAmount(this.tokens[1], this.virtualReserves[1]);
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
      return new Price(this.token0, this.token1, this.tokenBalances[0], this.tokenBalances[1]);
    }
    /**
     * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
     */

  }, {
    key: "token1PriceRaw",
    get: function get() {
      return new Price(this.token1, this.token0, this.tokenBalances[1], this.tokenBalances[0]);
    }
  }]);

  return AmplifiedWeightedPair;
}(Pool);

var weightedPoolABI = [
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
				internalType: "address",
				name: "recipient",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			},
			{
				indexed: false,
				internalType: "uint256[]",
				name: "feeAmounts",
				type: "uint256[]"
			}
		],
		name: "FlashLoan",
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
				indexed: true,
				internalType: "address",
				name: "buyer",
				type: "address"
			},
			{
				indexed: false,
				internalType: "address",
				name: "soldId",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "tokensSold",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "address",
				name: "boughtId",
				type: "address"
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
		name: "POOL_TOKEN_COMMON_DECIMALS",
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
		name: "addLiquidityExactIn",
		outputs: [
			{
				internalType: "uint256",
				name: "mintAmount",
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
				name: "amount",
				type: "uint256"
			}
		],
		name: "calculateRemoveLiquidityExactIn",
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
				internalType: "uint256",
				name: "amount",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "index",
				type: "uint256"
			}
		],
		name: "calculateRemoveLiquidityOneToken",
		outputs: [
			{
				internalType: "uint256",
				name: "amountOut",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "fee",
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
				name: "burnAmount",
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
			{
				internalType: "contract IFlashLoanRecipient",
				name: "recipient",
				type: "address"
			},
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]"
			},
			{
				internalType: "bytes",
				name: "userData",
				type: "bytes"
			}
		],
		name: "flashLoan",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getCollectedFees",
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
		],
		name: "getTokenMultipliers",
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
		name: "getTokenWeights",
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
				internalType: "uint256[]",
				name: "_normalizedWeights",
				type: "uint256[]"
			},
			{
				internalType: "uint256[]",
				name: "_amounts",
				type: "uint256[]"
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
				name: "_fee",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "_flashFee",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "_adminFee",
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
				internalType: "address",
				name: "to",
				type: "address"
			}
		],
		name: "onSwapGivenIn",
		outputs: [
			{
				internalType: "uint256",
				name: "amountOut",
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
				internalType: "address",
				name: "to",
				type: "address"
			}
		],
		name: "onSwapGivenOut",
		outputs: [
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
		name: "removeLiquidityExactIn",
		outputs: [
			{
				internalType: "uint256[]",
				name: "amounts",
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
				name: "maxLpBurn",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			}
		],
		name: "removeLiquidityExactOut",
		outputs: [
			{
				internalType: "uint256",
				name: "burnAmount",
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
				name: "amountReceived",
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
				name: "newFlashFee",
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
			},
			{
				internalType: "address",
				name: "_feeDistributor",
				type: "address"
			}
		],
		name: "setFeeControllerAndDistributor",
		outputs: [
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
				internalType: "contract WeightedLPToken",
				name: "lpToken",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "nTokens",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "lastInvariant",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "fee",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "flashFee",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "adminFee",
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

var WeightedPool = /*#__PURE__*/function (_Pool) {
  _inheritsLoose(WeightedPool, _Pool);

  function WeightedPool(poolAddress, tokens, tokenBalances, swapStorage, lpTotalSupply) {
    var _STABLE_POOL_LP_ADDRE;

    var _this;

    _this = _Pool.call(this) || this;
    _this.tokens = tokens;
    _this.tokenBalances = tokenBalances;
    _this.address = ethers.utils.getAddress(poolAddress);
    _this.lpTotalSupply = lpTotalSupply;
    _this.swapStorage = swapStorage;
    _this.tokens = tokens;
    _this.tokenBalances = tokenBalances;
    _this.liquidityToken = new Token(tokens[0].chainId, (_STABLE_POOL_LP_ADDRE = STABLE_POOL_LP_ADDRESS[tokens[0].chainId]) !== null && _STABLE_POOL_LP_ADDRE !== void 0 ? _STABLE_POOL_LP_ADDRE : '0x0000000000000000000000000000000000000001', 18, 'Requiem-LP', 'Requiem Swap LPs');

    for (var i = 0; i < Object.values(_this.tokens).length; i++) {
      !(tokens[i].address != ethers.constants.AddressZero) ? process.env.NODE_ENV !== "production" ? invariant(false, "invalidTokenAddress") : invariant(false) : void 0;
      !(tokens[i].decimals <= 18) ? process.env.NODE_ENV !== "production" ? invariant(false, "invalidDecimals") : invariant(false) : void 0;
      !(tokens[i].chainId === tokens[0].chainId) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INVALID TOKENS') : invariant(false) : void 0;
    }

    _this._name = 'Weighted Pool';
    return _this;
  }

  WeightedPool.getRouterAddress = function getRouterAddress(chainId) {
    return STABLE_POOL_ADDRESS[chainId];
  };

  WeightedPool.getLpAddress = function getLpAddress(chainId) {
    return STABLE_POOL_LP_ADDRESS[chainId];
  };

  WeightedPool.mock = function mock() {
    return new WeightedPool('', [new Token(1, '0x0000000000000000000000000000000000000001', 6, 'Mock USDC', 'MUSDC')], [ZERO$1], WeightedSwapStorage.mock(), ZERO$1);
  };

  var _proto = WeightedPool.prototype;

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
  } // maps the index to the token in the stablePool
  ;

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
  } // calculates the output amount usingn the input for the swableSwap
  // requires the view on a contract as manual calculation on the frontend would
  // be inefficient
  ;

  _proto.calculateSwapViaPing = function calculateSwapViaPing(inToken, outToken, inAmount, // chainId: number,
  provider) {
    try {
      return Promise.resolve(new Contract('0xCc62754F15f7F35E4c58Ce6aD5608fA575C5583E', new ethers.utils.Interface(weightedPoolABI), provider).calculateSwapGivenIn(inToken.address, outToken.address, inAmount));
    } catch (e) {
      return Promise.reject(e);
    }
  } // calculates the swap output amount without
  // pinging the blockchain for data
  ;

  _proto.calculateSwapGivenIn = function calculateSwapGivenIn$1(tokenIn, tokenOut, inAmount) {
    var outAmount = calculateSwapGivenIn(this.swapStorage, this.indexFromToken(tokenIn), this.indexFromToken(tokenOut), inAmount, this.tokenBalances);

    return outAmount;
  } // calculates the swap output amount without
  // pinging the blockchain for data
  ;

  _proto.calculateSwapGivenOut = function calculateSwapGivenOut$1(tokenIn, tokenOut, outAmount) {
    var inAmount = calculateSwapGivenOut(this.swapStorage, this.indexFromToken(tokenIn), this.indexFromToken(tokenOut), outAmount, this.tokenBalances);

    return inAmount;
  };

  _proto.getOutputAmount = function getOutputAmount(inputAmount, tokenOut) {
    var swap = this.calculateSwapGivenIn(inputAmount.token, tokenOut, inputAmount.raw);
    return new TokenAmount(tokenOut, swap);
  };

  _proto.getInputAmount = function getInputAmount(outputAmount, tokenIn) {
    var swap = this.calculateSwapGivenOut(tokenIn, outputAmount.token, outputAmount.raw);
    return new TokenAmount(tokenIn, swap.toBigInt());
  }
  /**
   * Returns the chain ID of the tokens in the pair.
   */
  ;

  _proto.token = function token(index) {
    return this.tokens[index];
  };

  _proto.reserveOf = function reserveOf(token) {
    !this.involvesToken(token) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;

    for (var i = 0; i < Object.keys(this.tokens).length; i++) {
      if (token.equals(this.tokens[i])) return this.tokenBalances[i];
    }

    return BigNumber.from(0);
  };

  _proto.calculateRemoveLiquidity = function calculateRemoveLiquidity(amountLp) {
    var _this2 = this;

    return calculateRemoveLiquidityExactIn(this.swapStorage, amountLp, this.lpTotalSupply, this.tokenBalances).map(function (x, i) {
      return x.div(_this2.swapStorage.tokenMultipliers[i]);
    });
  };

  _proto.calculateRemoveLiquidityOneToken = function calculateRemoveLiquidityOneToken(amount, index) {
    return calculateRemoveLiquidityOneTokenExactIn(this.swapStorage, index, amount, this.lpTotalSupply, this.tokenBalances);
  };

  _proto.getLiquidityAmount = function getLiquidityAmount(amounts, deposit) {
    return calculateTokenAmount(this.swapStorage, amounts, this.lpTotalSupply, deposit, this.tokenBalances);
  };

  _proto.getLiquidityValue = function getLiquidityValue(outIndex, userBalances) {
    var amount = BigNumber.from(0);

    for (var i = 0; i < userBalances.length; i++) {
      if (i !== outIndex) amount = amount.add(this.calculateSwapGivenIn(this.tokens[i], this.tokens[outIndex], userBalances[i]));
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
    return new WeightedPool(this.address, this.tokens, this.tokenBalances, this.swapStorage, this.lpTotalSupply);
  };

  _proto.poolPrice = function poolPrice(tokenIn, tokenOut) {
    var inIndex = this.indexFromToken(tokenIn);
    var outIndex = this.indexFromToken(tokenOut);
    return new Price(tokenIn, tokenOut, this.swapStorage.normalizedWeights[outIndex].mul(this.tokenBalances[inIndex]), this.swapStorage.normalizedWeights[inIndex].mul(this.tokenBalances[outIndex]));
  };

  _proto.poolPriceBases = function poolPriceBases(tokenIn, tokenOut) {
    var inIndex = this.indexFromToken(tokenIn);
    var outIndex = this.indexFromToken(tokenOut);
    return {
      priceBaseIn: this.swapStorage.normalizedWeights[outIndex].mul(this.tokenBalances[inIndex]),
      priceBaseOut: this.swapStorage.normalizedWeights[inIndex].mul(this.tokenBalances[outIndex])
    };
  };

  _createClass(WeightedPool, [{
    key: "chainId",
    get: function get() {
      return this.tokens[0].chainId;
    }
  }]);

  return WeightedPool;
}(Pool);

var MAX_ITERATION = 256;
var A_PRECISION = /*#__PURE__*/BigNumber.from(100);
var FEE_DENOMINATOR$1 = /*#__PURE__*/BigNumber.from(1e10);
var ONE$3 = /*#__PURE__*/BigNumber.from(1);
function _xp$1(balances, rates) {
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
  var sum = BigNumber.from(0);

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
    return BigNumber.from(0);
  }

  var Dprev = BigNumber.from(0);
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
  !(inIndex != outIndex) ? process.env.NODE_ENV !== "production" ? invariant(false, "sameToken") : invariant(false) : void 0;
  var nCoins = normalizedBalances.length;
  !(inIndex < nCoins && outIndex < nCoins) ? process.env.NODE_ENV !== "production" ? invariant(false, "indexOutOfRange") : invariant(false) : void 0;

  var amp = _getAPrecise(blockTimestamp, swapStorage);

  var Ann = amp.mul(nCoins);

  var D = _getD(normalizedBalances, amp);

  var sum = BigNumber.from(0); // sum of new balances except output token

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
  var lastY = BigNumber.from(0);
  var y = D;

  for (var index = 0; index < MAX_ITERATION; index++) {
    lastY = y;
    y = y.mul(y).add(c).div(y.mul(2).add(b).sub(D));

    if (_distance(lastY, y).lte(1)) {
      return y;
    }
  }
  return BigNumber.from(0);
}
function calculateSwapGivenIn$1(inIndex, outIndex, inAmount, // standard fields
balances, blockTimestamp, swapStorage) {
  var normalizedBalances = _xp$1(balances, swapStorage.tokenMultipliers);

  var newInBalance = normalizedBalances[inIndex].add(inAmount.mul(swapStorage.tokenMultipliers[inIndex]));

  var outBalance = _getY(inIndex, outIndex, newInBalance, blockTimestamp, swapStorage, normalizedBalances);

  var outAmount = normalizedBalances[outIndex].sub(outBalance).sub(ONE$3).div(swapStorage.tokenMultipliers[outIndex]);

  var _fee = swapStorage.fee.mul(outAmount).div(FEE_DENOMINATOR$1);

  return outAmount.sub(_fee);
}
function calculateSwapGivenOut$1(inIndex, outIndex, outAmount, // standard fields
balances, blockTimestamp, swapStorage) {
  var normalizedBalances = _xp$1(balances, swapStorage.tokenMultipliers);

  var _amountOutInclFee = outAmount.mul(FEE_DENOMINATOR$1).div(FEE_DENOMINATOR$1.sub(swapStorage.fee));

  var newOutBalance = normalizedBalances[outIndex].sub(_amountOutInclFee.mul(swapStorage.tokenMultipliers[outIndex]));

  var inBalance = _getY(outIndex, inIndex, newOutBalance, blockTimestamp, swapStorage, normalizedBalances);

  var inAmount = inBalance.sub(normalizedBalances[inIndex]).sub(ONE$3).div(swapStorage.tokenMultipliers[inIndex]).add(ONE$3);
  return inAmount;
} // function to calculate the amounts of stables from the amounts of LP

function _calculateRemoveLiquidity(amount, swapStorage, totalSupply, currentWithdrawFee, balances) {
  !amount.lte(totalSupply) ? process.env.NODE_ENV !== "production" ? invariant(false, "Cannot exceed total supply") : invariant(false) : void 0;
  var feeAdjustedAmount = amount.mul(FEE_DENOMINATOR$1.sub(currentWithdrawFee)).div(FEE_DENOMINATOR$1);
  var amounts = [];

  for (var i = 0; i < swapStorage.tokenMultipliers.length; i++) {
    amounts.push(balances[i].mul(feeAdjustedAmount).div(totalSupply));
  }

  return amounts;
}

function _getYD(A, index, xp, D) {
  var nCoins = xp.length;
  !(index < nCoins) ? process.env.NODE_ENV !== "production" ? invariant(false, "INDEX") : invariant(false) : void 0;
  var Ann = A.mul(nCoins);
  var c = D;
  var s = BigNumber.from(0);

  var _x = BigNumber.from(0);

  var yPrev = BigNumber.from(0);

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
  return BigNumber.from(0);
}

function _feePerToken(swapStorage) {
  var nCoins = swapStorage.tokenMultipliers.length;
  return swapStorage.fee.mul(nCoins).div(4 * (nCoins - 1));
}

function _calculateRemoveLiquidityOneToken(swapStorage, tokenAmount, index, blockTimestamp, balances, totalSupply, currentWithdrawFee) {
  !(index < swapStorage.tokenMultipliers.length) ? process.env.NODE_ENV !== "production" ? invariant(false, "indexOutOfRange") : invariant(false) : void 0;

  var amp = _getAPrecise(blockTimestamp, swapStorage);

  var xp = _xp$1(balances, swapStorage.tokenMultipliers);

  var D0 = _getD(xp, amp);

  var D1 = D0.sub(tokenAmount.mul(D0).div(totalSupply));

  var newY = _getYD(amp, index, xp, D1);

  var reducedXP = xp;

  var _fee = _feePerToken(swapStorage);

  for (var i = 0; i < swapStorage.tokenMultipliers.length; i++) {
    var expectedDx = BigNumber.from(0);

    if (i == index) {
      expectedDx = xp[i].mul(D1).div(D0).sub(newY);
    } else {
      expectedDx = xp[i].sub(xp[i].mul(D1).div(D0));
    }

    reducedXP[i] = reducedXP[i].sub(_fee.mul(expectedDx).div(FEE_DENOMINATOR$1));
  }

  var dy = reducedXP[index].sub(_getYD(amp, index, reducedXP, D1));
  dy = dy.sub(1).div(swapStorage.tokenMultipliers[index]);
  var fee = xp[index].sub(newY).div(swapStorage.tokenMultipliers[index]).sub(dy);
  dy = dy.mul(FEE_DENOMINATOR$1.sub(currentWithdrawFee)).div(FEE_DENOMINATOR$1);
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
  !(amounts.length == nCoins) ? process.env.NODE_ENV !== "production" ? invariant(false, "invalidAmountsLength") : invariant(false) : void 0;

  var amp = _getAPrecise(blockTimestamp, swapStorage);

  var D0 = _getD(_xp$1(balances, swapStorage.tokenMultipliers), amp);

  var newBalances = balances;

  for (var i = 0; i < nCoins; i++) {
    if (deposit) {
      newBalances[i] = newBalances[i].add(amounts[i]);
    } else {
      newBalances[i] = newBalances[i].sub(amounts[i]);
    }
  }

  var D1 = _getD(_xp$1(newBalances, swapStorage.tokenMultipliers), amp);

  if (totalSupply.eq(0)) {
    return D1; // first depositor take it all
  }

  var diff = deposit ? D1.sub(D0) : D0.sub(D1);
  return diff.mul(totalSupply).div(D0);
}

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

var StablePool = /*#__PURE__*/function (_Pool) {
  _inheritsLoose(StablePool, _Pool);

  function StablePool(tokens, tokenBalances, _A, swapStorage, blockTimestamp, lpTotalSupply, currentWithdrawFee, poolAddress) {
    var _STABLE_POOL_LP_ADDRE;

    var _this;

    _this = _Pool.call(this) || this;
    _this.tokens = tokens;
    _this.currentWithdrawFee = currentWithdrawFee;
    _this.lpTotalSupply = lpTotalSupply;
    _this.swapStorage = swapStorage;
    _this.blockTimestamp = BigNumber.from(blockTimestamp);
    _this.tokenBalances = tokenBalances;
    _this._A = _A;
    _this.liquidityToken = new Token(tokens[0].chainId, (_STABLE_POOL_LP_ADDRE = STABLE_POOL_LP_ADDRESS[tokens[0].chainId]) !== null && _STABLE_POOL_LP_ADDRE !== void 0 ? _STABLE_POOL_LP_ADDRE : '0x0000000000000000000000000000000000000001', 18, 'RequiemStable-LP', 'Requiem StableSwap LPs');
    _this.address = ethers.utils.getAddress(poolAddress);

    for (var i = 0; i < Object.values(_this.tokens).length; i++) {
      !(tokens[i].address != ethers.constants.AddressZero) ? process.env.NODE_ENV !== "production" ? invariant(false, "invalidTokenAddress") : invariant(false) : void 0;
      !(tokens[i].decimals <= 18) ? process.env.NODE_ENV !== "production" ? invariant(false, "invalidDecimals") : invariant(false) : void 0;
      !(tokens[i].chainId === tokens[0].chainId) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INVALID TOKENS') : invariant(false) : void 0;
    }

    _this._name = 'Stable Pool';
    return _this;
  }

  StablePool.getRouterAddress = function getRouterAddress(chainId) {
    return STABLE_POOL_ADDRESS[chainId];
  };

  StablePool.getLpAddress = function getLpAddress(chainId) {
    return STABLE_POOL_LP_ADDRESS[chainId];
  };

  StablePool.mock = function mock() {
    var dummy = BigNumber.from(0);
    return new StablePool([new Token(1, '0x0000000000000000000000000000000000000001', 6, 'Mock USDC', 'MUSDC')], [dummy], dummy, StableSwapStorage.mock(), 0, dummy, dummy, '0x0000000000000000000000000000000000000001');
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
    var _this2 = this;

    return Object.keys(this.tokens).map(function (_, index) {
      return _this2.tokenBalances[index];
    });
  } // calculates the output amount usingn the input for the swableSwap
  // requires the view on a contract as manual calculation on the frontend would
  // be inefficient
  ;

  _proto.calculateSwapViaPing = function calculateSwapViaPing(inToken, outToken, inAmount, chainId, provider) {
    try {
      return Promise.resolve(new Contract(StablePool.getRouterAddress(chainId), new ethers.utils.Interface(StableSwap), provider).calculateSwap(inToken.address, outToken.address, inAmount));
    } catch (e) {
      return Promise.reject(e);
    }
  } // calculates the swap output amount without
  // pinging the blockchain for data
  ;

  _proto.calculateSwapGivenIn = function calculateSwapGivenIn(tokenIn, tokenOut, inAmount) {
    // if (this.getBalances()[inIndex].lte(inAmount)) // || inAmount.eq(ZERO))
    //   return ZERO
    var outAmount = calculateSwapGivenIn$1(this.indexFromToken(tokenIn), this.indexFromToken(tokenOut), inAmount, this.tokenBalances, this.blockTimestamp, this.swapStorage);

    return outAmount;
  } // calculates the swap output amount without
  // pinging the blockchain for data
  ;

  _proto.calculateSwapGivenOut = function calculateSwapGivenOut(tokenIn, tokenOut, outAmount) {
    // if (this.getBalances()[outIndex].lte(outAmount)) // || outAmount.eq(ZERO))
    //   return ZERO
    var inAmount = calculateSwapGivenOut$1(this.indexFromToken(tokenIn), this.indexFromToken(tokenOut), outAmount, this.tokenBalances, this.blockTimestamp, this.swapStorage);

    return inAmount;
  };

  _proto.getOutputAmount = function getOutputAmount(inputAmount, tokenOut) {
    var swap = this.calculateSwapGivenIn(inputAmount.token, tokenOut, inputAmount.toBigNumber());
    return new TokenAmount(tokenOut, swap.toBigInt());
  };

  _proto.getInputAmount = function getInputAmount(outputAmount, tokenIn) {
    var swap = this.calculateSwapGivenOut(tokenIn, outputAmount.token, outputAmount.toBigNumber());
    return new TokenAmount(tokenIn, swap);
  }
  /**
   * Returns the chain ID of the tokens in the pair.
   */
  ;

  _proto.token = function token(index) {
    return this.tokens[index];
  };

  _proto.reserveOf = function reserveOf(token) {
    !this.involvesToken(token) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TOKEN') : invariant(false) : void 0;

    for (var i = 0; i < Object.keys(this.tokens).length; i++) {
      if (token.equals(this.tokens[i])) return this.tokenBalances[i];
    }

    return BigNumber.from(0);
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
    var amount = BigNumber.from(0);

    for (var i = 0; i < userBalances.length; i++) {
      if (i !== outIndex) amount = amount.add(this.calculateSwapGivenIn(this.tokens[i], this.tokens[outIndex], userBalances[i]));
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
    return new StablePool(this.tokens, this.tokenBalances, this._A, this.swapStorage, this.blockTimestamp.toNumber(), this.lpTotalSupply, this.currentWithdrawFee, this.address);
  };

  _proto.poolPrice = function poolPrice(tokenIn, tokenOut) {
    var virtualIn = BigNumber.from(this.tokenBalances[this.indexFromToken(tokenIn)]).div(10000);
    return new Price(tokenIn, tokenOut, virtualIn, this.calculateSwapGivenIn(tokenIn, tokenOut, virtualIn));
  };

  _proto.poolPriceBases = function poolPriceBases(tokenIn, tokenOut) {
    var virtualIn = this.tokenBalances[this.indexFromToken(tokenIn)].div(10000);
    return {
      priceBaseIn: virtualIn,
      priceBaseOut: this.calculateSwapGivenIn(tokenIn, tokenOut, virtualIn)
    };
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
}(Pool);

// does not store any pricing or calculation functions - these are used through the poolId which is taken from a pool dictionary
// these pools are then used for pricing

var SwapData = /*#__PURE__*/function () {
  function SwapData(tokenIn, tokenOut, poolRef) {
    // invariant(!tokenIn.equals(tokenOut), 'TOKEN')
    this.tokenIn = tokenIn;
    this.tokenOut = tokenOut;
    this.poolRef = poolRef;
  }

  var _proto = SwapData.prototype;

  _proto.calculateSwapGivenOut = function calculateSwapGivenOut(tokenOutAmount, poolDict) {
    return new TokenAmount(this.tokenIn, poolDict[this.poolRef].calculateSwapGivenOut(this.tokenIn, tokenOutAmount.token, tokenOutAmount.raw));
  };

  _proto.calculateSwapGivenIn = function calculateSwapGivenIn(tokenInAmount, poolDict) {
    return new TokenAmount(this.tokenOut, poolDict[this.poolRef].calculateSwapGivenIn(tokenInAmount.token, this.tokenOut, tokenInAmount.raw));
  };

  _proto.involvesToken = function involvesToken(token) {
    return this.tokenIn.address === token.address || this.tokenOut.address === token.address;
  }
  /**
   *  Calculate the mid price for a pool - if possible
   * @param tokenIn in token for price
   * @param tokenOut out/ quote token for price
   * @param poolDict pool dictionary to fetch the underlying pool from
   * @returns price object
   */
  ;

  _proto.poolPrice = function poolPrice(poolDict) {
    return poolDict[this.poolRef].poolPrice(this.tokenIn, this.tokenOut);
  }
  /**
  * @param pool input pool to generate pair from
  * @returns pair route
  */
  ;

  SwapData.singleDataFromPool = function singleDataFromPool(tokenIn, tokenOut, pool) {
    !(pool.tokens.includes(tokenIn) && pool.tokens.includes(tokenOut)) ? process.env.NODE_ENV !== "production" ? invariant(false) : invariant(false) : void 0;
    return new SwapData(tokenIn, tokenOut, pool.address);
  };

  _proto.fetchPoolPrice = function fetchPoolPrice(poolDict) {
    var _poolDict$this$poolRe = poolDict[this.poolRef].poolPriceBases(this.tokenIn, this.tokenOut),
        priceBaseIn = _poolDict$this$poolRe.priceBaseIn,
        priceBaseOut = _poolDict$this$poolRe.priceBaseOut;

    this.priceBaseIn = priceBaseIn;
    this.priceBaseOut = priceBaseOut;
  };

  _createClass(SwapData, [{
    key: "chainId",
    get: function get() {
      return this.tokenIn.chainId;
    }
  }]);

  return SwapData;
}();

// does not store any pricing or calculation functions - these are used through the poolId which is taken from a pool dictionary
// these pools are then used for pricing

var PairData = /*#__PURE__*/function () {
  function PairData(token0, token1, poolRef) {
    this.token0 = token0;
    this.token1 = token1;
    this.poolRef = poolRef;
  }

  var _proto = PairData.prototype;

  _proto.calculateSwapGivenOut = function calculateSwapGivenOut(tokenOutAmount, poolDict) {
    var tokenIn = tokenOutAmount.token.equals(this.token0) ? this.token1 : this.token0;
    return new TokenAmount(tokenIn, poolDict[this.poolRef].calculateSwapGivenOut(tokenIn, tokenOutAmount.token, tokenOutAmount.raw));
  };

  _proto.calculateSwapGivenIn = function calculateSwapGivenIn(tokenInAmount, poolDict) {
    var tokenOut = tokenInAmount.token.equals(this.token0) ? this.token1 : this.token0;
    return new TokenAmount(tokenOut, poolDict[this.poolRef].calculateSwapGivenIn(tokenInAmount.token, tokenOut, tokenInAmount.raw));
  };

  _proto.involvesToken = function involvesToken(token) {
    return this.token0.address === token.address || this.token1.address === token.address;
  }
  /**
   *  Calculate the mid price for a pool - if possible
   * @param tokenIn in token for price
   * @param tokenOut out/ quote token for price
   * @param poolDict pool dictionary to fetch the underlying pool from
   * @returns price object
   */
  ;

  _proto.poolPrice = function poolPrice(tokenIn, tokenOut, poolDict) {
    return poolDict[this.poolRef].poolPrice(tokenIn, tokenOut);
  }
  /**
   * Pools with n > 2 tokens generate (n^2-n)/2 possible pair routes to trade
   * The fubnction creates these pair routes
   * @param pool input pool to generate pairs from
   * @returns pair routes
   */
  ;

  PairData.dataFromPool = function dataFromPool(pool) {
    var pairData = [];

    for (var i = 0; i < pool.tokenBalances.length; i++) {
      for (var j = 0; j < i; j++) {
        pairData.push(new PairData(pool.tokens[i], pool.tokens[j], pool.address));
      }
    }

    return pairData;
  }
  /**
   * @param pool input pool to generate pair from
   * @returns pair route
   */
  ;

  PairData.singleDataFromPool = function singleDataFromPool(index0, index1, pool) {
    return new PairData(pool.tokens[index0], pool.tokens[index1], pool.address);
  }
  /**
   * Pools with n > 2 tokens generate (n^2-n)/2 possible pair routes to trade
   * The fubnction creates these pair routes
   * @param pool input pool to generate pairs from
   * @returns pair routes
   */
  ;

  PairData.dataFromPools = function dataFromPools(pools) {
    var pairData = [];

    for (var k = 0; k < pools.length; k++) {
      var pool = pools[k];

      for (var i = 0; i < pool.tokenBalances.length; i++) {
        for (var j = 0; j < i; j++) {
          pairData.push(new PairData(pool.tokens[i], pool.tokens[j], pool.address));
        }
      }
    }

    return pairData;
  }
  /**
   * Converts unordered pair to directioned swap pair
   * @param tokenIn in token, the other will be tokenOut
   * @returns SwapData object
   */
  ;

  _proto.toSwapDataFrom = function toSwapDataFrom(tokenIn) {
    return new SwapData(tokenIn, this.token0.equals(tokenIn) ? this.token1 : this.token0, this.poolRef);
  }
  /**
  * Converts unordered pair to directioned swap pair
  * @param tokenIn in token, the other will be tokenOut
  * @returns SwapData object
  */
  ;

  _proto.toSwapDataTo = function toSwapDataTo(tokenOut) {
    return new SwapData(this.token0.equals(tokenOut) ? this.token1 : this.token0, tokenOut, this.poolRef);
  }
  /**
   * Converts unordered swap pairs to swap route
   * @param pairData input pair array - has to be a route to make sense
   * @param tokenIn
   * @returns
   */
  ;

  PairData.toSwapArrayFrom = function toSwapArrayFrom(pairData, tokenIn) {
    var swaps = [];
    var currentIn = tokenIn;

    for (var i = 0; i < pairData.length; i++) {
      var swap = pairData[i].toSwapDataFrom(currentIn);
      swaps.push(swap);
      currentIn = swap.tokenOut;
    }

    return swaps;
  }
  /**
  * Converts unordered swap pairs to swap route
  * @param pairData input pair array - has to be a route to make sense
  * @param tokenIn
  * @returns
  */
  ;

  PairData.toSwapArrayTo = function toSwapArrayTo(pairData, tokenOut) {
    var swaps = new Array(pairData.length);
    var currentOut = tokenOut;

    for (var i = pairData.length - 1; i >= 0; i--) {
      var swap = pairData[i].toSwapDataTo(currentOut);
      swaps[i] = swap;
      currentOut = swap.tokenIn;
    }

    return swaps;
  };

  _createClass(PairData, [{
    key: "chainId",
    get: function get() {
      return this.token0.chainId;
    }
  }]);

  return PairData;
}();

var ONE$4 = /*#__PURE__*/BigNumber.from(1);
var TEN$1 = /*#__PURE__*/BigNumber.from(10);
var TWO$2 = /*#__PURE__*/BigNumber.from(2);
var SQRT2x100 = /*#__PURE__*/BigNumber.from('141421356237309504880');
var ONE_E18 = /*#__PURE__*/BigNumber.from('1000000000000000000');
function sqrrt(a) {
  var c = ONE$4;

  if (a.gt(3)) {
    c = a;
    var b = a.div(TWO$2).add(ONE$4);

    while (b < c) {
      c = b;
      b = a.div(b).add(b).div(TWO$2);
    }
  } else if (!a.eq(0)) {
    c = ONE$4;
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

  return SQRT2x100.mul(reservesOther.toBigNumber()).div(sqrrt(weightOther.mul(weightOther).add(weightPayoutToken.add(weightPayoutToken)))).div(ONE_E18);
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
  var _ref2 = payoutToken.equals(pair.token0) ? [pair.reserve1.toBigNumber(), BigNumber.from(pair.weight1.toString()), BigNumber.from(pair.weight0.toString())] : [pair.reserve0.toBigNumber(), BigNumber.from(pair.weight0.toString()), BigNumber.from(pair.weight1.toString())],
      reservesOther = _ref2[0],
      weightOther = _ref2[1],
      weightPayoutToken = _ref2[2]; // adjusted markdown scaling up the reserve as the trading mechnism allows
  // higher or lower valuation for payoutToken reserve


  return reservesOther.add(weightOther.mul(reservesOther).div(weightPayoutToken)).mul(TEN$1.pow(BigNumber.from(payoutToken.decimals)).div(getTotalValue(pair, payoutToken)));
}

var RESOLUTION = /*#__PURE__*/BigNumber.from(112);
var resPrec = /*#__PURE__*/BigNumber.from(2).pow(RESOLUTION);
var ZERO$3 = /*#__PURE__*/BigNumber.from(0); // const Q112 = BigNumber.from('0x10000000000000000000000000000');
// const Q224 = BigNumber.from('0x100000000000000000000000000000000000000000000000000000000');
// const LOWER_MASK = BigNumber.from('0xffffffffffffffffffffffffffff'); // decimal of UQ*x112 (lower 112 bits)

function decode(x) {
  return x.div(RESOLUTION);
}
function decode112with18(x) {
  return x.div(BigNumber.from('5192296858534827'));
}
function fraction(numerator, denominator) {
  !denominator.gt(ZERO$3) ? process.env.NODE_ENV !== "production" ? invariant(false, "FixedPoint::fraction: division by zero") : invariant(false) : void 0;
  if (numerator.isZero()) return ZERO$3; // if (numerator.lte(BigNumber.) <= type(uint144).max) {

  var result = numerator.mul(resPrec).div(denominator); //   require(result <= type(uint224).max, "FixedPoint::fraction: overflow");

  return result; // } else {
  //    return numerator.mul(Q112).div(denominator);
  // }
}

var ONE_E16 = /*#__PURE__*/BigNumber.from('10000000000000000');
var ONE_E18$1 = /*#__PURE__*/BigNumber.from('10000000000000000');
var ONE_E9 = /*#__PURE__*/BigNumber.from('1000000000');
function payoutFor(value, bondPrice) {
  return value.mul(ONE_E18$1.mul(ONE_E18$1)).div(bondPrice).div(ONE_E18$1);
}
function fullPayoutFor(pair, currentDebt, totalSupply, amount, payoutToken, terms) {
  var value = valuation(pair, totalSupply, amount, payoutToken);
  var bondPrice_ = bondPrice(terms.controlVariable, totalSupply, currentDebt);
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

function bondPrice(controlVariable, totalSupply, currentDebt) {
  var price_ = controlVariable.mul(debtRatio(totalSupply, currentDebt)).add(ONE_E18$1).div(ONE_E16);
  return price_;
}
/**
 *  @notice calculate current bond premium
 *  @return price_ uint
 */

function bondPriceUsingDebtRatio(controlVariable, debtRatio) {
  return controlVariable.mul(debtRatio).div(ONE_E18$1);
}
function fullPayoutForUsingDebtRatio(pair, debtRatio, totalSupply, amount, payoutToken, terms) {
  var value = valuation(pair, totalSupply, amount, payoutToken);
  var bondPrice_ = bondPriceUsingDebtRatio(terms.controlVariable, debtRatio);
  return payoutFor(value, bondPrice_);
}

/**
 *
 * @param pools pools to generate pairData with, i.e. a 3-Pool generating the respective 6 pairs
 * @returns an array of the pairData
 */

function pairDataFromPools(pools) {
  var pairData = PairData.dataFromPool(pools[0]);

  for (var i = 1; i < pools.length; i++) {
    pairData = pairData.concat(PairData.dataFromPool(pools[i]));
  }

  return pairData;
} // new version of the route 
// the first verion to include the stable pool for less friction

var Route = /*#__PURE__*/function () {
  function Route(poolDict, pairData, input, output) {
    !(pairData.length > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'pairData') : invariant(false) : void 0;
    !(input instanceof Token && pairData[0].involvesToken(input) || input === NETWORK_CCY[pairData[0].chainId] && pairData[0].involvesToken(WRAPPED_NETWORK_TOKENS[pairData[0].chainId])) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INPUT') : invariant(false) : void 0;
    !(typeof output === 'undefined' || output instanceof Token && pairData[pairData.length - 1].involvesToken(output) || output === NETWORK_CCY[pairData[0].chainId] && pairData[pairData.length - 1].involvesToken(WRAPPED_NETWORK_TOKENS[pairData[0].chainId])) ? process.env.NODE_ENV !== "production" ? invariant(false, 'OUTPUT') : invariant(false) : void 0;
    var path = [input instanceof Token ? input : WRAPPED_NETWORK_TOKENS[pairData[0].chainId]];

    for (var _iterator = _createForOfIteratorHelperLoose(pairData.entries()), _step; !(_step = _iterator()).done;) {
      var _step$value = _step.value,
          i = _step$value[0],
          pool = _step$value[1];
      var currentInput = path[i];
      !(currentInput.equals(pool.token0) || currentInput.equals(pool.token1)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'PATH') : invariant(false) : void 0;

      var _output = currentInput.equals(pool.token0) ? pool.token1 : pool.token0;

      path.push(_output);
    }

    this.pairData = pairData;
    this.path = path;
    this.midPrice = Price.fromRoute(this, poolDict);
    this.input = input;
    this.output = output !== null && output !== void 0 ? output : path[path.length - 1];
  }

  _createClass(Route, [{
    key: "chainId",
    get: function get() {
      return this.pairData[0].chainId;
    }
  }]);

  return Route;
}();

// import { SwapData } from './pools/swapData'

var SwapType;

(function (SwapType) {
  SwapType[SwapType["EXACT_INPUT"] = 0] = "EXACT_INPUT";
  SwapType[SwapType["EXACT_OUTPUT"] = 1] = "EXACT_OUTPUT";
})(SwapType || (SwapType = {}));
/**
 * Returns the percent difference between the mid price and the execution price, i.e. price impact.
 * @param midPrice mid price before the trade
 * @param inputAmount the input amount of the trade
 * @param outputAmount the output amount of the trade
 */
// function computePriceImpact(midPrice: Price, inputAmount: CurrencyAmount, outputAmount: CurrencyAmount): Percent {
//   const exactQuote = midPrice.raw.multiply(inputAmount.raw)
//   // calculate slippage := (exactQuote - outputAmount) / exactQuote
//   const slippage = exactQuote.subtract(outputAmount.raw).divide(exactQuote)
//   return new Percent(slippage.numerator, slippage.denominator)
// }
// function computePriceImpactWeightedPair(pair: WeightedPair, inputAmount: CurrencyAmount, outputAmount: CurrencyAmount): Percent {
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


function inputOutputComparator(a, b) {
  // must have same input and output token for comparison
  !currencyEquals(a.inputAmount.currency, b.inputAmount.currency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INPUT_CURRENCY') : invariant(false) : void 0;
  !currencyEquals(a.outputAmount.currency, b.outputAmount.currency) ? process.env.NODE_ENV !== "production" ? invariant(false, 'OUTPUT_CURRENCY') : invariant(false) : void 0;

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
  } // // consider lowest slippage next, since these are less likely to fail
  // if (a.priceImpact.lessThan(b.priceImpact)) {
  //   return -1
  // } else if (a.priceImpact.greaterThan(b.priceImpact)) {
  //   return 1
  // }
  // finally consider the number of hops since each hop costs gas


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
   process.env.NODE_ENV !== "production" ? invariant(false, 'CURRENCY') : invariant(false) ;
}
/**
 * Represents a trade executed against a list of pairs.
 * Does not account for slippage, i.e. trades that front run this trade and move the price.
 */


var Swap = /*#__PURE__*/function () {
  function Swap(route, amount, tradeType, poolDict) {
    var amounts = new Array(route.path.length);

    if (tradeType === SwapType.EXACT_INPUT) {
      !currencyEquals(amount.currency, route.input) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INPUT') : invariant(false) : void 0;
      amounts[0] = wrappedAmount(amount, route.chainId);

      for (var i = 0; i < route.path.length - 1; i++) {
        var pair = route.swapData[i];
        var outputAmount = pair.calculateSwapGivenIn(amounts[i], poolDict);
        amounts[i + 1] = outputAmount;
      }
    } else {
      !currencyEquals(amount.currency, route.output) ? process.env.NODE_ENV !== "production" ? invariant(false, 'OUTPUT') : invariant(false) : void 0;
      amounts[amounts.length - 1] = wrappedAmount(amount, route.chainId);

      for (var _i = route.path.length - 1; _i > 0; _i--) {
        var _pair = route.swapData[_i - 1];

        var inputAmount = _pair.calculateSwapGivenOut(amounts[_i], poolDict);

        amounts[_i - 1] = inputAmount;
      }
    }

    this.route = route;
    this.tradeType = tradeType;
    this.swapAmounts = amounts;
    this.inputAmount = tradeType === SwapType.EXACT_INPUT ? amount : route.input === NETWORK_CCY[route.chainId] ? CurrencyAmount.networkCCYAmount(route.chainId, amounts[0].raw) : amounts[0];
    this.outputAmount = tradeType === SwapType.EXACT_OUTPUT ? amount : route.output === NETWORK_CCY[route.chainId] ? CurrencyAmount.networkCCYAmount(route.chainId, amounts[amounts.length - 1].raw) : amounts[amounts.length - 1];
    this.executionPrice = new Price(this.inputAmount.currency, this.outputAmount.currency, this.inputAmount.raw, this.outputAmount.raw); // this.priceImpact = computePriceImpact(route.midPrice, this.inputAmount, this.outputAmount)
  }
  /**
   * The percent difference between the mid price before the trade and the trade execution price.
   */
  // public readonly priceImpact: Percent

  /**
   * Constructs an exact in trade with the given amount in and route
   * @param route route of the exact in trade
   * @param amountIn the amount being passed in
   */


  Swap.exactIn = function exactIn(route, amountIn, poolDict) {
    return new Swap(route, amountIn, SwapType.EXACT_INPUT, poolDict);
  }
  /**
   * Constructs an exact out trade with the given amount out and route
   * @param route route of the exact out trade
   * @param amountOut the amount returned by the trade
   */
  ;

  Swap.exactOut = function exactOut(route, amountOut, poolDict) {
    return new Swap(route, amountOut, SwapType.EXACT_OUTPUT, poolDict);
  }
  /**
   * Get the minimum amount that must be received from this trade for the given slippage tolerance
   * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
   */
  ;

  var _proto = Swap.prototype;

  _proto.minimumAmountOut = function minimumAmountOut(slippageTolerance) {
    !!slippageTolerance.lessThan(ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false, 'SLIPPAGE_TOLERANCE') : invariant(false) : void 0;

    if (this.tradeType === SwapType.EXACT_OUTPUT) {
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
    !!slippageTolerance.lessThan(ZERO) ? process.env.NODE_ENV !== "production" ? invariant(false, 'SLIPPAGE_TOLERANCE') : invariant(false) : void 0;

    if (this.tradeType === SwapType.EXACT_INPUT) {
      return this.inputAmount;
    } else {
      var slippageAdjustedAmountIn = new Fraction(ONE).add(slippageTolerance).multiply(this.inputAmount.raw).quotient;
      return this.inputAmount instanceof TokenAmount ? new TokenAmount(this.inputAmount.token, slippageAdjustedAmountIn) : CurrencyAmount.networkCCYAmount(this.route.chainId, slippageAdjustedAmountIn);
    }
  }
  /**
   *
   * @param swapRoutes input routes - should already not include duplicates
   * @param swapType determines in which direction the swap will be calculated
   * @param poolDict dictionary used to price the trade routes
   * @returns trades in an array
   */
  ;

  Swap.PriceRoutes = function PriceRoutes(swapRoutes, amount, swapType, poolDict) {
    var swaps = [];

    for (var i = 0; i < swapRoutes.length; i++) {
      swaps.push(new Swap(swapRoutes[i], amount, swapType, poolDict));
    }

    if (swapType === SwapType.EXACT_INPUT) return swaps.sort(function (a, b) {
      return a.outputAmount.raw.lt(b.outputAmount.raw) ? 1 : -1;
    });else return swaps.sort(function (a, b) {
      return a.outputAmount.raw.gt(b.outputAmount.raw) ? 1 : -1;
    });
  };

  return Swap;
}();

// the first verion to include the stable pool for less friction

var SwapRoute = /*#__PURE__*/function () {
  // public readonly midPrice: Price
  function SwapRoute(swapData) {
    var path = [swapData[0].tokenIn]; // it can happen that the pool is traded through consecutively, we wnat to remove this case 

    var swapDataAggregated = [];

    for (var i = 0; i < swapData.length; i++) {
      var currentSwap = swapData[i];
      var tokenIn = currentSwap.tokenIn;
      var relevantOut = currentSwap.tokenOut;

      for (var j = i + 1; j < swapData.length; j++) {
        if (swapData[j].poolRef === currentSwap.poolRef) {
          currentSwap = swapData[j];
          relevantOut = currentSwap.tokenOut;
          i++;
        } else {
          break;
        }
      }

      var swap = new SwapData(tokenIn, relevantOut, currentSwap.poolRef);
      swapDataAggregated.push(swap); // const currentInput = path[i]
      // invariant(currentInput.equals(currentSwap.tokenIn), 'PATH')

      var output = currentSwap.tokenOut;
      path.push(output);
    }

    this.swapData = swapDataAggregated;
    this.identifier = swapDataAggregated.map(function (x) {
      return x.poolRef;
    }).join('-') + path.map(function (p) {
      return p.address.charAt(5);
    }).join('-');
    this.path = path; // this.midPrice = Price.fromRoute(this, poolDict)

    this.input = path[0];
    this.output = path[path.length - 1];
  }

  var _proto = SwapRoute.prototype;

  _proto.equals = function equals(otherRoute) {
    for (var i = 0; i < this.swapData.length; i++) {
      if (!this.swapData[i].tokenIn.equals(otherRoute.swapData[i].tokenIn) && !this.swapData[i].tokenOut.equals(otherRoute.swapData[i].tokenOut) && !(this.swapData[i].poolRef === otherRoute.swapData[i].poolRef)) return false;
    }

    return true;
  };

  SwapRoute.cleanRoutes = function cleanRoutes(swapRoutes) {
    var routeIds = [];
    var routes = [];

    for (var i = 0; i < swapRoutes.length; i++) {
      if (!routeIds.includes(swapRoutes[i].identifier)) {
        routeIds.push(swapRoutes[i].identifier);
        routes.push(swapRoutes[i]);
      }
    }

    return routes;
  };

  _createClass(SwapRoute, [{
    key: "chainId",
    get: function get() {
      return this.swapData[0].chainId;
    }
  }]);

  return SwapRoute;
}();

// import { SwapData } from "entities/pools/SwapData";
function wrappedCurrency(currency, chainId) {
  if (currency instanceof Token) return currency;
  if (currency === NETWORK_CCY[chainId]) return WRAPPED_NETWORK_TOKENS[chainId];
   process.env.NODE_ENV !== "production" ? invariant(false, 'CURRENCY') : invariant(false) ;
}
var RouteProvider = /*#__PURE__*/function () {
  function RouteProvider() {}

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
  RouteProvider.getRouteIteration = function getRouteIteration(pairData, tokenIn, tokenOut, maxHops, // used in recursion.
  lastPool, currentpools, originalCurrencyIn, bestRoutes) {
    if (maxHops === void 0) {
      maxHops = 3;
    }

    if (lastPool === void 0) {
      lastPool = '';
    }

    if (currentpools === void 0) {
      currentpools = [];
    }

    if (originalCurrencyIn === void 0) {
      originalCurrencyIn = tokenIn;
    }

    if (bestRoutes === void 0) {
      bestRoutes = [];
    }

    !(pairData.length > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'PAIRS') : invariant(false) : void 0;
    !(maxHops > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'MAX_HOPS') : invariant(false) : void 0;
    !(originalCurrencyIn === tokenIn || currentpools.length > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'INVALID_RECURSION') : invariant(false) : void 0;
    var relevantPairs = pairData.filter(function (p) {
      return p.poolRef !== lastPool;
    });

    for (var i = 0; i < relevantPairs.length; i++) {
      var pair = relevantPairs[i]; // filters for valid connection

      var inIs0 = pair.token0.equals(tokenIn);
      if (!inIs0 && !pair.token1.equals(tokenIn)) continue;
      var tokenOutNew = inIs0 ? pair.token1 : pair.token0;
      var swap = void 0; // const lastSwap:SwapData = currentpools[currentpools.length -1]
      // if(lastSwap?.poolRef === pair.poolRef)
      // {
      // swap =  new SwapData(lastSwap.tokenIn, tokenOutNew, pair.poolRef)
      //   currentpools.splice(currentpools.length -1,1)
      // } else
      // {

      swap = new SwapData(tokenIn, tokenOutNew, pair.poolRef); // }
      // we have arrived at the output token, so this is the final trade of one of the paths

      if (tokenOutNew.equals(tokenOut)) {
        bestRoutes.push(new SwapRoute([].concat(currentpools, [swap])));
      } else if (maxHops > 1 && relevantPairs.length > 1) {
        // const poolsExcludingThispool = pairData.slice(0, i).concat(pairData.slice(i + 1, pairData.length)) // pairData.filter(data => data.poolRef !== pair.poolRef)
        // otherwise, consider all the other paths that lead from this token as long as we have not exceeded maxHops
        RouteProvider.getRouteIteration( // poolsExcludingThispool,
        pairData, tokenOutNew, tokenOut, maxHops - 1, pair.poolRef, [].concat(currentpools, [swap]), originalCurrencyIn, bestRoutes);
      }
    }

    return bestRoutes;
  };

  RouteProvider.getRoutes = function getRoutes(pairData, currencyIn, currencyOut, maxHops) {
    if (maxHops === void 0) {
      maxHops = 3;
    }

    return this.getRouteIteration(pairData, currencyIn, currencyOut, maxHops, '', [], currencyIn, []);
  };

  return RouteProvider;
}(); // export enum SwapTypes {
//     SwapExactIn,
//     SwapExactOut,
// }
// export interface SwapOptions {
//     gasPrice: BigNumber;
//     swapGas: BigNumber;
//     timestamp: number;
//     maxPools: number;
//     poolTypeFilter: PoolFilter;
//     forceRefresh: boolean;
// }
// export enum PoolFilter {
//     All = 'All',
//     Weighted = 'Weighted',
//     Stable = 'Stable',
//     MetaStable = 'MetaStable',
//     LBP = 'LiquidityBootstrapping',
//     Investment = 'Investment',
//     Element = 'Element',
//     AaveLinear = 'AaveLinear',
//     StablePhantom = 'StablePhantom',
//     ERC4626Linear = 'ERC4626Linear',
// }
// /*
// The purpose of this function is to build dictionaries of direct pools 
// and plausible hop pools.
// */
// export function filterPoolsOfInterest(
//     allPools: PoolDictionary,
//     tokenIn: Token,
//     tokenOut: Token,
//     maxPools: number
// ): [PoolDictionary, PoolHops, PoolHops] {
//     const directPools: PoolDictionary = {};
//     const hopsIn: PoolHops = {};
//     const hopsOut: PoolHops = {};
//     Object.keys(allPools).forEach((id) => {
//         const pool = allPools[id];
//         const tokenListSet = new Set(pool.tokens);
//         const containsTokenIn = tokenListSet.has(tokenIn);
//         const containsTokenOut = tokenListSet.has(tokenOut);
//         // This is a direct pool as has both tokenIn and tokenOut
//         if (containsTokenIn && containsTokenOut) {
//             directPools[pool.address] = pool;
//             return;
//         }
//         if (maxPools > 1) {
//             if (containsTokenIn && !containsTokenOut) {
//                 for (const hopToken of tokenListSet) {
//                     if (!hopsIn[hopToken.address]) hopsIn[hopToken.address] = new Set([]);
//                     hopsIn[hopToken.address].add(pool.address);
//                 }
//             } else if (!containsTokenIn && containsTokenOut) {
//                 for (const hopToken of [...tokenListSet]) {
//                     if (!hopsOut[hopToken.address]) hopsOut[hopToken.address] = new Set([]);
//                     hopsOut[hopToken.address].add(pool.address);
//                 }
//             }
//         }
//     });
//     return [directPools, hopsIn, hopsOut];
// }
// export function searchConnectionsTo(
//     token: Token,
//     poolsDict: { [id: string]: Pool },
//     toToken: Token
//   ): Path[] {
//     // this assumes that every pool in poolsDict contains toToken
//     const connections: Path[] = [];
//     for (const id in poolsDict) {
//       const pool = poolsDict[id];
//       if (pool.involvesToken(token)) {
//         const connection = createPath([token, toToken], [pool]);
//         connections.push(connection);
//       }
//     }
//     return connections;
//   }
//   export interface Path {
//     id: string; // pool address if direct path, contactenation of pool addresses if multihop
//     swaps: Swap[];
//   }
//   export interface Swap {
//     pool: string;
//     tokenIn: Token;
//     tokenOut: Token;
//     swapAmount?: BigNumber;
//   }
//   // Creates a path with pools.length hops
//   // i.e. tokens[0]>[Pool0]>tokens[1]>[Pool1]>tokens[2]>[Pool2]>tokens[3]
//   export function createPath(tokens: Token[], pools: Pool[]): Path {
//     let tI: Token, tO: Token;
//     const swaps: Swap[] = [];
//     // const poolPairData: PairData[] = [];
//     let id = '';
//     for (let i = 0; i < pools.length; i++) {
//       tI = tokens[i];
//       tO = tokens[i + 1];
//       // const poolPair = pools[i].parsePoolPairData(tI, tO);
//       // poolPairData.push(poolPair);
//       const swap: Swap = {
//         pool: pools[i].address,
//         tokenIn: tI,
//         tokenOut: tO,
//       };
//       swaps.push(swap);
//     }
//     const path: Path = {
//       id,
//       swaps,
//     };
//     return path;
//   }
// export function producePaths(
//     tokenIn: Token,
//     tokenOut: Token,
//     directPools: PoolDictionary,
//     hopsIn: PoolHops,
//     hopsOut: PoolHops,
//     pools: PoolDictionary
// ): Path[] {
//     const paths: Path[] = [];
//     // Create direct paths
//     for (const id in directPools) {
//         const path = createPath([tokenIn, tokenOut], [pools[id]]);
//         paths.push(path);
//     }
//     for (const hopToken in hopsIn) {
//         if (hopsOut[hopToken]) {
//             let highestNormalizedLiquidityFirst = ZERO; // Aux variable to find pool with most liquidity for pair (tokenIn -> hopToken)
//             let highestNormalizedLiquidityFirstPoolId: string | undefined; // Aux variable to find pool with most liquidity for pair (tokenIn -> hopToken)
//             let highestNormalizedLiquiditySecond = ZERO; // Aux variable to find pool with most liquidity for pair (hopToken -> tokenOut)
//             let highestNormalizedLiquiditySecondPoolId: string | undefined; // Aux variable to find pool with most liquidity for pair (hopToken -> tokenOut)
//             for (const poolInId of [...hopsIn[hopToken]]) {
//                 const poolIn = pools[poolInId.address];
//                 const poolPairData = SwapData.singleDataFromPool(
//                     tokenIn,
//                     hopToken,
//                     poolIn
//                 );
//                 // Cannot be strictly greater otherwise highestNormalizedLiquidityPoolId = 0 if hopTokens[i] balance is 0 in this pool.
//                 if (
//                     normalizedLiquidity.isGreaterThanOrEqualTo(
//                         highestNormalizedLiquidityFirst
//                     )
//                 ) {
//                     highestNormalizedLiquidityFirst = normalizedLiquidity;
//                     highestNormalizedLiquidityFirstPoolId = poolIn.id;
//                 }
//             }
//             for (const poolOutId of [...hopsOut[hopToken]]) {
//                 const poolOut = pools[poolOutId.address];
//                 const poolPairData = poolOut.parsePoolPairData(
//                     hopToken,
//                     tokenOut
//                 );
//                 const normalizedLiquidity =
//                     poolOut.getNormalizedLiquidity(poolPairData);
//                 // Cannot be strictly greater otherwise highestNormalizedLiquidityPoolId = 0 if hopTokens[i] balance is 0 in this pool.
//                 if (
//                     normalizedLiquidity.isGreaterThanOrEqualTo(
//                         highestNormalizedLiquiditySecond
//                     )
//                 ) {
//                     highestNormalizedLiquiditySecond = normalizedLiquidity;
//                     highestNormalizedLiquiditySecondPoolId = poolOut.address;
//                 }
//             }
//             if (
//                 highestNormalizedLiquidityFirstPoolId &&
//                 highestNormalizedLiquiditySecondPoolId
//             ) {
//                 const path = createPath(
//                     [tokenIn, hopToken, tokenOut],
//                     [
//                         pools[highestNormalizedLiquidityFirstPoolId],
//                         pools[highestNormalizedLiquiditySecondPoolId],
//                     ]
//                 );
//                 paths.push(path);
//             }
//         }
//     }
//     return paths;
// }
// export class RouteProvider {
//     cache: Record<string, { paths: Path[] }> = {};
//     // constructor(private readonly config: SorConfig) {}
//     /**
//      * Given a list of pools and a desired input/output, returns a set of possible paths to route through
//      */
//     getCandidatePaths(
//         tokenIn: Token,
//         tokenOut: Token,
//         swapType: SwapTypes,
//         poolsAllDict: PoolDictionary,
//         swapOptions: SwapOptions
//     ): Path[] {
//         if (!poolsAllDict) return [];
//         // If token pair has been processed before that info can be reused to speed up execution
//         const cache =
//             this.cache[
//             `${tokenIn.address}${tokenOut.address}${swapType}${swapOptions.timestamp}`
//             ];
//         // forceRefresh can be set to force fresh processing of paths/prices
//         if (!swapOptions.forceRefresh && !!cache) {
//             // Using pre-processed data from cache
//             return cache.paths;
//         }
//         const [directPools, hopsIn, hopsOut] = filterPoolsOfInterest(
//             poolsAllDict,
//             tokenIn,
//             tokenOut,
//             swapOptions.maxPools
//         );
//         const pathData = producePaths(
//             tokenIn,
//             tokenOut,
//             directPools,
//             hopsIn,
//             hopsOut,
//             poolsAllDict
//         );
//         const boostedPaths = getBoostedPaths(
//             tokenIn,
//             tokenOut,
//             poolsAllDict,
//             this.config
//         );
//         const pathsUsingStaBal = getPathsUsingStaBalPool(
//             tokenIn,
//             tokenOut,
//             poolsAllDict,
//             poolsAllDict,
//             this.config
//         );
//         const combinedPathData = pathData
//             .concat(...boostedPaths)
//             .concat(...pathsUsingStaBal);
//         const [paths] = calculatePathLimits(combinedPathData, swapType);
//         this.cache[`${tokenIn}${tokenOut}${swapType}${swapOptions.timestamp}`] =
//         {
//             paths: paths,
//         };
//         return paths;
//     }
//     /**
//      * Given a pool dictionary and a desired input/output, returns a set of possible paths to route through.
//      * @param {string} tokenIn - Address of tokenIn
//      * @param {string} tokenOut - Address of tokenOut
//      * @param {SwapTypes} swapType - SwapExactIn where the amount of tokens in (sent to the Pool) is known or SwapExactOut where the amount of tokens out (received from the Pool) is known.
//      * @param {PoolDictionary} poolsAllDict - Dictionary of pools.
//      * @param {number }maxPools - Maximum number of pools to hop through.
//      * @returns {NewPath[]} Array of possible paths sorted by liquidity.
//      */
//     getCandidatePathsFromDict(
//         tokenIn: string,
//         tokenOut: string,
//         swapType: SwapTypes,
//         poolsAllDict: PoolDictionary,
//         maxPools: number
//     ): NewPath[] {
//         if (Object.keys(poolsAllDict).length === 0) return [];
//         const [directPools, hopsIn, hopsOut] = filterPoolsOfInterest(
//             poolsAllDict,
//             tokenIn,
//             tokenOut,
//             maxPools
//         );
//         const pathData = producePaths(
//             tokenIn,
//             tokenOut,
//             directPools,
//             hopsIn,
//             hopsOut,
//             poolsAllDict
//         );
//         const boostedPaths = getBoostedPaths(
//             tokenIn,
//             tokenOut,
//             poolsAllDict,
//             this.config
//         );
//         const combinedPathData = pathData.concat(...boostedPaths);
//         const [paths] = calculatePathLimits(combinedPathData, swapType);
//         return paths;
//     }
// }

function toHex(currencyAmount) {
  return currencyAmount.raw.toHexString();
}

var ZERO_HEX = '0x0';
/**
 * Represents the Router, and has static methods for helping execute trades.
 */

var SwapRouter = /*#__PURE__*/function () {
  /**
   * Cannot be constructed.
   */
  function SwapRouter() {}
  /**
   * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
   * @param trade to produce call parameters for
   * @param options options for the call parameters
   */


  SwapRouter.swapCallParameters = function swapCallParameters(trade, options) {
    var etherIn = options.etherIn;
    var etherOut = options.etherOut; // the router does not support both ether in and out

    !!(etherIn && etherOut) ? process.env.NODE_ENV !== "production" ? invariant(false, 'ETHER_IN_OUT') : invariant(false) : void 0;
    !(!('ttl' in options) || options.ttl > 0) ? process.env.NODE_ENV !== "production" ? invariant(false, 'TTL') : invariant(false) : void 0;
    var to = validateAndParseAddress(options.recipient);
    var amountIn = toHex(trade.maximumAmountIn(options.allowedSlippage));
    var amountOut = toHex(trade.minimumAmountOut(options.allowedSlippage));
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
        case SwapType.EXACT_INPUT:
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

        case SwapType.EXACT_OUTPUT:
          !!useFeeOnTransfer ? process.env.NODE_ENV !== "production" ? invariant(false, 'EXACT_OUT_FOT') : invariant(false) : void 0;

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
    } else {
      var _path = trade.route.path.map(function (token) {
        return token.address;
      });

      var pairData = trade.route.swapData.map(function (p) {
        return p.poolRef;
      });

      switch (trade.tradeType) {
        case SwapType.EXACT_INPUT:
          if (etherIn) {
            methodName = 'onSwapExactETHForTokens'; // function multiSwapExactETHForTokens( address[][] calldata path, uint256[] memory routerId,
            // uint256 amountOutMin, uint256 deadline )

            args = [pairData, _path, amountOut, to, deadline];
            value = amountIn;
          } else if (etherOut) {
            methodName = 'onSwapExactTokensForETH'; // multiSwapExactTokensForETH( address[][] calldata path, uint256[] memory pools, uint256 amountIn,
            // uint256 amountOutMin, uint256 deadline )

            args = [pairData, _path, amountIn, amountOut, to, deadline];
            value = ZERO_HEX;
          } else {
            methodName = 'onSwapExactTokensForTokens'; // function onSwapExactTokensForTokens(
            //   address[] memory pools,
            //   address[] memory tokens,
            //   uint256 amountIn,
            //   uint256 amountOutMin,
            //   address to,
            //   uint256 deadline

            args = [pairData, _path, amountIn, amountOut, to, deadline];
            value = ZERO_HEX;
          }

          break;

        case SwapType.EXACT_OUTPUT:
          if (etherIn) {
            methodName = 'onSwapETHForExactTokens'; // multiSwapETHForExactTokens( address[][] calldata path, uint256[] memory pools, uint256 amountOut, uint256 deadline )

            args = [pairData, _path, amountOut, to, deadline];
            value = amountIn;
          } else if (etherOut) {
            methodName = 'onSwapTokensForExactETH'; // multiSwapTokensForExactETH( address[][] calldata path, uint256[] memory pools,
            // uint256 amountOut, uint256 amountInMax, uint256 deadline )

            args = [pairData, _path, amountOut, amountIn, to, deadline];
            value = ZERO_HEX;
          } else {
            methodName = 'onSwapTokensForExactTokens'; // multiSwapTokensForExactTokens( address[][] calldata path, uint256[] memory pools, 
            // uint256 amountOut, uint256 amountInMax,  uint256 deadline )

            args = [pairData, _path, amountOut, amountIn, to, deadline];
            value = ZERO_HEX;
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

  return SwapRouter;
}();

export { AmplifiedWeightedPair, ChainId, Currency, CurrencyAmount, FACTORY_ADDRESS, Fraction, INIT_CODE_HASH, INIT_CODE_HASH_WEIGHTED, InsufficientInputAmountError, InsufficientReservesError, MINIMUM_LIQUIDITY, MIN_POW_BASE_FREE_EXPONENT, NETWORK_CCY, ONE$1 as ONE, ONE_18, PairData, Percent, Pool, PoolType, Price, Rounding, Route, RouteProvider, STABLECOINS, STABLES_INDEX_MAP, STABLES_LP_TOKEN, STABLE_POOL_ADDRESS, STABLE_POOL_LP_ADDRESS, StablePool, StableSwapStorage, Swap, SwapRoute, SwapRouter, SwapType, Token, TokenAmount, TradeType, WEIGHTED_FACTORY_ADDRESS, WETH, WRAPPED_NETWORK_TOKENS, WeightedPool, WeightedSwapStorage, ZERO$1 as ZERO, _calcAllTokensInGivenExactLpOut, _calcDueTokenProtocolSwapFeeAmount, _calcInGivenOut, _calcLpInGivenExactTokensOut, _calcLpOutGivenExactTokensIn, _calcOutGivenIn, _calcTokenInGivenExactLpOut, _calcTokenOutGivenExactLpIn, _calcTokensOutGivenExactLpIn, _calculateInvariant, _computeExitExactTokensOutInvariantRatio, _computeJoinExactTokensInInvariantRatio, _ln, _ln_36, _xp, bondPrice, bondPriceUsingDebtRatio, calculateRemoveLiquidityExactIn, calculateRemoveLiquidityOneTokenExactIn, calculateSwapGivenIn, calculateSwapGivenOut, calculateTokenAmount, complement, currencyEquals, debtRatio, decode, decode112with18, divDown, divUp, exp, findPositionInMaxExpArray, fraction, fullPayoutFor, fullPayoutForUsingDebtRatio, generalExp, generalLog, getAmountIn, getAmountOut, getTotalValue, inputOutputComparator, ln, log, markdown, max, min, mulDown, mulUp, optimalExp, optimalLog, pairDataFromPools, payoutFor, pow, powDown, powUp, power, sqrrt, tradeComparator, valuation, wrappedCurrency };
//# sourceMappingURL=sdk.esm.js.map
