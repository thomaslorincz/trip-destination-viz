import Model from '../superclasses/Model';

/** Model that stores and controls the app's data and state. */
export default class AppModel extends Model {
  /** @param {EventEmitter} emitter */
  constructor(emitter) {
    super(emitter);

    /* @type {'2065BAP'|'2065CityII'} */
    this.dataset = '2065BAP';

    /* @type {Set} */
    this.overlay = new Set(['cma', 'city', 'lrt']);

    /* @type {'all'|Set} */
    this.purpose = 'all';

    /* @type {'all'|Set} */
    this.time = 'all';

    this.controlsHidden = false;

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

    this.helpOpen = false;

    this.collapsed = {
      dataset: false,
      purpose: false,
      overlay: false,
      time: false,
    };
  }

  /** A method for dispatching the initial draw event of the app. */
  initialDraw() {
    this.dispatchSettingsUpdated();
    this.emitter.emit('helpUpdated', this.helpOpen);
  }

  /** @param {'2065BAP'|'2065CityII'} dataset */
  updateDataset(dataset) {
    this.dataset = dataset;
    this.dispatchSettingsUpdated();
  }

  /** @param {'all'|'O'|'W'|'S'|'P'|'H'|'T'|'L'|'R'|'C'|'Q'} purpose */
  updatePurpose(purpose) {
    if (purpose === 'all') {
      if (this.purpose === 'all') {
        this.purpose = new Set();
      } else {
        this.purpose = purpose;
      }
    } else {
      if (this.purpose === 'all') {
        this.purpose = new Set([purpose]);
      } else {
        if (this.purpose.has(purpose)) {
          this.purpose.delete(purpose);
        } else {
          this.purpose.add(purpose);
        }
      }
    }

    this.dispatchSettingsUpdated();
  }

  /** @param {string} overlay */
  updateOverlay(overlay) {
    if (this.overlay.has(overlay)) {
      this.overlay.delete(overlay);
    } else {
      this.overlay.add(overlay);
    }

    this.dispatchSettingsUpdated();
  }

  /** @param {'all'|'1'|'21'|'22'|'23'|'3'|'41'|'42'|'43'|'5'|'6'} time */
  updateTime(time) {
    if (time === 'all') {
      if (this.time === 'all') {
        this.time = new Set();
      } else {
        this.time = time;
      }
    } else {
      if (this.time === 'all') {
        this.time = new Set([time]);
      } else {
        if (this.time.has(time)) {
          this.time.delete(time);
        } else {
          this.time.add(time);
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

  /** Toggle the visibility of the left controls. */
  toggleHide() {
    this.controlsHidden = !this.controlsHidden;
    this.dispatchSettingsUpdated();
  }

  /** Toggle the state of the help dialogue. */
  toggleHelp() {
    this.helpOpen = !this.helpOpen;
    this.emitter.emit('helpUpdated', this.helpOpen);
  }

  /** @param {'dataset'|'purpose'|'overlay'|'time'} control */
  toggleCollapse(control) {
    this.collapsed[control] = !this.collapsed[control];
    this.emitter.emit('collapsedUpdated', this.collapsed);
  }

  /** Shorthand method for dispatching a settingsUpdated event. */
  dispatchSettingsUpdated() {
    this.emitter.emit('settingsUpdated', {
      dataset: this.dataset,
      purpose: this.purpose,
      overlay: this.overlay,
      time: this.time,
      hidden: this.controlsHidden,
      colours: this.colours,
    });
  }
}
