import { State, ProjectComponents } from "state";
import GraphEditor from "@ustutt/grapheditor-webcomponent/lib/grapheditor";
import { ProjectComponent, ActorComponent, SmartContractComponent, TransactionComponent, RepositoryComponent, BlockchainComponent, NodeComponent, BlockComponent, WalletComponent, GroupComponent } from "project";

export const changeActiveProject = (state: State, projectName: string, editor: GraphEditor) => {
    const newState = Object.assign({}, state);

    let projectComponents: ProjectComponents = {
        all: {},
        actor: {},
        smartContract: {},
        transaction: {},
        repository: {},
        node: {},
        block: {},
        wallet: {},
        blockchain: {},
        group: {},
    };

    if (projectName !== 'Playground') {
        // TODO load active project elements here
    }

    newState.active = {
        ... state.active,
        activeProject: projectName,
        activeEditor: editor,
        activeDiagram: {
            nodes: {},
            edges: {},
        },
        activeProjectComponents: projectComponents,
    };

    newState.selected = {
        selectedNode: null,
        selectedComponent: null,
        selectedNodeLayer: 0,
        selectedNodeGroup: null,
    };

    return newState;
}

export const addProjectComponent = (state: State, component: ProjectComponent<string>) => {
    const newState = Object.assign({}, state);
    newState.active = Object.assign({}, state.active);
    const activeComponents = Object.assign({}, state.active.activeProjectComponents);
    newState.active.activeProjectComponents = activeComponents;

    activeComponents.all = Object.assign({}, activeComponents.all);
    activeComponents.all[component.id] = component.type as string;

    if (component.type === 'actor') {
        activeComponents.actor = Object.assign({}, activeComponents.actor);
        activeComponents.actor[component.id] = component as ActorComponent;
    } else if (component.type === 'smart-contract') {
        activeComponents.smartContract = Object.assign({}, activeComponents.smartContract);
        activeComponents.smartContract[component.id] = component as SmartContractComponent;
    } else if (component.type === 'transaction') {
        activeComponents.transaction = Object.assign({}, activeComponents.transaction);
        activeComponents.transaction[component.id] = component as TransactionComponent;
    } else if (component.type === 'repository') {
        activeComponents.repository = Object.assign({}, activeComponents.repository);
        activeComponents.repository[component.id] = component as RepositoryComponent;
    } else if (component.type === 'node') {
        activeComponents.node = Object.assign({}, activeComponents.node);
        activeComponents.node[component.id] = component as NodeComponent;
    } else if (component.type === 'block') {
        activeComponents.block = Object.assign({}, activeComponents.block);
        activeComponents.block[component.id] = component as BlockComponent;
    } else if (component.type === 'wallet') {
        activeComponents.wallet = Object.assign({}, activeComponents.wallet);
        activeComponents.wallet[component.id] = component as WalletComponent;
    } else if (component.type === 'blockchain') {
        activeComponents.blockchain = Object.assign({}, activeComponents.blockchain);
        activeComponents.blockchain[component.id] = component as BlockchainComponent;
    } else if (component.type === 'group') {
        activeComponents.group = Object.assign({}, activeComponents.group);
        activeComponents.group[component.id] = component as GroupComponent;
    }

    return newState;
}

export const updateProjectComponent = (state: State, component: ProjectComponent<string>) => {
    const newState = Object.assign({}, state);
    newState.active = Object.assign({}, state.active);
    const activeComponents = Object.assign({}, state.active.activeProjectComponents);
    newState.active.activeProjectComponents = activeComponents;

    const updatedComponent = Object.assign({}, component);

    if (updatedComponent.type === 'actor') {
        activeComponents.actor = Object.assign({}, activeComponents.actor);
        activeComponents.actor[updatedComponent.id] = updatedComponent as ActorComponent;
    } else if (updatedComponent.type === 'smart-contract') {
        activeComponents.smartContract = Object.assign({}, activeComponents.smartContract);
        activeComponents.smartContract[updatedComponent.id] = updatedComponent as SmartContractComponent;
    } else if (updatedComponent.type === 'transaction') {
        activeComponents.transaction = Object.assign({}, activeComponents.transaction);
        activeComponents.transaction[updatedComponent.id] = updatedComponent as TransactionComponent;
    } else if (updatedComponent.type === 'repository') {
        activeComponents.repository = Object.assign({}, activeComponents.repository);
        activeComponents.repository[updatedComponent.id] = updatedComponent as RepositoryComponent;
    } else if (updatedComponent.type === 'blockchain') {
        activeComponents.blockchain = Object.assign({}, activeComponents.blockchain);
        activeComponents.blockchain[updatedComponent.id] = updatedComponent as BlockchainComponent;
    }

    if (state.selected?.selectedComponent?.id === updatedComponent.id) {
        newState.selected = Object.assign({}, state.selected);
        newState.selected.selectedComponent = updatedComponent;
    }

    return newState;
}

