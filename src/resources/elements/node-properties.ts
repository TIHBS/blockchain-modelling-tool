import { autoinject } from 'aurelia-dependency-injection';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { connectTo, Store } from 'aurelia-store';

import { pluck } from 'rxjs/operators';

import { State, SelectedState, ActiveProjectState, ProjectComponents, getProjectComponent } from '../../state';

import { Node } from '@ustutt/grapheditor-webcomponent/lib/node';
import { ProjectComponent } from 'project';

import { NodeChangedMessage, ProjectComponentChangedMessage, NodePositionChangedMessage, NodeLayerChangedMessage, NodeGroupChangedMessage } from '../messages/messages';
import GraphEditor from '@ustutt/grapheditor-webcomponent/lib/grapheditor';

@autoinject()
@connectTo<State>({
    selector: {
        activeEditor: (store) => store.state.pipe(pluck('active', 'activeEditor')),
        nodes: (store) => store.state.pipe(pluck('active', 'activeDiagram', 'nodes')),
        components: (store) => store.state.pipe(pluck('active', 'activeProjectComponents')),
        selected: (store) => store.state.pipe(pluck('selected')),
    }
})
export class NodeProperties {

    private nodeChangedSubscription: Subscription;

    activeEditor: GraphEditor;
    nodes: {
        [prop: string]: Node;
    };
    components: ProjectComponents;
    selected: SelectedState;

    nodeEdit: Node;

    currentLayer: number;
    layers: number;

    currentGroup: string;
    groups: {id: string, name: string}[] = [];
    noGroup = null;

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

        this.updateGroups();
        this.currentGroup = newState.selectedNodeGroup;

        if (oldState?.selectedNode != null && newState?.selectedNode != null) {
            if (oldState.selectedNode.id === newState.selectedNode.id) {
                // selection has not changed (only values in the selected elements have changed)
                return;
            }
        }
        this.nodeEdit = Object.assign({}, newState.selectedNode);
        this.componentEdit = Object.assign({}, newState.selectedComponent);
    }

    nodesChanged() {
        this.updateGroups();
    }

    componentsChanged() {
        this.updateGroups();
    }

    updateGroups() {
        if (this.nodes == null || this.components == null) {
            return;
        }
        const groups = [];
        Object.keys(this.nodes).forEach(nodeId => {
            if (this.selected?.selectedNode?.id === nodeId) {
                return; // cannot join itself...
            }
            const node = this.nodes[nodeId];
            if (node.type === 'group') {
                const componentId = node.elementId;
                const component = getProjectComponent(this.components, componentId);
                groups.push({
                    id: nodeId,
                    name: component?.title ?? node.id,
                });
            }
        });
        this.groups = groups;
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

    changeGroup() {
        if (this.currentGroup !== this.selected.selectedNodeGroup) {
            this.eventAggregator.publish(new NodeGroupChangedMessage(this.selected.selectedNode, this.currentGroup, this.selected.selectedNodeGroup, 'property-editor'));
        }
    }

}
