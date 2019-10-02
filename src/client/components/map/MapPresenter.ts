import Presenter from '../../superclasses/Presenter';
import AppModel from '../../app/AppModel';
import MapView from './MapView';
import * as EventEmitter from 'eventemitter3';

export default class MapPresenter extends Presenter<AppModel, MapView> {
  public constructor(model: AppModel, view: MapView, emitter: EventEmitter) {
    super(model, view, emitter);

    this.emitter.on('loaded', (): void => {
      this.model.initialDraw();
    });

    this.emitter.on('purposeClicked', (purpose: string): void => {
      this.model.updatePurpose(purpose);
    });

    this.emitter.on('timeClicked', (time: string): void => {
      this.model.updateTime(time);
    });

    this.emitter.on('time-animate-clicked', (): void => {
      this.model.toggleAnimation();
    });

    this.emitter.on('hideClicked', (): void => {
      this.model.toggleHide();
    });

    this.emitter.on('colourClicked', ({category, key, value}): void => {
      this.model.updateColours(category, key, value);
    });

    this.emitter.on('helpClicked', (): void => {
      this.model.toggleHelp();
    });

    this.emitter.on('toggle-collapse', (control: string): void => {
      this.model.toggleCollapse(control);
    });
  }
}
