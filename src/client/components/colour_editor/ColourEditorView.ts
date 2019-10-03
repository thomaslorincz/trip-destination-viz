import View from '../../superclasses/View';
import * as EventEmitter from 'eventemitter3';

export default class ColourEditorView extends View {
  public constructor(container: HTMLElement, emitter: EventEmitter) {
    super(container, emitter);
  }
}