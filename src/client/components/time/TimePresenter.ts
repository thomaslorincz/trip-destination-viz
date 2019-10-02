import Presenter from '../../superclasses/Presenter';
import AppModel from '../../app/AppModel';
import TimeView from './TimeView';
import * as EventEmitter from 'eventemitter3';

export default class TimePresenter extends Presenter<AppModel, TimeView> {
  public constructor(model: AppModel, view: TimeView, emitter: EventEmitter) {
    super(model, view, emitter);
  }
}
