import Presenter from '../superclasses/Presenter';
import AppModel from './AppModel';
import View from '../superclasses/View';
import * as EventEmitter from 'eventemitter3';
import MapView from '../components/map/MapView';
import MapPresenter from '../components/map/MapPresenter';
import OverlayView from '../components/overlay/OverlayView';
import OverlayPresenter from '../components/overlay/OverlayPresenter';
import PurposeView from '../components/purpose/PurposeView';
import PurposePresenter from '../components/purpose/PurposePresenter';

export default class AppPresenter extends Presenter<AppModel, View> {
  private readonly mapView: MapView;
  private readonly overlayView: OverlayView;
  private readonly purposeView: PurposeView;

  public constructor(model: AppModel, view: View, emitter: EventEmitter) {
    super(model, view, emitter);

    this.mapView = new MapView(document.getElementById('map'), this.emitter);
    new MapPresenter(this.model, this.mapView, this.emitter);

    this.overlayView = new OverlayView(
        document.getElementById('overlay-control'),
        this.emitter
    );
    new OverlayPresenter(this.model, this.overlayView, this.emitter);

    this.purposeView = new PurposeView(
        document.getElementById('purpose-control'),
        this.emitter
    );
    new PurposePresenter(this.model, this.purposeView, this.emitter);

    this.emitter.on(
        'settingsUpdated',
        ({dataset, purpose, overlay, time, animating, colours}): void => {
          this.mapView.draw(
              dataset,
              purpose,
              overlay,
              time,
              animating,
              colours
          );
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
