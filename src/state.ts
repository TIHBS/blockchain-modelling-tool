import GraphEditor from "@ustutt/grapheditor-webcomponent/lib/grapheditor";
import { Node } from "@ustutt/grapheditor-webcomponent/lib/node";
import { Edge } from "@ustutt/grapheditor-webcomponent/lib/edge";
import { ActorComponent, SmartContractComponent, TransactionComponent, RepositoryComponent, BlockchainComponent, ProjectComponent } from "project";

export interface ActiveDiagramState {
    nodes: {
        [prop: string]: Node;
    };
    edges: {
        [prop: string]: Edge;
    };
}

export interface ProjectComponents {
    all: {
        [prop: string]: string;
    }
    actor: {
        [prop: string]: ActorComponent;
    };
    smartContract: {
        [prop: string]: SmartContractComponent;
    };
    transaction: {
        [prop: string]: TransactionComponent;
    };
    repository: {
        [prop: string]: RepositoryComponent;
    };
    blockchain: {
        [prop: string]: BlockchainComponent;
    };

}

export interface ActiveProjectState {
    activeProject: string | null;
    activeEditor: GraphEditor;
    activeDiagram: ActiveDiagramState;
    activeProjectComponents: ProjectComponents;
}

export interface SelectedState {
    selectedNode: Node;
    selectedComponent: ProjectComponent<string>;
}

export interface State {
    projects: string[];
    active: ActiveProjectState;
    selected: SelectedState;
}

export const initialState: State = {
    projects: ['Playground', ],
    active: {
        activeProject: null,
        activeEditor: null,
        activeDiagram: {
            nodes: {},
            edges: {},
        },
        activeProjectComponents: {
            all: {},
            actor: {},
            smartContract: {},
            transaction: {},
            repository: {},
            blockchain: {},
        }
    },
    selected: {
        selectedNode: null,
        selectedComponent: null,
    },
};

export function getProjectComponent(activeProjectComponents: ProjectComponents, componentId: string): ProjectComponent<string> {
    const componentType = activeProjectComponents.all[componentId];
    if (componentType === 'actor') {
        return activeProjectComponents.actor[componentId];
    } else if (componentType === 'smart-contract') {
        return activeProjectComponents.smartContract[componentId];
    } else if (componentType === 'transaction') {
        return activeProjectComponents.transaction[componentId];
    } else if (componentType === 'repository') {
        return activeProjectComponents.repository[componentId];
    } else if (componentType === 'blockchain') {
        return activeProjectComponents.blockchain[componentId];
    } else {
        return null;
    }
}
