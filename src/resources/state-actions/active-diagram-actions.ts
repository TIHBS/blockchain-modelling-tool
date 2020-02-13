import { State } from "state";
import { Node } from "@ustutt/grapheditor-webcomponent/lib/node";
import { Edge, edgeId } from "@ustutt/grapheditor-webcomponent/lib/edge";

export const addNode = (state: State, node: Node) => {
    const newState = Object.assign({}, state);
    newState.active = Object.assign({}, state.active);
    const diagram = Object.assign({}, state.active.activeDiagram);
    newState.active.activeDiagram = diagram;
    diagram.nodes = Object.assign({}, diagram.nodes);

    diagram.nodes[node.id] = node;

    return newState;
}

export const removeNode = (state: State, node: Node) => {
    const newState = Object.assign({}, state);
    newState.active = Object.assign({}, state.active);
    const diagram = Object.assign({}, state.active.activeDiagram);
    newState.active.activeDiagram = diagram;
    diagram.nodes = Object.assign({}, diagram.nodes);

    delete diagram.nodes[node.id];

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
