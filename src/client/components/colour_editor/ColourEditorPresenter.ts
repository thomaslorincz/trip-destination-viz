import Presenter from '../../superclasses/Presenter';
import AppModel from '../../app/AppModel';
import ColourEditorView from './ColourEditorView';
import * as EventEmitter from 'eventemitter3';

export default class ColourEditorPresenter
  extends Presenter<AppModel, ColourEditorView> {
  public constructor(model: AppModel, view: ColourEditorView,
      emitter: EventEmitter) {
    super(model, view, emitter);

    this.emitter.on(
        'colours-updated',
        (type: string, colourMap: Map<string, string>) => {
          if (type === 'purpose') {
            this.model.updatePurposeColours(colourMap);
          } else if (type === 'overlay') {
            this.model.updateOverlayColours(colourMap);
          }
        }
    );
  }
}
