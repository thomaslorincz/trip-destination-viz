import Presenter from '../../superclasses/Presenter';

/** @class */
export default class MapPresenter extends Presenter {
  /**
   * @param {AppModel} model
   * @param {MapView} view
   * @param {EventEmitter} emitter
   */
  constructor(model, view, emitter) {
    super(model, view, emitter);

    this.emitter.on('loaded', () => {
      this.model.initialDraw();
    });

    this.emitter.on('datasetClicked', (dataset) => {
      this.model.updateDataset(dataset);
    });

    this.emitter.on('purposeClicked', (purpose) => {
      this.model.updatePurpose(purpose);
    });

    this.emitter.on('overlayClicked', (overlay) => {
      this.model.updateOverlay(overlay);
    });

    this.emitter.on('timeClicked', (time) => {
      this.model.updateTime(time);
    });

    this.emitter.on('hideClicked', () => {
      this.model.toggleHide();
    });

    this.emitter.on('colourClicked', ({category, key, value}) => {
      this.model.updateColours({category, key, value});
    });

    this.emitter.on('helpClicked', () => {
      this.model.toggleHelp();
    });

    this.emitter.on('toggleCollapse', (control) => {
      this.model.toggleCollapse(control);
    });
  }
}
