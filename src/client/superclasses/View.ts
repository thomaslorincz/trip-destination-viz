import * as EventEmitter from 'eventemitter3';

export default class View {
  protected readonly container: Element;
  protected readonly emitter: EventEmitter;

  protected constructor(container: HTMLElement, emitter: EventEmitter) {
    this.container = container;
    this.emitter = emitter;
  }
}
