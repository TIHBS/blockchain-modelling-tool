import { Node } from "@ustutt/grapheditor-webcomponent/lib/node";

export interface ProjectComponent<T extends string> {
    type: T;
    id: string;
    title: string;
    [prop: string]: any;
}

export interface ActorComponent extends ProjectComponent<'actor'> {

}

export interface SmartContractComponent extends ProjectComponent<'smart-contract'> {

}

export interface TransactionComponent extends ProjectComponent<'transaction'> {

}

export interface RepositoryComponent extends ProjectComponent<'repository'> {

}

export interface NodeComponent extends ProjectComponent<'node'> {
    icon: string;
}

export interface BlockComponent extends ProjectComponent<'block'> {

}

export interface WalletComponent extends ProjectComponent<'wallet'> {

}

export interface BlockchainComponent extends ProjectComponent<'blockchain'> {

}

export interface GroupComponent extends ProjectComponent<'group'> {

}
