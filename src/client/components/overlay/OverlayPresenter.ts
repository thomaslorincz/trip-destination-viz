import Presenter from '../../superclasses/Presenter';
import AppModel from '../../app/AppModel';
import OverlayView from './OverlayView';
import * as EventEmitter from 'eventemitter3';

export default class OverlayPresenter extends Presenter<AppModel, OverlayView> {
  public constructor(model: AppModel, view: OverlayView,
      emitter: EventEmitter) {
    super(model, view, emitter);
  }
}
