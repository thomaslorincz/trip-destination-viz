import Presenter from '../superclasses/Presenter';
import MapView from '../components/map/MapView';
import MapPresenter from '../components/map/MapPresenter';

/** @class */
export default class AppPresenter extends Presenter {
  /**
   * @param {AppModel} model
   * @param {View} view
   * @param {EventEmitter} emitter
   */
  constructor(model, view, emitter) {
    super(model, view, emitter);

    this.mapView = new MapView(document.getElementById('map'), this.emitter);
    new MapPresenter(this.model, this.mapView, this.emitter);

    this.emitter.on('settingsUpdated', (settings) => {
      this.mapView.draw(settings);
    });

    this.emitter.on('helpUpdated', (helpOpen) => {
      this.mapView.drawHelp(helpOpen);
    });

    this.emitter.on('collapsedUpdated', (collapsed) => {
      this.mapView.drawCollapsed(collapsed);
    });
  }
}
