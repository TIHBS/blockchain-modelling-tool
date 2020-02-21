import { Node } from "@ustutt/grapheditor-webcomponent/lib/node";
import { ProjectComponent } from "project";

export const NODE_SELECTION_CHANNEL = 'node-selection';


export class NodeChangedMessage {
    readonly source: 'graph'|'property-editor';
    readonly newNode: Node;
    readonly oldNode: Node;

    constructor(newNode: Node, oldNode: Node, source: 'graph'|'property-editor') {
        this.source = source;
        this.newNode = newNode;
        this.oldNode = oldNode;
    }
}

export class NodePositionChangedMessage extends NodeChangedMessage {}

export class NodeTypeChangedMessage extends NodeChangedMessage {}

export class NodePropertiesChangedMessage extends NodeChangedMessage {}

export class ProjectComponentChangedMessage {
    readonly source: 'graph'|'property-editor';
    readonly newComponent: ProjectComponent<string>;
    readonly oldComponent: ProjectComponent<string>;

    constructor(newComponent: ProjectComponent<string>, oldComponent: ProjectComponent<string>, source: 'graph'|'property-editor') {
        this.source = source;
        this.newComponent = newComponent;
        this.oldComponent = oldComponent;
    }
}
