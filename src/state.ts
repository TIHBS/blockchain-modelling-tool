import GraphEditor from "@ustutt/grapheditor-webcomponent/lib/grapheditor";
import { Node } from "@ustutt/grapheditor-webcomponent/lib/node";
import { Edge } from "@ustutt/grapheditor-webcomponent/lib/edge";

export interface ActiveDiagramState {
    nodes: {
        [prop: string]: Node;
    };
    edges: {
        [prop: string]: Edge;
    };
}

export interface ActiveProjectState {
    activeProject: string | null;
    activeEditor: GraphEditor;
    activeDiagram: ActiveDiagramState;
}

export interface State {
    projects: string[];
    active: ActiveProjectState;
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
    }
};
