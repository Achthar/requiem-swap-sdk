import { BigintIsh, SolidityType } from './constants';
import { BigNumber } from 'ethers';
export declare function validateSolidityTypeInstance(value: BigNumber, solidityType: SolidityType): void;
export declare function validateAndParseAddress(address: string): string;
export declare function parseBigintIsh(bigintIsh: BigintIsh): BigNumber;
export declare function sqrt(y: BigNumber): BigNumber;
export declare function sortedInsert<T>(items: T[], add: T, maxSize: number, comparator: (a: T, b: T) => number): T | null;
