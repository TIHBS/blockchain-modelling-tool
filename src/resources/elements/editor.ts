import { autoinject } from 'aurelia-dependency-injection';
import { EventAggregator } from 'aurelia-event-aggregator';
import { connectTo, Store } from 'aurelia-store';
import { pluck } from 'rxjs/operators';

import { State, ActiveDiagramState, ActiveProjectState, getProjectComponent } from '../../state';

import GraphEditor from '@ustutt/grapheditor-webcomponent/lib/grapheditor'
import { Node } from '@ustutt/grapheditor-webcomponent/lib/node';
import { Edge } from '@ustutt/grapheditor-webcomponent/lib/edge';
import { NODE_SELECTION_CHANNEL, NodeSelectionMessage } from 'resources/messages/messages';

@autoinject()
@connectTo<State>((store) => store.state.pipe(pluck('active')))
export class Editor {

    public state: ActiveProjectState;

    grapheditor: GraphEditor;

    constructor(private store: Store<State>, private eventAggregator: EventAggregator) {}

    attached() {
        this.store.dispatch('changeActiveProject', 'Playground', this.grapheditor);


        this.grapheditor.onCreateDraggedEdge = (edge) => {
            if (edge.createdFrom == null || edge.createdFrom == undefined) {
                edge.markerEnd = {template: 'arrow', positionOnLine: 1, scale: 0.5, relativeRotation: 0};
            }
            return edge
        }

        this.grapheditor.addEventListener('nodeclick', (event: CustomEvent) => {
            const node = event.detail.node;
            if (this.grapheditor.selected.has(node.id)) {
                return;
            }
            event.preventDefault();
            this.grapheditor.changeSelected(new Set([node.id]));
        });

        this.grapheditor.addEventListener('selection', (event: CustomEvent) => {
            const selection: Set<string> = event.detail.selection;
            if (selection.size === 1) {
                const selected = selection.keys().next().value;
                //this.eventAggregator.publish(new NodeSelectionMessage(selected));
                const node = this.grapheditor.getNode(selected);
                this.store.dispatch('selectNode', node);
                return;
            }
            this.store.dispatch('selectNode', null);
            //this.eventAggregator.publish(new NodeSelectionMessage(null));
        });
    }

    unbind() {
        this.store.dispatch('changeActiveProject', null, null);
    }

    stateChanged(newState: ActiveProjectState, oldState: ActiveProjectState) {
        if (this.grapheditor == null || oldState == null) {
            return;
        }

        const oldGraph: ActiveDiagramState = oldState.activeDiagram;
        const newGraph: ActiveDiagramState = newState.activeDiagram;

        let hasChanged = false;

        Object.keys(oldGraph.nodes).forEach(id => {
            if (newGraph.nodes[id] == null) {
                this.grapheditor.removeNode(oldGraph.nodes[id]);
                hasChanged = true;
            }
        });
        Object.keys(newGraph.nodes).forEach(id => {
            if (oldGraph.nodes[id] == null) {

                const node: Node = Object.assign({}, newGraph.nodes[id]);

                node.element = getProjectComponent(newState.activeProjectComponents, node.elementId);
                if (node.element == null) {
                    console.error('Could not create node!', node);
                }

                this.grapheditor.addNode(node);
                hasChanged = true;
            }
        });
        Object.keys(oldGraph.edges).forEach(id => {
            if (newGraph.edges[id] == null) {
                this.grapheditor.removeEdge(oldGraph.edges[id]);
                hasChanged = true;
            }
        });
        Object.keys(newGraph.edges).forEach(id => {
            if (oldGraph.edges[id] == null) {
                this.grapheditor.addEdge(newGraph.edges[id]);
                hasChanged = true;
            }
        });

        if (hasChanged) {
            this.grapheditor.completeRender();
            this.grapheditor.zoomToBoundingBox();
        }

    }
}
