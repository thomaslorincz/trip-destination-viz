import Presenter from '../superclasses/Presenter';
import MapView from '../components/map/MapView';
import MapPresenter from '../components/map/MapPresenter';
import AppModel from './AppModel';
import View from '../superclasses/View';
import * as EventEmitter from 'eventemitter3';

export default class AppPresenter extends Presenter<AppModel, View> {
  private readonly mapView: MapView;

  public constructor(model: AppModel, view: View, emitter: EventEmitter) {
    super(model, view, emitter);

    this.mapView = new MapView(document.getElementById('map'), this.emitter);
    new MapPresenter(this.model, this.mapView, this.emitter);

    this.emitter.on(
        'settingsUpdated',
        ({dataset, purpose, overlay, time, hidden, colours}): void => {
          this.mapView.draw(dataset, purpose, overlay, time, hidden, colours);
        }
    );

    this.emitter.on('helpUpdated', (helpOpen: boolean): void => {
      MapView.drawHelp(helpOpen);
    });

    this.emitter.on('collapsedUpdated', (collapsed: object): void => {
      this.mapView.drawCollapsed(collapsed);
    });
  }
}
