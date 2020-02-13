import { autoinject } from 'aurelia-dependency-injection';
import { connectTo, Store } from 'aurelia-store';
import { pluck } from 'rxjs/operators';

import { State, ActiveDiagramState } from '../../state';

import GraphEditor from '@ustutt/grapheditor-webcomponent/lib/grapheditor'
import { Node } from '@ustutt/grapheditor-webcomponent/lib/node';
import { Edge } from '@ustutt/grapheditor-webcomponent/lib/edge';

@autoinject()
@connectTo<State>((store) => store.state.pipe(pluck('active', 'activeDiagram')))
export class Editor {

    public state: ActiveDiagramState;

    grapheditor: GraphEditor;

    constructor(private store: Store<State>) {}

    attached() {
        this.store.dispatch('changeActiveProject', 'Playground', this.grapheditor);
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
