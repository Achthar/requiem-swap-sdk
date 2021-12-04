import { Pair } from "./pair";
import { StablePairWrapper } from "./stablePairWrapper";
import { WeightedPair } from "./weightedPair";
export declare type Pool = Pair | StablePairWrapper | WeightedPair;
export declare enum PoolType {
    Pair = "Pair",
    StablePairWrapper = "StablePairWrapper",
    WeightedPair = "WeightedPair"
}
