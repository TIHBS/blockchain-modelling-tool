import { inject } from 'aurelia-dependency-injection';
import { Project, ProjectItem, CLIOptions, UI } from 'aurelia-cli';

var path = require('path');

@inject(Project, CLIOptions, UI)
export default class SvgElementGenerator {
  constructor(private project: Project, private options: CLIOptions, private ui: UI) { }

  async execute() {
    const name = await this.ui.ensureAnswer(
      this.options.args[0],
      'What would you like to call the custom svg-element?'
    );

    let fileName = this.project.makeFileName(name);
    let className = this.project.makeClassName(name);

    this.project.svgElements.add(
      ProjectItem.text(`${fileName}.ts`, this.generateJSSource(className)),
      ProjectItem.text(`${fileName}.html`, this.generateHTMLSource(className))
    );

    await this.project.commitChanges();
    await this.ui.log(`Created ${fileName}.`);
  }

  generateJSSource(className) {
    return `import { containerless, bindable } from 'aurelia-framework';

@containerless()
export class ${className} {
    @bindable translate;
}
`
  }

  generateHTMLSource(className) {
    return `<template>
    <svg>
        // content
    </svg>
</template>
`
  }
}
