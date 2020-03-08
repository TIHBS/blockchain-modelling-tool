import { autoinject } from 'aurelia-dependency-injection';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { connectTo, Store } from 'aurelia-store';

import { pluck } from 'rxjs/operators';

import { State, SelectedState, ActiveProjectState } from '../../state';

import { Node } from '@ustutt/grapheditor-webcomponent/lib/node';
import { ProjectComponent } from 'project';

import { NodeChangedMessage, ProjectComponentChangedMessage, NodePositionChangedMessage, NodeLayerChangedMessage } from '../messages/messages';
import GraphEditor from '@ustutt/grapheditor-webcomponent/lib/grapheditor';

@autoinject()
@connectTo<State>({
    selector: {
        activeEditor: (store) => store.state.pipe(pluck('active', 'activeEditor')),
        selected: (store) => store.state.pipe(pluck('selected')),
    }
})
export class NodeProperties {

    private nodeChangedSubscription: Subscription;

    activeEditor: GraphEditor;
    selected: SelectedState;

    nodeEdit: Node;
    currentLayer: number;
    layers: number;
    componentEdit: ProjectComponent<string>;

    constructor(private store: Store<State>, private eventAggregator: EventAggregator) {}

    bind() {
        this.nodeChangedSubscription = this.eventAggregator.subscribe(NodePositionChangedMessage, (msg: NodePositionChangedMessage) => {
            if (msg.source === 'property-editor') {
                return;
            }
            if (msg.newNode.id === this.nodeEdit.id) {
                this.nodeEdit.x = msg.newNode.x;
                this.nodeEdit.y = msg.newNode.y;
            }
        });
    }

    unbind() {
        this.nodeChangedSubscription?.dispose();
    }

    selectedChanged(newState: SelectedState, oldState: SelectedState) {
        this.currentLayer = newState.selectedNodeLayer;
        this.layers = this.activeEditor.nodeList.length;
        if (oldState?.selectedNode != null && newState?.selectedNode != null) {
            if (oldState.selectedNode.id === newState.selectedNode.id) {
                // selection has not changed (only values in the selected elements have changed)
                return;
            }
        }
        this.nodeEdit = Object.assign({}, newState.selectedNode);
        this.componentEdit = Object.assign({}, newState.selectedComponent);
    }

    nodeEditChanged() {
        console.log('Node Visuals Changed', this.nodeEdit);

        const updatedNode = Object.assign({}, this.nodeEdit);
        const oldNode = this.selected.selectedNode;

        this.store.pipe('updateNode', updatedNode).dispatch();
        this.eventAggregator.publish(new NodeChangedMessage(updatedNode, oldNode, 'property-editor'));
    }

    componentEditChanged() {
        console.log('Component properties Changed', this.componentEdit);

        const updatedComponent = Object.assign({}, this.componentEdit);
        const oldComponent = this.selected.selectedComponent;

        this.store.pipe('updateProjectComponent', updatedComponent).dispatch();
        this.eventAggregator.publish(new ProjectComponentChangedMessage(updatedComponent, oldComponent, 'property-editor'));
    }

    changeNodeLayer(newLayer: number) {
        if (this.selected.selectedNode == null) {
            return;
        }
        if (newLayer < 0 || newLayer >= this.activeEditor.nodeList.length) {
            return;
        }
        this.eventAggregator.publish(new NodeLayerChangedMessage(this.selected.selectedNode, newLayer, this.currentLayer, 'property-editor'));
    }

    removeNode() {
        this.store.pipe('removeNode', this.selected.selectedNode).dispatch();
    }
}
