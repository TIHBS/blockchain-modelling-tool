import { autoinject } from 'aurelia-dependency-injection';
import { EventAggregator } from 'aurelia-event-aggregator';
import { connectTo, Store } from 'aurelia-store';
import { pluck } from 'rxjs/operators';

import { State, ActiveDiagramState } from '../../state';

import GraphEditor from '@ustutt/grapheditor-webcomponent/lib/grapheditor'
import { Node } from '@ustutt/grapheditor-webcomponent/lib/node';
import { Edge } from '@ustutt/grapheditor-webcomponent/lib/edge';
import { NODE_SELECTION_CHANNEL, NodeSelectionMessage } from 'resources/messages/messages';

@autoinject()
@connectTo<State>((store) => store.state.pipe(pluck('active', 'activeDiagram')))
export class Editor {

    public state: ActiveDiagramState;

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
                this.eventAggregator.publish(new NodeSelectionMessage(selected));
                return;
            }
            this.eventAggregator.publish(new NodeSelectionMessage(null));
        });
    }

    unbind() {
        this.store.dispatch('changeActiveProject', null, null);
    }

    stateChanged(newState: ActiveDiagramState, oldState: ActiveDiagramState) {
        if (this.grapheditor == null || oldState == null) {
            return;
        }

        let hasChanged = false;

        Object.keys(oldState.nodes).forEach(id => {
            if (newState.nodes[id] == null) {
                this.grapheditor.removeNode(oldState.nodes[id]);
                hasChanged = true;
            }
        });
        Object.keys(newState.nodes).forEach(id => {
            if (oldState.nodes[id] == null) {
                this.grapheditor.addNode(newState.nodes[id]);
                hasChanged = true;
            }
        });
        Object.keys(oldState.edges).forEach(id => {
            if (newState.edges[id] == null) {
                this.grapheditor.removeEdge(oldState.edges[id]);
                hasChanged = true;
            }
        });
        Object.keys(newState.edges).forEach(id => {
            if (oldState.edges[id] == null) {
                this.grapheditor.addEdge(newState.edges[id]);
                hasChanged = true;
            }
        });

        if (hasChanged) {
            this.grapheditor.completeRender();
            this.grapheditor.zoomToBoundingBox();
        }

    }
}
