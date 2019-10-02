import Presenter from '../../superclasses/Presenter';
import AppModel from '../../app/AppModel';
import ColourEditorView from './ColourEditorView';
import * as EventEmitter from 'eventemitter3';

export default class ColourEditorPresenter
  extends Presenter<AppModel, ColourEditorView> {
  public constructor(model: AppModel, view: ColourEditorView,
      emitter: EventEmitter) {
    super(model, view, emitter);
  }
}
