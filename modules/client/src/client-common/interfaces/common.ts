// This file contains common types, interfaces, and enumerations

import { BigNumberish } from "@ethersproject/bignumber";

export enum DaoRole {
  UPGRADE_ROLE = "UPGRADE_ROLE",
  DAO_CONFIG_ROLE = "DAO_CONFIG_ROLE",
  EXEC_ROLE = "EXEC_ROLE",
  WITHDRAW_ROLE = "WITHDRAW_ROLE",
  SET_SIGNATURE_VALIDATOR_ROLE = "SET_SIGNATURE_VALIDATOR_ROLE",
}

/**
 * Contains the payload passed to the global DAO factory so that
 * plugins can be initialized
 */
export interface IPluginInstallItem {
  id: string; // ENS domain or address of the plugin's Repo
  data: Uint8Array;
}

/**
 * Contains the general human readable information about the DAO
 */
export type DaoConfig = {
  name: string;
  metadata: string;
};

export type GasFeeEstimation = {
  average: bigint;
  max: bigint;
};

export interface IPagination {
  skip?: number;
  limit?: number;
  direction?: SortDirection;
}

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

export interface IInterfaceParams {
  id: string;
  functionName: string;
  hash: string;
}

export interface IEncodingResult {
  to: string;
  value: BigNumberish;
  data: Uint8Array;
}