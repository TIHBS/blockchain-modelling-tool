import {bindable} from 'aurelia-framework';
import GraphEditor from '@ustutt/grapheditor-webcomponent/lib/grapheditor'

export class Editor {

    grapheditor: GraphEditor;
    @bindable value;

    valueChanged(newValue, oldValue) {
      //
    }

    attached() {
        this.grapheditor.addNode({
            id: 'test-a',
            title: 'test a',
            x: 0,
            y: 0,
        });
        this.grapheditor.addNode({
            id: 'test-b',
            title: 'test b',
            x: 130,
            y: 0,
        });
        this.grapheditor.addNode({
            id: 'test-c',
            title: 'test c',
            x: 0,
            y: 70,
        });
        this.grapheditor.completeRender();
        this.grapheditor.zoomToBoundingBox();
        console.log(this.grapheditor)
    }
}
