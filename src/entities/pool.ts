import { Pair } from "./pair"
import { StablePairWrapper } from "./stablePairWrapper"
import { WeightedPair } from "./weightedPair"

export type Pool = Pair | StablePairWrapper | WeightedPair

export enum PoolType {
    Pair = 'Pair',
    StablePairWrapper = 'StablePairWrapper',
    WeightedPair = 'WeightedPair',
}