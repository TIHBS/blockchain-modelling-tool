import GraphEditor from '@ustutt/grapheditor-webcomponent/lib/grapheditor';
import { Node } from '@ustutt/grapheditor-webcomponent/lib/node';
import { LinkHandle } from '@ustutt/grapheditor-webcomponent/lib/link-handle';
import { GroupBehaviour } from '@ustutt/grapheditor-webcomponent/lib/grouping';
import { DynamicNodeTemplate, DynamicTemplateContext } from '@ustutt/grapheditor-webcomponent/lib/dynamic-templates/dynamic-template';
import { Point } from '@ustutt/grapheditor-webcomponent/lib/edge';
import { Rect, calculateBoundingRect } from '@ustutt/grapheditor-webcomponent/lib/util';


export class DynamicGroupTemplate implements DynamicNodeTemplate {
    renderInitialTemplate(g: any, grapheditor: GraphEditor, context: DynamicTemplateContext<Node>): void {
        g.append('rect')
            .attr('x', (d) => -(d.width / 2))
            .attr('y', (d) => -(d.height / 2))
            .attr('width', (d) => d.width)
            .attr('height', (d) => d.height)
            .attr('rx', 5)
            .attr('stroke', 'black')
            .attr('fill', 'white')
            .attr('stroke-dasharray', '4');
    }

    updateTemplate(g: any, grapheditor: GraphEditor, context: DynamicTemplateContext<Node>): void {
        g.select('rect')
            .attr('x', (d) => -(d.width / 2))
            .attr('y', (d) => -(d.height / 2))
            .attr('width', (d) => d.width)
            .attr('height', (d) => d.height);
    }

    getLinkHandles(g: any, grapheditor: GraphEditor): LinkHandle[] {
        return [];
    }
}


export class DynamicGroupBehaviour implements GroupBehaviour {
    moveChildrenAlongGoup = true;
    captureDraggedNodes = true;
    allowFreePositioning = true;
    allowDraggedNodesLeavingGroup = true;

    afterNodeJoinedGroup(group: string, childGroup: string, groupNode: Node, childNode: Node, graphEditor: GraphEditor, atPosition?: Point) {
    }

    onNodeMoveEnd(group: string, childGroup: string, groupNode: Node, childNode: Node, graphEditor: GraphEditor) {
        this.reposition(group, groupNode, graphEditor);
    }

    reposition(group: string, groupNode: Node, graphEditor: GraphEditor) {
        const children = graphEditor.groupingManager.getAllChildrenOf(group);
        const boxes: Rect[] = [{
            x: groupNode.x - (groupNode.width / 2) + 5,
            y: groupNode.y - (groupNode.height / 2) + 5,
            width: groupNode.width - 5,
            height: groupNode.height - 5,
        }];

        children.forEach(childId => {
            const node = graphEditor.getNode(childId);
            if (node == null) {
                return;
            }

            if (node.width != null && node.height != null) {
                boxes.push({
                    x: node.x - (node.width / 2),
                    y: node.y - (node.height / 2),
                    width: node.width,
                    height: node.height,
                });
                return;
            }

            boxes.push({
                x: node.x - 30,
                y: node.y - 30,
                width: 60,
                height: 60,
            });
        });

        if (boxes.length < 1) {
            return;
        }

        const minBox = calculateBoundingRect(...boxes);
        if (minBox.width + 10 < groupNode.width && minBox.height + 10 < groupNode.height) {
            return;
        }
        const center: Point = {
            x: minBox.x + (minBox.width / 2),
            y: minBox.y + (minBox.height / 2),
        };
        groupNode.width = minBox.width + 10;
        groupNode.height = minBox.height + 10;
        groupNode.x = center.x;
        groupNode.y = center.y;
        graphEditor.moveNode(group, center.x, center.y);
        graphEditor.completeRender(); // FIXME remove if no longer needed
    }
}
