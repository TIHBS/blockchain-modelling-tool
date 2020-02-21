import { State, getProjectComponent } from "state";
import { Node } from "@ustutt/grapheditor-webcomponent/lib/node";
import { Edge, edgeId } from "@ustutt/grapheditor-webcomponent/lib/edge";


export const selectNode = (state: State, node?: Node) => {
    const newState = Object.assign({}, state);

    if (node == null) {
        newState.selected = {
            selectedNode: null,
            selectedComponent: null,
        };
        return newState;
    }


    newState.selected = {
        selectedNode: state.active.activeDiagram.nodes[node.id],
        selectedComponent: getProjectComponent(state.active.activeProjectComponents, node.elementId),
    };

    return newState;
}

export const addNode = (state: State, node: Node) => {
    const newState = Object.assign({}, state);
    newState.active = Object.assign({}, state.active);
    const diagram = Object.assign({}, state.active.activeDiagram);
    newState.active.activeDiagram = diagram;
    diagram.nodes = Object.assign({}, diagram.nodes);

    diagram.nodes[node.id] = node;

    return newState;
}

export const updateNode = (state: State, node: Node) => {
    const newState = Object.assign({}, state);
    newState.active = Object.assign({}, state.active);
    const diagram = Object.assign({}, state.active.activeDiagram);
    newState.active.activeDiagram = diagram;
    diagram.nodes = Object.assign({}, diagram.nodes);

    const updatedNode = Object.assign({}, node);

    diagram.nodes[node.id] = updatedNode;

    if (newState.selected?.selectedNode?.id === updatedNode.id) {
        newState.selected = Object.assign({}, state.selected);
        newState.selected.selectedNode = updatedNode;
    }

    return newState;
}

export const removeNode = (state: State, node: Node) => {
    const newState = Object.assign({}, state);
    newState.active = Object.assign({}, state.active);
    const diagram = Object.assign({}, state.active.activeDiagram);
    newState.active.activeDiagram = diagram;
    diagram.nodes = Object.assign({}, diagram.nodes);

    delete diagram.nodes[node.id];

    if (newState.selected?.selectedNode?.id === node.id) {
        newState.selected = {
            selectedNode: null,
            selectedComponent: null,
        };
    }

    return newState;
}

export const addEdge = (state: State, edge: Edge) => {
    const newState = Object.assign({}, state);
    newState.active = Object.assign({}, state.active);
    const diagram = Object.assign({}, state.active.activeDiagram);
    newState.active.activeDiagram = diagram;
    diagram.edges = Object.assign({}, diagram.edges);

    diagram.edges[edgeId(edge)] = edge;

    return newState;
}

export const removeEdge = (state: State, edge: Edge) => {
    const newState = Object.assign({}, state);
    newState.active = Object.assign({}, state.active);
    const diagram = Object.assign({}, state.active.activeDiagram);
    newState.active.activeDiagram = diagram;
    diagram.edges = Object.assign({}, diagram.edges);

    delete diagram.edges[edgeId(edge)];

    return newState;
}
