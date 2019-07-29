import * as EventEmitter from 'eventemitter3';

export default class Model {
  protected readonly emitter: EventEmitter;

  protected constructor(emitter: EventEmitter) {
    this.emitter = emitter;
  }
}
