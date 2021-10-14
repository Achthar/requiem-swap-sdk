import { StablePool } from './entities/stablePool';
/**
 * Contains methods for constructing instances of pairs and tokens from on-chain data.
 */
export declare abstract class StablesFetcher {
    /**
     * Cannot be constructed.
     */
    private constructor();
    /**
     * Fetches information about the stablePool and constructs a StablePool Object from the contract deployed.
     * @param tokenA first token
     * @param tokenB second token
     * @param provider the provider to use to fetch the data
     */
    static fetchStablePoolData(chainId: number, provider?: import("@ethersproject/providers").BaseProvider): Promise<StablePool>;
}
