import Model from '../superclasses/Model';

/**
 * Model that stores and controls the app's data and state.
 */
export default class AppModel extends Model {
  // eslint-disable-next-line
  constructor() {
    super();

    /** @type {'2065BAP'|'2065CityII'} */
    this.dataset = '2065BAP';

    /** @type {''|Set} */
    this.overlay = '';

    /** @type {'all'|Set} */
    this.purpose = 'all';

    /** @type {'all'|Set} */
    this.time = 'all';
  }

  /**
   * A method for dispatching the initial draw event of the app.
   */
  initialDraw() {
    this.dispatchSettingsUpdated();
  }

  /**
   * @param {'2065BAP'|'2065CityII'} dataset
   */
  updateDataset(dataset) {
    this.dataset = dataset;
    this.dispatchSettingsUpdated();
  }

  /**
   * @param {'all'|'O'|'W'|'S'|'P'|'H'|'T'|'L'|'R'|'C'|'Q'} value
   * @param {boolean} ctrlKey
   */
  updatePurpose({value, ctrlKey}) {
    if (ctrlKey && value === 'all') {
      this.purpose = new Set();
    } else if (value === 'all') {
      this.purpose = value;
    } else if (ctrlKey && this.purpose === 'all') {
      this.purpose = new Set([value]);
    } else if (ctrlKey) {
      if (this.purpose.has(value)) {
        this.purpose.delete(value);
      } else {
        this.purpose.add(value);
      }
    } else {
      this.purpose = new Set([value]);
    }

    this.dispatchSettingsUpdated();
  }

  /**
   * @param {'city'|'nc'|''} value
   * @param {boolean} ctrlKey
   */
  updateOverlay({value, ctrlKey}) {
    if (ctrlKey && value === '') {
      this.overlay = new Set();
    } else if (value === '') {
      this.overlay = value;
    } else if (ctrlKey && this.overlay === '') {
      this.overlay = new Set([value]);
    } else if (ctrlKey) {
      if (this.overlay.has(value)) {
        this.overlay.delete(value);
      } else {
        this.overlay.add(value);
      }
    } else {
      this.overlay = new Set([value]);
    }

    this.dispatchSettingsUpdated();
  }

  /**
   * @param {'all'|'1'|'21'|'22'|'23'|'3'|'41'|'42'|'43'|'5'|'6'} time
   * @param {boolean} ctrlKey
   */
  updateTime({time, ctrlKey}) {
    if (ctrlKey && time === 'all') {
      this.time = new Set();
    } else if (time === 'all') {
      this.time = time;
    } else if (ctrlKey && this.time === 'all') {
      this.time = new Set([time]);
    } else if (ctrlKey) {
      if (this.time.has(time)) {
        this.time.delete(time);
      } else {
        this.time.add(time);
      }
    } else {
      this.time = new Set([time]);
    }

    this.dispatchSettingsUpdated();
  }

  /**
   * Shorthand method for dispatching a settingsUpdated event.
   */
  dispatchSettingsUpdated() {
    document.dispatchEvent(new CustomEvent('settingsUpdated', {
      detail: {
        dataset: this.dataset,
        purpose: this.purpose,
        overlay: this.overlay,
        time: this.time,
      },
    }));
  }
}
