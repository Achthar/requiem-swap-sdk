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
  43113: '0xacd3602152763C3AAFA705D8a90C36661ecD7d46',
}

// export const INIT_CODE_HASH = '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5'


export const INIT_CODE_HASH: { [chainId: number]: string } = {
  56: '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5',
  97: '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5',
  80001: '0xc2b3644608b464a0df0eb711ce9c6ce7535d1bd4d0154b8389738a3e7fbb1a61',
  43113: '0x197a29e2e90d809812f533e62529432f8e2741455e49d25365a66b4be2a453dd',
}

export const INIT_CODE_HASH_WEIGHTED: { [chainId: number]: string } = {
  43113: '0xbeec252b6527ff023d9f20fa336f9f131a002be662ce64ef7f9ed17b5ea8b591',
}

export const REQUIEM_PAIR_MANAGER:{[chainId:number]:string} ={
  43113:'0x4de697f41A2Da1c5a6a6905a95438E0aFbBa2382'
}

export const STABLE_POOL_ADDRESS: { [chainId: number]: string } = {
  43113: '0x1420e95763c97D8A8fA6AA32d1715074765812CD',
}

export const STABLE_POOL_LP_ADDRESS: { [chainId: number]: string } = {
  43113: '0x5a42f231cb718a646cec2f73882760b4e67128b3'
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
