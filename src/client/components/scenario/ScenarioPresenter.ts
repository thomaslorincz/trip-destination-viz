import Presenter from '../../superclasses/Presenter';
import AppModel from '../../app/AppModel';
import ScenarioView from './ScenarioView';
import * as EventEmitter from 'eventemitter3';

export default class ScenarioPresenter
  extends Presenter<AppModel, ScenarioView> {
  public constructor(model: AppModel, view: ScenarioView,
      emitter: EventEmitter) {
    super(model, view, emitter);
  }
}
