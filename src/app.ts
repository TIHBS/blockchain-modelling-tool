import {Redirect, NavigationInstruction, RouterConfiguration} from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { autoinject } from 'aurelia-dependency-injection';
import { Store } from 'aurelia-store';
import { State } from './state';

import { changeActiveProject, addProjectComponent, updateProjectComponent } from './resources/state-actions/active-project-actions';
import { addNode, removeNode, addEdge, removeEdge, selectNode, updateNode, updateSelectedNodeLayer, updateSelectedNodeGroup } from './resources/state-actions/active-diagram-actions';

@autoinject()
export class App {

    constructor(private store: Store<State>) {
        this.store.registerAction('changeActiveProject', changeActiveProject);
        this.store.registerAction('addProjectComponent', addProjectComponent);
        this.store.registerAction('updateProjectComponent', updateProjectComponent);

        this.store.registerAction('addNode', addNode);
        this.store.registerAction('updateNode', updateNode);
        this.store.registerAction('removeNode', removeNode);
        this.store.registerAction('addEdge', addEdge);
        this.store.registerAction('removeEdge', removeEdge);

        this.store.registerAction('selectNode', selectNode);
        this.store.registerAction('updateSelectedNodeLayer', updateSelectedNodeLayer);
        this.store.registerAction('updateSelectedNodeGroup', updateSelectedNodeGroup);

    }

    configureRouter(config: RouterConfiguration): void {
        config.title = 'Blockchain Modelling Tool';
        config.options.pushState = true;
        config.options.root = '/';
        config.map([
            {
                route: ['/', 'welcome'],
                name: 'welcome',
                viewPorts: {
                    sidebar: {moduleId: PLATFORM.moduleName('resources/elements/welcome-sidebar')},
                    content: {moduleId: PLATFORM.moduleName('resources/elements/welcome')}
                },
                nav: true,
                title:'Welcome'
            },
            {
                route: ['projects'],
                name: 'projects',
                viewPorts: {
                    sidebar: {moduleId: PLATFORM.moduleName('resources/elements/projects-sidebar')},
                    content: {moduleId: PLATFORM.moduleName('resources/elements/projects-overview')}
                },
                nav: true,
                title:'Projects'
            },
            {
                route: ['playground'],
                name: 'playground',
                viewPorts: {
                    sidebar: {moduleId: PLATFORM.moduleName('resources/elements/editor-sidebar')},
                    content: {moduleId: PLATFORM.moduleName('resources/elements/editor')}
                },
                nav: true,
                title:'Playground'
            },
            { route: '', redirect: 'welcome' }
        ]);
      }
}
