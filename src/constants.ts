import JSBI from 'jsbi'
// exports for external consumption
export type BigintIsh = JSBI | bigint | string

export enum ChainId {
  BSC_MAINNET = 56,
  BSC_TESTNET = 97,
  AVAX_MAINNET = 43114,
  AVAX_TESTNET = 43113,
  ARBITRUM_MAINNET = 42161,
  ARBITRUM_TETSNET_RINKEBY = 421611,
  MATIC_MAINNET = 137,
  MATIC_TESTNET = 80001,
}

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP
}

export const FACTORY_ADDRESS: { [chainId: number]: string } = {
  56: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
  97: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
  80001: '0xf10Bd0dA1f0e69c3334D7F8116C9082746EBC1B4',
  43113: '0xC07098cdCf93b2dc5c20E749cDd1ba69cB9AcEBe',
}

export const WEIGHTED_FACTORY_ADDRESS: { [chainId: number]: string } = {
  43113: '0x73622a125accA39410EdC159E04692014E79b82f',
}

// export const INIT_CODE_HASH = '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5'


export const INIT_CODE_HASH: { [chainId: number]: string } = {
  56: '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5',
  97: '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5',
  80001: '0xc2b3644608b464a0df0eb711ce9c6ce7535d1bd4d0154b8389738a3e7fbb1a61',
  43113: '0x197a29e2e90d809812f533e62529432f8e2741455e49d25365a66b4be2a453dd',
}

export const INIT_CODE_HASH_WEIGHTED: { [chainId: number]: string } = {
  43113: '0x4df8067145d0a795d56b39c1ba240740a830ae545df3b51d3d8552b02e265c75',
}

export const REQUIEM_PAIR_MANAGER:{[chainId:number]:string} ={
  43113:'0x47859E1deca75773C31408eDFDC45CF765EfAa18'
}

export const REQUIEM_WEIGHTED_PAIR_FACTORY:{[chainId:number]:string} = {
  43113:'0x2F1e1e45F396d119A55e0FA5B30B664Ce78835C7'
}

export const STABLE_POOL_ADDRESS: { [chainId: number]: string } = {
  43113: '0xb76c5C977F48C45d3f3234798D0051bdcA6dc656',
}

export const STABLE_POOL_LP_ADDRESS: { [chainId: number]: string } = {
  43113: '0x6a3a5f06aaa453b56ac44e84d87d9e3e3a3d6ab2'
}

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)

// exports for internal consumption
export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const TWO = JSBI.BigInt(2)
export const THREE = JSBI.BigInt(3)
export const FIVE = JSBI.BigInt(5)
export const TEN = JSBI.BigInt(10)
export const TENK = JSBI.BigInt(10000)
export const _100 = JSBI.BigInt(100)
export const FEES_NUMERATOR = JSBI.BigInt(9975)
export const FEES_DENOMINATOR = JSBI.BigInt(10000)

export enum SolidityType {
  uint8 = 'uint8',
  uint256 = 'uint256'
}

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: JSBI.BigInt('0xff'),
  [SolidityType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
}
