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
import ScenarioView from '../components/scenario/ScenarioView';
import ScenarioPresenter from '../components/scenario/ScenarioPresenter';
import TimeView from '../components/time/TimeView';
import TimePresenter from '../components/time/TimePresenter';
import ColourEditorView from '../components/colour_editor/ColourEditorView';
import ColourEditorPresenter
  from '../components/colour_editor/ColourEditorPresenter';

export default class AppPresenter extends Presenter<AppModel, View> {
  private readonly colourEditorView: ColourEditorView;
  private readonly mapView: MapView;
  private readonly overlayView: OverlayView;
  private readonly purposeView: PurposeView;
  private readonly scenarioView: ScenarioView;
  private readonly timeView: TimeView;

  public constructor(model: AppModel, view: View, emitter: EventEmitter) {
    super(model, view, emitter);

    this.colourEditorView = new ColourEditorView(
        document.getElementById('colour-choices'),
        this.emitter
    );
    new ColourEditorPresenter(this.model, this.colourEditorView, this.emitter);

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

    this.scenarioView = new ScenarioView(
        document.getElementById('scenario-control'),
        this.emitter
    );
    new ScenarioPresenter(this.model, this.scenarioView, this.emitter);

    this.timeView = new TimeView(
        document.getElementById('time-control'),
        this.emitter
    );
    new TimePresenter(this.model, this.timeView, this.emitter);

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
