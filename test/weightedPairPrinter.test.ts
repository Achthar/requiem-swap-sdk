import { ChainId, Token, WeightedPair, TokenAmount, WETH, Price } from '../src'
import JSBI from 'jsbi'
// import { BigNumber } from '@ethersproject/bignumber'

describe('_WeightedPairPrinter', () => {
  const USDC = new Token(ChainId.BSC_MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 18, 'USDC', 'USD Coin')
  const DAI = new Token(ChainId.BSC_MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')
  const weightA = JSBI.BigInt('44')
  const fee = JSBI.BigInt('14')
  describe('constructor', () => {
    it('cannot be used for tokens on different chains', () => {
      expect(() => new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(WETH[ChainId.BSC_TESTNET], '100'), weightA, fee)).toThrow(
        'CHAIN_IDS'
      )
    })
  })

  describe('#getAddress', () => {
    it('returns the correct address', () => {
      expect(WeightedPair.getAddress(USDC, DAI, weightA, fee)).toEqual('0xAE461cA67B15dc8dc81CE7615e0320dA1A9aB8D5')
    })
  })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      expect(new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100'), weightA, fee).token0).toEqual(DAI)
      expect(new WeightedPair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '100'), weightA, fee).token0).toEqual(DAI)
    })
  })
  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      expect(new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100'), weightA, fee).token1).toEqual(USDC)
      expect(new WeightedPair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '100'), weightA, fee).token1).toEqual(USDC)
    })
  })
  describe('#reserve0', () => {
    it('always comes from the token that sorts before', () => {
      expect(new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '101'), weightA, fee).reserve0).toEqual(
        new TokenAmount(DAI, '101')
      )
      expect(new WeightedPair(new TokenAmount(DAI, '101'), new TokenAmount(USDC, '100'), weightA, fee).reserve0).toEqual(
        new TokenAmount(DAI, '101')
      )
    })
  })
  describe('#reserve1', () => {
    it('always comes from the token that sorts after', () => {
      expect(new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '101'), weightA, fee).reserve1).toEqual(
        new TokenAmount(USDC, '100')
      )
      expect(new WeightedPair(new TokenAmount(DAI, '101'), new TokenAmount(USDC, '100'), weightA, fee).reserve1).toEqual(
        new TokenAmount(USDC, '100')
      )
    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(new WeightedPair(new TokenAmount(USDC, '101'), new TokenAmount(DAI, '100'), weightA, fee).token0Price).toEqual(
        new Price(DAI, USDC, '100', '101')
      )
      expect(new WeightedPair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '101'), weightA, fee).token0Price).toEqual(
        new Price(DAI, USDC, '100', '101')
      )
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(new WeightedPair(new TokenAmount(USDC, '101'), new TokenAmount(DAI, '100'), weightA, fee).token1Price).toEqual(
        new Price(USDC, DAI, '101', '100')
      )
      expect(new WeightedPair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '101'), weightA, fee).token1Price).toEqual(
        new Price(USDC, DAI, '101', '100')
      )
    })
  })

  describe('#priceOf', () => {
    const pair = new WeightedPair(new TokenAmount(USDC, '101'), new TokenAmount(DAI, '100'), weightA, fee)
    it('returns price of token in terms of other token', () => {
      expect(pair.priceOf(DAI)).toEqual(pair.token0Price)
      expect(pair.priceOf(USDC)).toEqual(pair.token1Price)
    })

    it('throws if invalid token', () => {
      expect(() => pair.priceOf(WETH[ChainId.BSC_MAINNET])).toThrow('TOKEN')
    })
  })

  describe('#reserveOf', () => {
    it('returns reserves of the given token', () => {
      expect(new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '101'), weightA, fee).reserveOf(USDC)).toEqual(
        new TokenAmount(USDC, '100')
      )
      expect(new WeightedPair(new TokenAmount(DAI, '101'), new TokenAmount(USDC, '100'), weightA, fee).reserveOf(USDC)).toEqual(
        new TokenAmount(USDC, '100')
      )
    })

    it('throws if not in the pair', () => {
      expect(() =>
        new WeightedPair(new TokenAmount(DAI, '101'), new TokenAmount(USDC, '100'), weightA, fee).reserveOf(WETH[ChainId.BSC_MAINNET])
      ).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      expect(new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100'), weightA, fee).chainId).toEqual(ChainId.BSC_MAINNET)
      expect(new WeightedPair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '100'), weightA, fee).chainId).toEqual(ChainId.BSC_MAINNET)
    })
  })
  describe('#involvesToken', () => {
    expect(new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100'), weightA, fee).involvesToken(USDC)).toEqual(true)
    expect(new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100'), weightA, fee).involvesToken(DAI)).toEqual(true)
    expect(
      new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100'), weightA, fee).involvesToken(WETH[ChainId.BSC_MAINNET])
    ).toEqual(false)
  })

  describe('#calcualtes', () => {
    const weight50 = JSBI.BigInt(50)
    const fee20 = JSBI.BigInt(2)
    const pair = new WeightedPair(new TokenAmount(USDC, '10000'), new TokenAmount(DAI, '10000'), weight50, fee20)
    const amountIn = new TokenAmount(DAI, '12')
    console.log("In1: ", amountIn.raw.toString())
    const [out,] = pair.getOutputAmount(amountIn)
    console.log("Out1: ", out.raw.toString())

    const weight20 = JSBI.BigInt(20)
    const fee10 = JSBI.BigInt(10)
    const pair2 = new WeightedPair(new TokenAmount(USDC, '10000000'), new TokenAmount(DAI, '10000000'), weight20, fee10)
    const amountIn2 = new TokenAmount(DAI, '12')
    console.log("In1: ", amountIn2.raw.toString())
    const [out2,] = pair2.getOutputAmount(amountIn2)
    console.log("Out1: ", out2.raw.toString())
    // new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100'), weightA, fee)

    //   new WeightedPair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100'), weightA, fee)

    // const FIXED_1 = BigNumber.from('0x080000000000000000000000000000000')
    // const FIXED_2 = BigNumber.from('0x100000000000000000000000000000000')
    // const MAX_NUM = BigNumber.from('0x200000000000000000000000000000000')

    // const LN2_NUMERATOR = BigNumber.from('0x3f80fe03f80fe03f80fe03f80fe03f8')
    // const LN2_DENOMINATOR = BigNumber.from('0x5b9de1d10bf4103d647b0955897ba80')

    // const OPT_LOG_MAX_VAL = BigNumber.from('0x15bf0a8b1457695355fb8ac404e7a79e3')
    // const OPT_EXP_MAX_VAL = BigNumber.from('0x800000000000000000000000000000000')

    // const LAMBERT_CONV_RADIUS = BigNumber.from('0x002f16ac6c59de6f8d5d6f63c1482a7c86')
    // const LAMBERT_POS2_SAMPLE = BigNumber.from('0x0003060c183060c183060c183060c18306')
    // const LAMBERT_POS2_MAXVAL = BigNumber.from('0x01af16ac6c59de6f8d5d6f63c1482a7c80')
    // const LAMBERT_POS3_MAXVAL = BigNumber.from('0x6b22d43e72c326539cceeef8bb48f255ff')

    // const MAX_UNF_WEIGHT = BigNumber.from('0x10c6f7a0b5ed8d36b4c7f34938583621fafc8b0079a2834d26fa3fcc9ea9')

    // console.log("const FIXED_1 = JSBI.BigInt('" + FIXED_1.toBigInt().toString() + "')\nconst FIXED_2 = JSBI.BigInt('" + FIXED_2.toBigInt().toString() + "')\nconst MAX_NUM = JSBI.BigInt('" + MAX_NUM.toBigInt().toString() + "')\nconst LN2_NUMERATOR = JSBI.BigInt('" + LN2_NUMERATOR.toBigInt().toString() + "')\nconst LN2_DENOMINATOR = JSBI.BigInt('" + LN2_DENOMINATOR.toBigInt().toString() + "')\nconst OPT_LOG_MAX_VAL = JSBI.BigInt('" + OPT_LOG_MAX_VAL.toBigInt().toString() + "')\nconst OPT_EXP_MAX_VAL = JSBI.BigInt('" + OPT_EXP_MAX_VAL.toBigInt().toString() + "')\nconst LAMBERT_CONV_RADIUS = JSBI.BigInt('" + LAMBERT_CONV_RADIUS.toBigInt().toString() + "')\nconst LAMBERT_POS2_SAMPLE = JSBI.BigInt('" + LAMBERT_POS2_SAMPLE.toBigInt().toString() + "')\nconst LAMBERT_POS2_MAXVAL = JSBI.BigInt('" + LAMBERT_POS2_MAXVAL.toBigInt().toString() + "')\nconst LAMBERT_POS3_MAXVAL = JSBI.BigInt('" + LAMBERT_POS3_MAXVAL.toBigInt().toString() + "')\n")

    // console.log("const MAX_UNF_WEIGHT = JSBI.BigInt('" + MAX_UNF_WEIGHT.toBigInt().toString() + "')\n")

    // // const  maxExpArray = new Array<BigNumber>(128)

    // // function initMaxExpArray() internal {
    // console.log("maxExpArray[32] = JSBI.BigInt('" + BigNumber.from('0x1c35fedd14ffffffffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[33] = JSBI.BigInt('" + BigNumber.from('0x1b0ce43b323fffffffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[34] = JSBI.BigInt('" + BigNumber.from('0x19f0028ec1ffffffffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[35] = JSBI.BigInt('" + BigNumber.from('0x18ded91f0e7fffffffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[36] = JSBI.BigInt('" + BigNumber.from('0x17d8ec7f0417ffffffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[37] = JSBI.BigInt('" + BigNumber.from('0x16ddc6556cdbffffffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[38] = JSBI.BigInt('" + BigNumber.from('0x15ecf52776a1ffffffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[39] = JSBI.BigInt('" + BigNumber.from('0x15060c256cb2ffffffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[40] = JSBI.BigInt('" + BigNumber.from('0x1428a2f98d72ffffffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[41] = JSBI.BigInt('" + BigNumber.from('0x13545598e5c23fffffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[42] = JSBI.BigInt('" + BigNumber.from('0x1288c4161ce1dfffffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[43] = JSBI.BigInt('" + BigNumber.from('0x11c592761c666fffffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[44] = JSBI.BigInt('" + BigNumber.from('0x110a688680a757ffffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[45] = JSBI.BigInt('" + BigNumber.from('0x1056f1b5bedf77ffffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[46] = JSBI.BigInt('" + BigNumber.from('0x0faadceceeff8bffffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[47] = JSBI.BigInt('" + BigNumber.from('0x0f05dc6b27edadffffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[48] = JSBI.BigInt('" + BigNumber.from('0x0e67a5a25da4107fffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[49] = JSBI.BigInt('" + BigNumber.from('0x0dcff115b14eedffffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[50] = JSBI.BigInt('" + BigNumber.from('0x0d3e7a392431239fffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[51] = JSBI.BigInt('" + BigNumber.from('0x0cb2ff529eb71e4fffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[52] = JSBI.BigInt('" + BigNumber.from('0x0c2d415c3db974afffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[53] = JSBI.BigInt('" + BigNumber.from('0x0bad03e7d883f69bffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[54] = JSBI.BigInt('" + BigNumber.from('0x0b320d03b2c343d5ffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[55] = JSBI.BigInt('" + BigNumber.from('0x0abc25204e02828dffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[56] = JSBI.BigInt('" + BigNumber.from('0x0a4b16f74ee4bb207fffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[57] = JSBI.BigInt('" + BigNumber.from('0x09deaf736ac1f569ffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[58] = JSBI.BigInt('" + BigNumber.from('0x0976bd9952c7aa957fffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[59] = JSBI.BigInt('" + BigNumber.from('0x09131271922eaa606fffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[60] = JSBI.BigInt('" + BigNumber.from('0x08b380f3558668c46fffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[61] = JSBI.BigInt('" + BigNumber.from('0x0857ddf0117efa215bffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[62] = JSBI.BigInt('" + BigNumber.from('0x07ffffffffffffffffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[63] = JSBI.BigInt('" + BigNumber.from('0x07abbf6f6abb9d087fffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[64] = JSBI.BigInt('" + BigNumber.from('0x075af62cbac95f7dfa7fffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[65] = JSBI.BigInt('" + BigNumber.from('0x070d7fb7452e187ac13fffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[66] = JSBI.BigInt('" + BigNumber.from('0x06c3390ecc8af379295fffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[67] = JSBI.BigInt('" + BigNumber.from('0x067c00a3b07ffc01fd6fffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[68] = JSBI.BigInt('" + BigNumber.from('0x0637b647c39cbb9d3d27ffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[69] = JSBI.BigInt('" + BigNumber.from('0x05f63b1fc104dbd39587ffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[70] = JSBI.BigInt('" + BigNumber.from('0x05b771955b36e12f7235ffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[71] = JSBI.BigInt('" + BigNumber.from('0x057b3d49dda84556d6f6ffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[72] = JSBI.BigInt('" + BigNumber.from('0x054183095b2c8ececf30ffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[73] = JSBI.BigInt('" + BigNumber.from('0x050a28be635ca2b888f77fffffffffffff').toBigInt().toString() + "')\nmaxExpArray[74] = JSBI.BigInt('" + BigNumber.from('0x04d5156639708c9db33c3fffffffffffff').toBigInt().toString() + "')\nmaxExpArray[75] = JSBI.BigInt('" + BigNumber.from('0x04a23105873875bd52dfdfffffffffffff').toBigInt().toString() + "')\nmaxExpArray[76] = JSBI.BigInt('" + BigNumber.from('0x0471649d87199aa990756fffffffffffff').toBigInt().toString() + "')\nmaxExpArray[77] = JSBI.BigInt('" + BigNumber.from('0x04429a21a029d4c1457cfbffffffffffff').toBigInt().toString() + "')\nmaxExpArray[78] = JSBI.BigInt('" + BigNumber.from('0x0415bc6d6fb7dd71af2cb3ffffffffffff').toBigInt().toString() + "')\nmaxExpArray[79] = JSBI.BigInt('" + BigNumber.from('0x03eab73b3bbfe282243ce1ffffffffffff').toBigInt().toString() + "')\nmaxExpArray[80] = JSBI.BigInt('" + BigNumber.from('0x03c1771ac9fb6b4c18e229ffffffffffff').toBigInt().toString() + "')\nmaxExpArray[81] = JSBI.BigInt('" + BigNumber.from('0x0399e96897690418f785257fffffffffff').toBigInt().toString() + "')\nmaxExpArray[82] = JSBI.BigInt('" + BigNumber.from('0x0373fc456c53bb779bf0ea9fffffffffff').toBigInt().toString() + "')\nmaxExpArray[83] = JSBI.BigInt('" + BigNumber.from('0x034f9e8e490c48e67e6ab8bfffffffffff').toBigInt().toString() + "')\nmaxExpArray[84] = JSBI.BigInt('" + BigNumber.from('0x032cbfd4a7adc790560b3337ffffffffff').toBigInt().toString() + "')\nmaxExpArray[85] = JSBI.BigInt('" + BigNumber.from('0x030b50570f6e5d2acca94613ffffffffff').toBigInt().toString() + "')\nmaxExpArray[86] = JSBI.BigInt('" + BigNumber.from('0x02eb40f9f620fda6b56c2861ffffffffff').toBigInt().toString() + "')\nmaxExpArray[87] = JSBI.BigInt('" + BigNumber.from('0x02cc8340ecb0d0f520a6af58ffffffffff').toBigInt().toString() + "')\nmaxExpArray[88] = JSBI.BigInt('" + BigNumber.from('0x02af09481380a0a35cf1ba02ffffffffff').toBigInt().toString() + "')\nmaxExpArray[89] = JSBI.BigInt('" + BigNumber.from('0x0292c5bdd3b92ec810287b1b3fffffffff').toBigInt().toString() + "')\nmaxExpArray[90] = JSBI.BigInt('" + BigNumber.from('0x0277abdcdab07d5a77ac6d6b9fffffffff').toBigInt().toString() + "')\nmaxExpArray[91] = JSBI.BigInt('" + BigNumber.from('0x025daf6654b1eaa55fd64df5efffffffff').toBigInt().toString() + "')\nmaxExpArray[92] = JSBI.BigInt('" + BigNumber.from('0x0244c49c648baa98192dce88b7ffffffff').toBigInt().toString() + "')\nmaxExpArray[93] = JSBI.BigInt('" + BigNumber.from('0x022ce03cd5619a311b2471268bffffffff').toBigInt().toString() + "')\nmaxExpArray[94] = JSBI.BigInt('" + BigNumber.from('0x0215f77c045fbe885654a44a0fffffffff').toBigInt().toString() + "')\nmaxExpArray[95] = JSBI.BigInt('" + BigNumber.from('0x01ffffffffffffffffffffffffffffffff').toBigInt().toString() + "')\nmaxExpArray[96] = JSBI.BigInt('" + BigNumber.from('0x01eaefdbdaaee7421fc4d3ede5ffffffff').toBigInt().toString() + "')\nmaxExpArray[97] = JSBI.BigInt('" + BigNumber.from('0x01d6bd8b2eb257df7e8ca57b09bfffffff').toBigInt().toString() + "')\nmaxExpArray[98] = JSBI.BigInt('" + BigNumber.from('0x01c35fedd14b861eb0443f7f133fffffff').toBigInt().toString() + "')\nmaxExpArray[99] = JSBI.BigInt('" + BigNumber.from('0x01b0ce43b322bcde4a56e8ada5afffffff').toBigInt().toString() + "')\nmaxExpArray[100] = JSBI.BigInt('" + BigNumber.from('0x019f0028ec1fff007f5a195a39dfffffff').toBigInt().toString() + "')\nmaxExpArray[101] = JSBI.BigInt('" + BigNumber.from('0x018ded91f0e72ee74f49b15ba527ffffff').toBigInt().toString() + "')\nmaxExpArray[102] = JSBI.BigInt('" + BigNumber.from('0x017d8ec7f04136f4e5615fd41a63ffffff').toBigInt().toString() + "')\nmaxExpArray[103] = JSBI.BigInt('" + BigNumber.from('0x016ddc6556cdb84bdc8d12d22e6fffffff').toBigInt().toString() + "')\nmaxExpArray[104] = JSBI.BigInt('" + BigNumber.from('0x015ecf52776a1155b5bd8395814f7fffff').toBigInt().toString() + "')\nmaxExpArray[105] = JSBI.BigInt('" + BigNumber.from('0x015060c256cb23b3b3cc3754cf40ffffff').toBigInt().toString() + "')\nmaxExpArray[106] = JSBI.BigInt('" + BigNumber.from('0x01428a2f98d728ae223ddab715be3fffff').toBigInt().toString() + "')\nmaxExpArray[107] = JSBI.BigInt('" + BigNumber.from('0x013545598e5c23276ccf0ede68034fffff').toBigInt().toString() + "')\nmaxExpArray[108] = JSBI.BigInt('" + BigNumber.from('0x01288c4161ce1d6f54b7f61081194fffff').toBigInt().toString() + "')\nmaxExpArray[109] = JSBI.BigInt('" + BigNumber.from('0x011c592761c666aa641d5a01a40f17ffff').toBigInt().toString() + "')\nmaxExpArray[110] = JSBI.BigInt('" + BigNumber.from('0x0110a688680a7530515f3e6e6cfdcdffff').toBigInt().toString() + "')\nmaxExpArray[111] = JSBI.BigInt('" + BigNumber.from('0x01056f1b5bedf75c6bcb2ce8aed428ffff').toBigInt().toString() + "')\nmaxExpArray[112] = JSBI.BigInt('" + BigNumber.from('0x00faadceceeff8a0890f3875f008277fff').toBigInt().toString() + "')\nmaxExpArray[113] = JSBI.BigInt('" + BigNumber.from('0x00f05dc6b27edad306388a600f6ba0bfff').toBigInt().toString() + "')\nmaxExpArray[114] = JSBI.BigInt('" + BigNumber.from('0x00e67a5a25da41063de1495d5b18cdbfff').toBigInt().toString() + "')\nmaxExpArray[115] = JSBI.BigInt('" + BigNumber.from('0x00dcff115b14eedde6fc3aa5353f2e4fff').toBigInt().toString() + "')\nmaxExpArray[116] = JSBI.BigInt('" + BigNumber.from('0x00d3e7a3924312399f9aae2e0f868f8fff').toBigInt().toString() + "')\nmaxExpArray[117] = JSBI.BigInt('" + BigNumber.from('0x00cb2ff529eb71e41582cccd5a1ee26fff').toBigInt().toString() + "')\nmaxExpArray[118] = JSBI.BigInt('" + BigNumber.from('0x00c2d415c3db974ab32a51840c0b67edff').toBigInt().toString() + "')\nmaxExpArray[119] = JSBI.BigInt('" + BigNumber.from('0x00bad03e7d883f69ad5b0a186184e06bff').toBigInt().toString() + "')\nmaxExpArray[120] = JSBI.BigInt('" + BigNumber.from('0x00b320d03b2c343d4829abd6075f0cc5ff').toBigInt().toString() + "')\nmaxExpArray[121] = JSBI.BigInt('" + BigNumber.from('0x00abc25204e02828d73c6e80bcdb1a95bf').toBigInt().toString() + "')\nmaxExpArray[122] = JSBI.BigInt('" + BigNumber.from('0x00a4b16f74ee4bb2040a1ec6c15fbbf2df').toBigInt().toString() + "')\nmaxExpArray[123] = JSBI.BigInt('" + BigNumber.from('0x009deaf736ac1f569deb1b5ae3f36c130f').toBigInt().toString() + "')\nmaxExpArray[124] = JSBI.BigInt('" + BigNumber.from('0x00976bd9952c7aa957f5937d790ef65037').toBigInt().toString() + "')\nmaxExpArray[125] = JSBI.BigInt('" + BigNumber.from('0x009131271922eaa6064b73a22d0bd4f2bf').toBigInt().toString() + "')\nmaxExpArray[126] = JSBI.BigInt('" + BigNumber.from('0x008b380f3558668c46c91c49a2f8e967b9').toBigInt().toString() + "')\nmaxExpArray[127] = JSBI.BigInt('" + BigNumber.from('0x00857ddf0117efa215952912839f6473e6').toBigInt().toString() + "')\n")


    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x3442c4e6074a82f1797f72ac0000000').toString() + "')");
    // // add x^02 * (33! / 02!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x116b96f757c380fb287fd0e40000000').toString() + "')");
    // // add x^03 * (33! / 03!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x045ae5bdd5f0e03eca1ff4390000000').toString() + "')");
    // // add x^04 * (33! / 04!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x00defabf91302cd95b9ffda50000000').toString() + "')");
    // // add x^05 * (33! / 05!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x002529ca9832b22439efff9b8000000').toString() + "')");
    // // add x^06 * (33! / 06!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x00054f1cf12bd04e516b6da88000000').toString() + "')");
    // // add x^07 * (33! / 07!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x0000a9e39e257a09ca2d6db51000000').toString() + "')");
    // // add x^08 * (33! / 08!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x000012e066e7b839fa050c309000000').toString() + "')");
    // // add x^09 * (33! / 09!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x000001e33d7d926c329a1ad1a800000').toString() + "')");
    // // add x^10 * (33! / 10!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x0000002bee513bdb4a6b19b5f800000').toString() + "')");
    // // add x^11 * (33! / 11!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x00000003a9316fa79b88eccf2a00000').toString() + "')");
    // // add x^12 * (33! / 12!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x0000000048177ebe1fa812375200000').toString() + "')");
    // // add x^13 * (33! / 13!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x0000000005263fe90242dcbacf00000').toString() + "')");
    // // add x^14 * (33! / 14!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x000000000057e22099c030d94100000').toString() + "')");
    // // add x^15 * (33! / 15!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x0000000000057e22099c030d9410000').toString() + "')");
    // // add x^16 * (33! / 16!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x00000000000052b6b54569976310000').toString() + "')");
    // // add x^17 * (33! / 17!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x00000000000004985f67696bf748000').toString() + "')");
    // // add x^18 * (33! / 18!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x000000000000003dea12ea99e498000').toString() + "')");
    // // add x^19 * (33! / 19!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x00000000000000031880f2214b6e000').toString() + "')");
    // // add x^20 * (33! / 20!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x000000000000000025bcff56eb36000').toString() + "')");
    // // add x^21 * (33! / 21!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x000000000000000001b722e10ab1000').toString() + "')");
    // // add x^22 * (33! / 22!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x0000000000000000001317c70077000').toString() + "')");
    // // add x^23 * (33! / 23!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x00000000000000000000cba84aafa00').toString() + "')");
    // // add x^24 * (33! / 24!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x00000000000000000000082573a0a00').toString() + "')");
    // // add x^25 * (33! / 25!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x00000000000000000000005035ad900').toString() + "')");
    // // add x^26 * (33! / 26!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x000000000000000000000002f881b00').toString() + "')");
    // // add x^27 * (33! / 27!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x0000000000000000000000001b29340').toString() + "')");
    // // add x^28 * (33! / 28!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x00000000000000000000000000efc40').toString() + "')");
    // // add x^29 * (33! / 29!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x0000000000000000000000000007fe0').toString() + "')");
    // // add x^30 * (33! / 30!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x0000000000000000000000000000420').toString() + "')");
    // // add x^31 * (33! / 31!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x0000000000000000000000000000021').toString() + "')");
    // // add x^32 * (33! / 32!)

    // console.log("res = JSBI.BigInt(rest, JSBI.multiply(xi, JSBI.BigInt('" + BigNumber.from('0x0000000000000000000000000000001').toString() + "')");
    // // add x^33 * (33! / 33!)

    // /**
    //     * @dev computes log(x / FIXED_1) * FIXED_1
    //     * Input range: FIXED_1 <= x <= OPT_LOG_MAX_VAL - 1
    //     * Auto-generated via "PrintFunctionOptimalLog.py"
    //     * Detailed description:
    //     * - Rewrite the input as a product of natural exponents and a single residual r, such that 1 < r < 2
    //     * - The natural logarithm of each (pre-calculated) exponent is the degree of the exponent
    //     * - The natural logarithm of r is calculated via Taylor series for log(1 + x), where x = r - 1
    //     * - The natural logarithm of the input is calculated by summing up the intermediate results above
    //     * - For example: log(250) = log(e^4 * e^1 * e^0.5 * 1.021692859) = 4 + 1 + 0.5 + log(1 + 0.021692859)
    //     */
    // console.log("function optimalLog(uint256 x) internal pure returns (uint256) {")
    // // function optimalLog(uint256 x) internal pure returns (uint256) {
    // //   uint256 res = 0;

    // //   uint256 y;
    // //   uint256 z;
    // //   uint256 w;

    // console.log("if (JSBI.greaterThanOrEqual(x, JSBI.BigInt('" + BigNumber.from('0xd3094c70f034de4b96ff7d5b6f99fcd8').toString() + "'))) {")
    // console.log("res =  JSBI.add( res, JSBI.BigInt('", BigNumber.from('0x40000000000000000000000000000000').toString() + "'))")
    // console.log("x = JSBI.divide(JSBI.multiply(x, FIXED_1), JSBI.BigInt('" + BigNumber.from('0xd3094c70f034de4b96ff7d5b6f99fcd8') + ",)\n}");

    // // add 1 / 2^1
    // console.log("if (JSBI.greaterThanOrEqual(x, JSBI.BigInt('" + BigNumber.from('0xa45af1e1f40c333b3de1db4dd55f29a7').toString() + "'))) {")
    // console.log("res =  JSBI.add( res, JSBI.BigInt('", BigNumber.from('0x20000000000000000000000000000000').toString() + ",)\n}")
    // console.log("x = JSBI.divide(JSBI.multiply(x, FIXED_1), JSBI.BigInt('" + BigNumber.from('0xa45af1e1f40c333b3de1db4dd55f29a7') + ",)\n}");

    // // add 1 / 2^2
    // console.log("if (JSBI.greaterThanOrEqual(x, JSBI.BigInt('" + BigNumber.from('0x910b022db7ae67ce76b441c27035c6a1').toString() + "'))) {")
    // console.log("res =  JSBI.add( res, JSBI.BigInt('", BigNumber.from('0x10000000000000000000000000000000').toString() + ",)\n}")
    // console.log("x = JSBI.divide(JSBI.multiply(x, FIXED_1), JSBI.BigInt('" + BigNumber.from('0x910b022db7ae67ce76b441c27035c6a1') + ",)\n}");

    // // add 1 / 2^3
    // console.log("if (JSBI.greaterThanOrEqual(x, JSBI.BigInt('" + BigNumber.from('0x88415abbe9a76bead8d00cf112e4d4a8').toString() + "'))) {")
    // console.log("res =  JSBI.add( res, JSBI.BigInt('", BigNumber.from('0x08000000000000000000000000000000').toString() + ",)\n}")
    // console.log("x = JSBI.divide(JSBI.multiply(x, FIXED_1), JSBI.BigInt('" + BigNumber.from('0x88415abbe9a76bead8d00cf112e4d4a8') + ",)\n}");

    // // add 1 / 2^4
    // console.log("if (JSBI.greaterThanOrEqual(x, JSBI.BigInt('" + BigNumber.from('0x84102b00893f64c705e841d5d4064bd3').toString() + "'))) {")
    // console.log("res =  JSBI.add( res, JSBI.BigInt('", BigNumber.from('0x04000000000000000000000000000000').toString() + ",)\n}")
    // console.log("x = JSBI.divide(JSBI.multiply(x, FIXED_1), JSBI.BigInt('" + BigNumber.from('0x84102b00893f64c705e841d5d4064bd3') + ",)\n}");

    // // add 1 / 2^5
    // console.log("if (JSBI.greaterThanOrEqual(x, JSBI.BigInt('" + BigNumber.from('0x8204055aaef1c8bd5c3259f4822735a2').toString() + "'))) {")
    // console.log("res =  JSBI.add( res, JSBI.BigInt('", BigNumber.from('0x02000000000000000000000000000000').toString() + ",)\n}")
    // console.log("x = JSBI.divide(JSBI.multiply(x, FIXED_1), JSBI.BigInt('" + BigNumber.from('0x8204055aaef1c8bd5c3259f4822735a2') + ",)\n}");

    // // add 1 / 2^6
    // console.log("if (JSBI.greaterThanOrEqual(x, JSBI.BigInt('" + BigNumber.from('0x810100ab00222d861931c15e39b44e99').toString() + "'))) {")
    // console.log("res =  JSBI.add( res, JSBI.BigInt('", BigNumber.from('0x01000000000000000000000000000000').toString() + ",)\n}")
    // console.log("x = JSBI.divide(JSBI.multiply(x, FIXED_1), JSBI.BigInt('" + BigNumber.from('0x810100ab00222d861931c15e39b44e99') + ",)\n}");

    // // add 1 / 2^7
    // console.log("if (JSBI.greaterThanOrEqual(x, JSBI.BigInt('" + BigNumber.from('0x808040155aabbbe9451521693554f733').toString() + "'))) {")
    // console.log("res =  JSBI.add( res, JSBI.BigInt('", BigNumber.from('0x00800000000000000000000000000000').toString() + ",)\n}")
    // console.log("x = JSBI.divide(JSBI.multiply(x, FIXED_1), JSBI.BigInt('" + BigNumber.from('0x808040155aabbbe9451521693554f733') + ",)\n}");

    // // add 1 / 2^8

    // // z = y = x - FIXED_1;
    // // w = (y * y) / FIXED_1;
    // console.log("res = JSBI.divide(JSBI.multiply(z, JSBI.subtract(JSBI.BigInt('" + BigNumber.from('0x100000000000000000000000000000000').toString() + "') , y)), JSBI.BigInt('" + BigNumber.from('0x100000000000000000000000000000000').toString() + "')");
    // console.log("z = JSBI.divide(JSBI.multiply(z, w), FIXED_1)")
    // // add y^01 / 01 - y^02 / 02
    // console.log("res = JSBI.divide(JSBI.multiply(z, JSBI.subtract(JSBI.BigInt('" + BigNumber.from('0x0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa').toString() + "') , y)), JSBI.BigInt('" + BigNumber.from('0x200000000000000000000000000000000').toString() + "')");
    // console.log("z = JSBI.divide(JSBI.multiply(z, w), FIXED_1)")
    // // add y^03 / 03 - y^04 / 04
    // console.log("res = JSBI.divide(JSBI.multiply(z, JSBI.subtract(JSBI.BigInt('" + BigNumber.from('0x099999999999999999999999999999999').toString() + "') , y)), JSBI.BigInt('" + BigNumber.from('0x300000000000000000000000000000000').toString() + "')");
    // console.log("z = JSBI.divide(JSBI.multiply(z, w), FIXED_1)")
    // // add y^05 / 05 - y^06 / 06
    // console.log("res = JSBI.divide(JSBI.multiply(z, JSBI.subtract(JSBI.BigInt('" + BigNumber.from('0x092492492492492492492492492492492').toString() + "') , y)), JSBI.BigInt('" + BigNumber.from('0x400000000000000000000000000000000').toString() + "')");
    // console.log("z = JSBI.divide(JSBI.multiply(z, w), FIXED_1)")
    // // add y^07 / 07 - y^08 / 08
    // console.log("res = JSBI.divide(JSBI.multiply(z, JSBI.subtract(JSBI.BigInt('" + BigNumber.from('0x08e38e38e38e38e38e38e38e38e38e38e').toString() + "') , y)), JSBI.BigInt('" + BigNumber.from('0x500000000000000000000000000000000').toString() + "')");
    // console.log("z = JSBI.divide(JSBI.multiply(z, w), FIXED_1)")
    // // add y^09 / 09 - y^10 / 10
    // console.log("res = JSBI.divide(JSBI.multiply(z, JSBI.subtract(JSBI.BigInt('" + BigNumber.from('0x08ba2e8ba2e8ba2e8ba2e8ba2e8ba2e8b').toString() + "') , y)), JSBI.BigInt('" + BigNumber.from('0x600000000000000000000000000000000').toString() + "')");
    // console.log("z = JSBI.divide(JSBI.multiply(z, w), FIXED_1)")
    // // add y^11 / 11 - y^12 / 12
    // console.log("res = JSBI.divide(JSBI.multiply(z, JSBI.subtract(JSBI.BigInt('" + BigNumber.from('0x089d89d89d89d89d89d89d89d89d89d89').toString() + "') , y)), JSBI.BigInt('" + BigNumber.from('0x700000000000000000000000000000000').toString() + "')");
    // console.log("z = JSBI.divide(JSBI.multiply(z, w), FIXED_1)")
    // // add y^13 / 13 - y^14 / 14
    // console.log("res = JSBI.divide(JSBI.multiply(z, JSBI.subtract(JSBI.BigInt('" + BigNumber.from('0x088888888888888888888888888888888').toString() + "') , y)), JSBI.BigInt('" + BigNumber.from('0x800000000000000000000000000000000').toString() + "')");
    // // add y^15 / 15 - y^16 / 16

    // //     return res;
    // // }

    // console.log("function optimalExp(uint256 x) internal pure returns (uint256) {")
    // // uint256 res = 0;

    // // uint256 y;
    // // uint256 z;

    // console.log("y=JSBI.remainder(x,JSBI.BigInt('" + BigNumber.from('0x10000000000000000000000000000000').toString() + "'))")

    // console.log("z= y")
    // // get the input modulo 2^(-3)
    // console.log("z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)");
    // console.log("res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('", BigNumber.from('0x10e1b3be415a0000').toString() + "')))")
    // // add y^02 * (20! / 02!)
    // console.log("z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)");
    // console.log("res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('", BigNumber.from('0x05a0913f6b1e0000').toString() + "')))")
    // // add y^03 * (20! / 03!)
    // console.log("z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)");
    // console.log("res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('", BigNumber.from('0x0168244fdac78000').toString() + "')))")
    // // add y^04 * (20! / 04!)
    // console.log("z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)");
    // console.log("res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('", BigNumber.from('0x004807432bc18000').toString() + "')))")
    // // add y^05 * (20! / 05!)
    // console.log("z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)");
    // console.log("res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('", BigNumber.from('0x000c0135dca04000').toString() + "')))")
    // // add y^06 * (20! / 06!)
    // console.log("z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)");
    // console.log("res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('", BigNumber.from('0x0001b707b1cdc000').toString() + "')))")
    // // add y^07 * (20! / 07!)
    // console.log("z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)");
    // console.log("res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('", BigNumber.from('0x000036e0f639b800').toString() + "')))")
    // // add y^08 * (20! / 08!)
    // console.log("z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)");
    // console.log("res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('", BigNumber.from('0x00000618fee9f800').toString() + "')))")
    // // add y^09 * (20! / 09!)
    // console.log("z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)");
    // console.log("res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('", BigNumber.from('0x0000009c197dcc00').toString() + "')))")
    // // add y^10 * (20! / 10!)
    // console.log("z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)");
    // console.log("res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('", BigNumber.from('0x0000000e30dce400').toString() + "')))")
    // // add y^11 * (20! / 11!)
    // console.log("z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)");
    // console.log("res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('", BigNumber.from('0x000000012ebd1300').toString() + "')))")
    // // add y^12 * (20! / 12!)
    // console.log("z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)");
    // console.log("res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('", BigNumber.from('0x0000000017499f00').toString() + "')))")
    // // add y^13 * (20! / 13!)
    // console.log("z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)");
    // console.log("res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('", BigNumber.from('0x0000000001a9d480').toString() + "')))")
    // // add y^14 * (20! / 14!)
    // console.log("z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)");
    // console.log("res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('", BigNumber.from('0x00000000001c6380').toString() + "')))")
    // // add y^15 * (20! / 15!)
    // console.log("z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)");
    // console.log("res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('", BigNumber.from('0x000000000001c638').toString() + "')))")
    // // add y^16 * (20! / 16!)
    // console.log("z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)");
    // console.log("res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('", BigNumber.from('0x0000000000001ab8').toString() + "')))")
    // // add y^17 * (20! / 17!)
    // console.log("z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)");
    // console.log("res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('", BigNumber.from('0x000000000000017c').toString() + "')))")
    // // add y^18 * (20! / 18!)
    // console.log("z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)");
    // console.log("res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('", BigNumber.from('0x0000000000000014').toString() + "')))")
    // // add y^19 * (20! / 19!)
    // console.log("z = JSBI.divide(JSBI.multiply(z, y), FIXED_1)");
    // console.log("res = JSBI.add(res, JSBI.multiply(z, JSBI.BigInt('", BigNumber.from('0x0000000000000001').toString() + "')))")
    // // add y^20 * (20! / 20!)
    // console.log("res = JSBI.add(JSBI.add(JSBI.divide(res, JSBI.BigInt('" + BigNumber.from('0x21c3677c82b40000') + "')),y),FIXED_1)")
    // // divide by 20! and then add y^1 / 1! + y^0 / 0!

    // console.log("if (JSBI.notEqual(JSBI.bitwiseAnd(x, JSBI.BigInt('" + BigNumber.from('0x010000000000000000000000000000000').toString() + "'), ZERO res = JSBI.divide(JSBI.multiply(res, JSBI.BigInt('", BigNumber.from('0x1c3d6a24ed82218787d624d3e5eba95f9').toString() + "'), JSBI.BigInt('", BigNumber.from('0x18ebef9eac820ae8682b9793ac6d1e776').toString() + "'))")
    // // multiply by e^2^(-3)
    // console.log("if (JSBI.notEqual(JSBI.bitwiseAnd(x, JSBI.BigInt('" + BigNumber.from('0x020000000000000000000000000000000').toString() + "'), ZERO res = JSBI.divide(JSBI.multiply(res, JSBI.BigInt('", BigNumber.from('0x18ebef9eac820ae8682b9793ac6d1e778').toString() + "'), JSBI.BigInt('", BigNumber.from('0x1368b2fc6f9609fe7aceb46aa619baed4').toString() + "'))")
    // // multiply by e^2^(-2)
    // console.log("if (JSBI.notEqual(JSBI.bitwiseAnd(x, JSBI.BigInt('" + BigNumber.from('0x040000000000000000000000000000000').toString() + "'), ZERO res = JSBI.divide(JSBI.multiply(res, JSBI.BigInt('", BigNumber.from('0x1368b2fc6f9609fe7aceb46aa619baed5').toString() + "'), JSBI.BigInt('", BigNumber.from('0x0bc5ab1b16779be3575bd8f0520a9f21f').toString() + "'))")
    // // multiply by e^2^(-1)
    // console.log("if (JSBI.notEqual(JSBI.bitwiseAnd(x, JSBI.BigInt('" + BigNumber.from('0x080000000000000000000000000000000').toString() + "'), ZERO res = JSBI.divide(JSBI.multiply(res, JSBI.BigInt('", BigNumber.from('0x0bc5ab1b16779be3575bd8f0520a9f21e').toString() + "'), JSBI.BigInt('", BigNumber.from('0x0454aaa8efe072e7f6ddbab84b40a55c9').toString() + "'))")
    // // multiply by e^2^(+0)
    // console.log("if (JSBI.notEqual(JSBI.bitwiseAnd(x, JSBI.BigInt('" + BigNumber.from('0x100000000000000000000000000000000').toString() + "'), ZERO res = JSBI.divide(JSBI.multiply(res, JSBI.BigInt('", BigNumber.from('0x0454aaa8efe072e7f6ddbab84b40a55c5').toString() + "'), JSBI.BigInt('", BigNumber.from('0x00960aadc109e7a3bf4578099615711ea').toString() + "'))")
    // // multiply by e^2^(+1)
    // console.log("if (JSBI.notEqual(JSBI.bitwiseAnd(x, JSBI.BigInt('" + BigNumber.from('0x200000000000000000000000000000000').toString() + "'), ZERO res = JSBI.divide(JSBI.multiply(res, JSBI.BigInt('", BigNumber.from('0x00960aadc109e7a3bf4578099615711d7').toString() + "'), JSBI.BigInt('", BigNumber.from('0x0002bf84208204f5977f9a8cf01fdce3d').toString() + "'))")
    // // multiply by e^2^(+2)
    // console.log("if (JSBI.notEqual(JSBI.bitwiseAnd(x, JSBI.BigInt('" + BigNumber.from('0x400000000000000000000000000000000').toString() + "'), ZERO res = JSBI.divide(JSBI.multiply(res, JSBI.BigInt('", BigNumber.from('0x0002bf84208204f5977f9a8cf01fdc307').toString() + "'), JSBI.BigInt('", BigNumber.from('0x0000003c6ab775dd0b95b4cbee7e65d11').toString() + "'))")
    // // multiply by e^2^(+3)

    // //   return res;
    // // }

  })
})
