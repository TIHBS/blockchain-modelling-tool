import {Redirect, NavigationInstruction, RouterConfiguration} from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';

export class App {
    public message: string = 'Hello World!';

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
