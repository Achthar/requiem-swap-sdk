import { BigNumber } from 'ethers'

// exports for external consumption
export type BigintIsh = BigNumber | bigint | string | number

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT
}

export const FACTORY_ADDRESS: { [chainId: number]: string } = {
  56: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
  97: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
  80001: '0xf10Bd0dA1f0e69c3334D7F8116C9082746EBC1B4',
  43113: '0xC07098cdCf93b2dc5c20E749cDd1ba69cB9AcEBe',
}

export const WEIGHTED_FACTORY_ADDRESS: { [chainId: number]: string } = {
  43113: '0xacd3602152763C3AAFA705D8a90C36661ecD7d46',
  42261: '0x0459e858F17ef5D927625f34602432f4fac6941e',
  110001: '0xe092CB3124aF36a0B851839D8EC51CaaD9a3DCD0'
}

// export const INIT_CODE_HASH = '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5'


export const INIT_CODE_HASH: { [chainId: number]: string } = {
  56: '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5',
  97: '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5',
  80001: '0xc2b3644608b464a0df0eb711ce9c6ce7535d1bd4d0154b8389738a3e7fbb1a61',
  43113: '0x0865ff20af2c8d0b18c74020d2df989c6840f40dbdc7f75f501820a7122786e4',
}

export const INIT_CODE_HASH_WEIGHTED: { [chainId: number]: string } = {
  43113: '0xbeec252b6527ff023d9f20fa336f9f131a002be662ce64ef7f9ed17b5ea8b591',
  42261: '0x0865ff20af2c8d0b18c74020d2df989c6840f40dbdc7f75f501820a7122786e4',
  110001: '0x0865ff20af2c8d0b18c74020d2df989c6840f40dbdc7f75f501820a7122786e4'
}

export const STABLE_POOL_ADDRESS: { [chainId: number]: string } = {
  43113: '0x0Be60C571BdA7841D8F6eE68afDBa648EC710fD7',
  42261: '0x2a90276992ddC21C3585FE50f5B43D0Cf62aDe03',
  110001: '0x211F00f4071A4af8f0cC289d9853d778047DB8Ba',
}

export const STABLE_POOL_LP_ADDRESS: { [chainId: number]: string } = {
  43113: '0x3372de341a07418765ae12f77aee9029eaa4442a',
  42261: '0x9364E91ca784ca51f88dE2a76a35Ba2665bdad04',
  110001: '0x029f9f8e2c27627341824120ee814F31a1551256'
}

export const MINIMUM_LIQUIDITY = BigNumber.from(1000)

// exports for internal consumption
export const ZERO = BigNumber.from(0)
export const ONE = BigNumber.from(1)
export const TWO = BigNumber.from(2)
export const THREE = BigNumber.from(3)
export const FIVE = BigNumber.from(5)
export const TEN = BigNumber.from(10)
export const TENK = BigNumber.from(10000)
export const _100 = BigNumber.from(100)
export const FEES_NUMERATOR = BigNumber.from(9975)
export const FEES_DENOMINATOR = BigNumber.from(10000)

export enum SolidityType {
  uint8 = 'uint8',
  uint256 = 'uint256'
}

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: BigNumber.from('0xff'),
  [SolidityType.uint256]: BigNumber.from('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
}