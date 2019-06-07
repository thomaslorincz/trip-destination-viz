import Presenter from '../../superclasses/Presenter';

// eslint-disable-next-line
export default class MapPresenter extends Presenter {
  /**
   * @param {AppModel} model
   * @param {MapView} view
   */
  constructor(model, view) {
    super(model, view);

    this.view.container.addEventListener('loaded', () => {
      this.model.initialDraw();
    });

    document.addEventListener('initialDraw', (event) => {
      this.view.draw(event.detail);
    });

    this.view.container.addEventListener('datasetClicked', (event) => {
      this.model.updateDataset(event.detail);
    });

    this.view.container.addEventListener('purposeClicked', (event) => {
      this.model.updatePurpose(event.detail);
    });

    this.view.container.addEventListener('overlayClicked', (event) => {
      this.model.updateOverlay(event.detail);
    });

    this.view.container.addEventListener('colourClicked', (event) => {
      this.model.updateColours(event.detail);
    });

    this.view.container.addEventListener('timeClicked', (event) => {
      this.model.updateTime(event.detail);
    });

    document.addEventListener('settingsUpdated', (event) => {
      this.view.draw(event.detail);
    });
  }
}
