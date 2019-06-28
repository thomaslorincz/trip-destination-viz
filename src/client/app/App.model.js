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

    /** @type {Set} */
    this.overlay = new Set(['cma', 'city', 'lrt']);

    /** @type {'all'|Set} */
    this.purpose = 'all';

    /** @type {'all'|Set} */
    this.time = 'all';

    this.dataDrivenPurposeColours = [
      'match', ['get', 'purp'],
      'O', '#FF0000',
      'W', '#FFA500',
      'S', '#FFFF00',
      'P', '#ADFF2F',
      'H', '#008000',
      'T', '#20B2AA',
      'L', '#0000FF',
      'R', '#9932CC',
      'C', '#FF1493',
      'Q', '#8B4513',
      '#000000',
    ];

    this.purposeToColourIndex = {
      O: 3, W: 5, S: 7, P: 9, H: 11, T: 13, L: 15, R: 17, C: 19, Q: 21,
    };

    this.colours = {
      purpose: {
        dataDriven: this.dataDrivenPurposeColours,
        all: '#FFFFFF',
        O: '#FF0000',
        W: '#FFA500',
        S: '#FFFF00',
        P: '#ADFF2F',
        H: '#008000',
        T: '#20B2AA',
        L: '#0000FF',
        R: '#9932CC',
        C: '#FF1493',
        Q: '#8B4513',
      },
      overlay: {
        cma: '#9932CC',
        city: '#0000FF',
        nc: '#FFFF00',
        lrt: '#FF1493',
      },
    };

    /** @type {boolean} */
    this.helpOpen = false;

    this.collapsed = {
      dataset: false,
      purpose: false,
      overlay: false,
      time: false,
    };
  }

  /**
   * A method for dispatching the initial draw event of the app.
   */
  initialDraw() {
    this.dispatchSettingsUpdated();
    this.dispatchHelpUpdated();
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
   */
  updatePurpose({value}) {
    if (value === 'all') {
      if (this.purpose === 'all') {
        this.purpose = new Set();
      } else {
        this.purpose = value;
      }
    } else {
      if (this.purpose === 'all') {
        this.purpose = new Set([value]);
      } else {
        if (this.purpose.has(value)) {
          this.purpose.delete(value);
        } else {
          this.purpose.add(value);
        }
      }
    }

    this.dispatchSettingsUpdated();
  }

  /**
   * @param {string} value
   */
  updateOverlay({value}) {
    if (this.overlay.has(value)) {
      this.overlay.delete(value);
    } else {
      this.overlay.add(value);
    }

    this.dispatchSettingsUpdated();
  }

  /**
   * @param {'all'|'1'|'21'|'22'|'23'|'3'|'41'|'42'|'43'|'5'|'6'} value
   */
  updateTime({value}) {
    if (value === 'all') {
      if (this.time === 'all') {
        this.time = new Set();
      } else {
        this.time = value;
      }
    } else {
      if (this.time === 'all') {
        this.time = new Set([value]);
      } else {
        if (this.time.has(value)) {
          this.time.delete(value);
        } else {
          this.time.add(value);
        }
      }
    }

    this.dispatchSettingsUpdated();
  }

  /**
   * @param {'purpose'|'overlay'} category
   * @param {string} key
   * @param {string} value
   */
  updateColours({category, key, value}) {
    const colours = this.colours[category];
    if (category === 'purpose') {
      if (key === 'all') {
        colours['all'] = value;
      } else {
        colours[key] = value;
        this.dataDrivenPurposeColours[this.purposeToColourIndex[key]] = value;
        colours['dataDriven'] = this.dataDrivenPurposeColours;
      }
    } else {
      colours[key] = value;
    }

    this.dispatchSettingsUpdated();
  }

  /**
   * Toggle the state of the help dialogue.
   */
  toggleHelp() {
    this.helpOpen = !this.helpOpen;
    this.dispatchHelpUpdated();
  }

  /**
   * @param {'dataset'|'purpose'|'overlay'|'time'} control
   */
  toggleCollapse(control) {
    this.collapsed[control] = !this.collapsed[control];
    document.dispatchEvent(new CustomEvent('collapsedUpdated', {
      detail: this.collapsed,
    }));
  }

  /**
   * Shorthand method for dispatching a helpUpdated event.
   */
  dispatchHelpUpdated() {
    document.dispatchEvent(new CustomEvent('helpUpdated', {
      detail: this.helpOpen,
    }));
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
        colours: this.colours,
      },
    }));
  }
}
