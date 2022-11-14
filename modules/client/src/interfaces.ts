// This file contains the definitions of the general purpose DAO client

import {
  IPagination,
  IPluginInstallItem,
} from "./client-common/interfaces/common";
import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";
import { BigNumber } from "@ethersproject/bignumber";

// DAO CREATION

/** Holds the parameters that the DAO will be created with */
export interface ICreateParams {
  metadata: IMetadata;
  ensSubdomain: string;
  trustedForwarder?: string;
  plugins: IPluginInstallItem[];
}

export interface IMetadata {
  name: string;
  description: string;
  avatar?: string;
  links: DaoResourceLink[];
}

export interface IWithdrawParams {
  recipientAddress: string;
  amount: bigint;
  tokenAddress?: string;
  reference?: string;
}
interface IPermissionParamsBase {
  where: string;
  who: string;
  permission: string;
}
interface IPermissionDecodedParamsBase extends IPermissionParamsBase {
  permissionId: string;
}
export interface IGrantPermissionParams extends IPermissionParamsBase {}
export interface IRevokePermissionParams extends IPermissionParamsBase {}
export interface IGrantPermissionDecodedParams
  extends IPermissionDecodedParamsBase {}
export interface IRevokePermissionDecodedParams
  extends IPermissionDecodedParamsBase {}
export interface IFreezePermissionParams {
  where: string;
  permission: string;
}
export interface IFreezePermissionDecodedParams
  extends IFreezePermissionParams {
  permissionId: string;
}

const Permissions = {
  UPGRADE_PERMISSION: "UPGRADE_PERMISSION",
  SET_METADATA_PERMISSION: "SET_METADATA_PERMISSION",
  EXECUTE_PERMISSION: "EXECUTE_PERMISSION",
  WITHDRAW_PERMISSION: "WITHDRAW_PERMISSION",
  SET_SIGNATURE_VALIDATOR_PERMISSION: "SET_SIGNATURE_VALIDATOR_PERMISSION",
  SET_TRUSTED_FORWARDER_PERMISSION: "SET_TRUSTED_FORWARDER_PERMISSION",
  ROOT_PERMISSION: "ROOT_PERMISSION",
  CREATE_VERSION_PERMISSION: "CREATE_VERSION_PERMISSION",
  REGISTER_PERMISSION: "REGISTER_PERMISSION",
  REGISTER_DAO_PERMISSION: "REGISTER_DAO_PERMISSION",
  REGISTER_ENS_SUBDOMAIN_PERMISSION: "REGISTER_ENS_SUBDOMAIN_PERMISSION",
  MINT_PERMISSION: "MINT_PERMISSION",
  MERKLE_MINT_PERMISSION: "MERKLE_MINT_PERMISSION",
  MODIFY_ALLOWLIST_PERMISSION: "MODIFY_ALLOWLIST_PERMISSION",
  SET_CONFIGURATION_PERMISSION: "SET_CONFIGURATION_PERMISSION",
};

const PermissionIds = Object.entries(Permissions).reduce(
  (acc, [k, v]) => ({ ...acc, [k + "_ID"]: keccak256(toUtf8Bytes(v)) }),
  {} as { [k: string]: string }
);
Object.freeze(Permissions);
export { Permissions };
Object.freeze(PermissionIds);
export { PermissionIds };

export enum DaoCreationSteps {
  CREATING = "creating",
  DONE = "done",
}

export type DaoCreationStepValue =
  | { key: DaoCreationSteps.CREATING; txHash: string }
  | { key: DaoCreationSteps.DONE; address: string };

export enum DaoSteps {
  PENDING = 'pending',
  DONE = 'done'
}

export type DaoStepsValue = DaoStepsValuePending | DaoStepsValueDone

export type DaoStepsValuePending = {
  key: DaoSteps.PENDING,
  txHash: string
}

export type DaoStepsValueDone = {
  key: DaoSteps.DONE
}

// DEPOSIT

export interface IDepositParams {
  daoAddressOrEns: string;
  amount: bigint;
  tokenAddress?: string;
  reference?: string;
}

export enum DaoDepositSteps {
  CHECKED_ALLOWANCE = "checkedAllowance",
  UPDATING_ALLOWANCE = "updatingAllowance",
  UPDATED_ALLOWANCE = "updatedAllowance",
  DEPOSITING = "depositing",
  DONE = "done",
}

export type DaoDepositStepValue =
  | { key: DaoDepositSteps.CHECKED_ALLOWANCE; allowance: bigint }
  | { key: DaoDepositSteps.UPDATING_ALLOWANCE; txHash: string }
  | { key: DaoDepositSteps.UPDATED_ALLOWANCE; allowance: bigint }
  | { key: DaoDepositSteps.DEPOSITING; txHash: string }
  | { key: DaoDepositSteps.DONE; amount: bigint };

// Token types

type NativeTokenBase = {
  type: "native";
};
type Erc20TokenBase = {
  type: "erc20";
  /** The address of the token contract */
  address: string;
  name: string;
  symbol: string;
  decimals: number;
};

// Token balances

type NativeTokenBalance = NativeTokenBase & {
  balance: bigint;
};
type Erc20TokenBalance = Erc20TokenBase & {
  balance: bigint;
};

export type AssetBalance = (NativeTokenBalance | Erc20TokenBalance) & {
  updateDate: Date;
};

// Token transfers
export enum TransferType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}
export enum TokenType {
  NATIVE = "native",
  ERC20 = "erc20",
}

type BaseTokenTransfer = {
  amount: bigint;
  creationDate: Date;
  reference: string;
  transactionId: string;
};

type NativeTokenTransfer = BaseTokenTransfer & {
  tokenType: TokenType.NATIVE;
};

type Erc20TokenTransfer = BaseTokenTransfer & {
  tokenType: TokenType.ERC20;
  token: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
  };
};

export type Deposit = (NativeTokenTransfer | Erc20TokenTransfer) & {
  from: string;
  type: TransferType.DEPOSIT;
};

export type Withdraw = (NativeTokenTransfer | Erc20TokenTransfer) & {
  to: string;
  type: TransferType.WITHDRAW;
  proposalId: string;
};

export type Transfer = Deposit | Withdraw;

// DAO details

export type DaoResourceLink = { name: string; url: string };
export type InstalledPluginListItem = {
  id: string;
  instanceAddress: string;
  version: string;
};

export type DaoDetails = {
  address: string;
  ensDomain: string;
  metadata: IMetadata;
  creationDate: Date;
  plugins: InstalledPluginListItem[];
};

export type DaoListItem = {
  address: string;
  ensDomain: string;
  metadata: {
    name: string;
    avatar?: string;
  };
  plugins: InstalledPluginListItem[];
};

export interface IDaoQueryParams extends IPagination {
  sortBy?: DaoSortBy;
}
export interface ITransferQueryParams extends IPagination {
  sortBy?: TransferSortBy;
  type?: TransferType;
  daoAddressOrEns?: string;
}

export enum TransferSortBy {
  CREATED_AT = "createdAt", // currently defined as number of proposals
}

export enum DaoSortBy {
  CREATED_AT = "createdAt",
  NAME = "name",
  POPULARITY = "totalProposals", // currently defined as number of proposals
}

export enum SubgraphPluginTypeName {
  ERC20 = "ERC20VotingPackage",
  ADDRESS_LIST = "AllowlistPackage",
}

export const SubgraphPluginTypeMap: Map<
  SubgraphPluginTypeName,
  string
> = new Map([
  [SubgraphPluginTypeName.ERC20, "erc20voting.dao.eth"],
  [SubgraphPluginTypeName.ADDRESS_LIST, "addresslistvoting.dao.eth"],
]);

export type SubgraphPluginListItem = {
  pkg: {
    id: string;
    __typename: SubgraphPluginTypeName;
  };
};

type SubgraphDaoBase = {
  id: string;
  name: string;
  metadata: string;
  packages: SubgraphPluginListItem[];
};

export type SubgraphDao = SubgraphDaoBase & {
  createdAt: string;
};

export type SubgraphDaoListItem = SubgraphDaoBase;

export type SubgraphBalance = {
  token: {
    id: string;
    name: string;
    symbol: string;
    decimals: string;
  };
  balance: string;
  lastUpdated: string;
};

export enum SubgraphTransferType {
  DEPOSIT = "Deposit",
  WITHDRAW = "Withdraw",
}

export type SubgraphTransferListItem = {
  amount: string;
  createdAt: string;
  reference: string;
  transaction: string;
  type: SubgraphTransferType;
  to: string;
  sender: string;
  token: SubgraphErc20Token;
  proposal: {
    id: string | null;
  };
};

export type SubgraphErc20Token = {
  id: string;
  name: string;
  symbol: string;
  decimals: string;
};
export const SubgraphTransferTypeMap: Map<
  TransferType,
  SubgraphTransferType
> = new Map([
  [TransferType.DEPOSIT, SubgraphTransferType.DEPOSIT],
  [TransferType.WITHDRAW, SubgraphTransferType.WITHDRAW],
]);

export type ContractFreezeParams = [string, string];
export type ContractPermissionParams = [string, string, string];
export type ContractWithdrawParams = [string, string, BigNumber, string];