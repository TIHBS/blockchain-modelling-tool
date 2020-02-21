import { autoinject } from 'aurelia-dependency-injection';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { connectTo, Store } from 'aurelia-store';

import { pluck } from 'rxjs/operators';

import { State, SelectedState } from '../../state';

import { Node } from '@ustutt/grapheditor-webcomponent/lib/node';
import { ProjectComponent } from 'project';

import { NodeChangedMessage, ProjectComponentChangedMessage, NodePositionChangedMessage } from '../messages/messages';

@autoinject()
@connectTo<State>((store) => store.state.pipe(pluck('selected')))
export class NodeProperties {

    private nodeChangedSubscription: Subscription;

    state: SelectedState;

    nodeEdit: Node;
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

    stateChanged(newState: SelectedState, oldState: SelectedState) {
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
        const oldNode = this.state.selectedNode;

        this.store.pipe('updateNode', updatedNode).dispatch();
        this.eventAggregator.publish(new NodeChangedMessage(updatedNode, oldNode, 'property-editor'));
    }

    componentEditChanged() {
        console.log('Component properties Changed', this.componentEdit);

        const updatedComponent = Object.assign({}, this.componentEdit);
        const oldComponent = this.state.selectedComponent;

        this.store.pipe('updateProjectComponent', updatedComponent).dispatch();
        this.eventAggregator.publish(new ProjectComponentChangedMessage(updatedComponent, oldComponent, 'property-editor'));
    }
}
