import Presenter from '../../superclasses/Presenter';
import AppModel from '../../app/AppModel';
import PurposeView from './PurposeView';
import * as EventEmitter from 'eventemitter3';

export default class PurposePresenter extends Presenter<AppModel, PurposeView> {
  public constructor(model: AppModel, view: PurposeView,
      emitter: EventEmitter) {
    super(model, view, emitter);

    this.emitter.on('purpose-clicked', (purpose: string): void => {
      this.model.updatePurpose(purpose);
    });

    this.emitter.on('toggle-purpose-collapse', (): void => {
      this.model.toggleCollapse('purpose');
    });

    this.emitter.on('purpose-edit-colours-clicked', () => {
      this.model.openColourEditor('purpose');
    });
  }
}
