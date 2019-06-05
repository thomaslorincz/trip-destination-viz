import Model from '../superclasses/Model';

/**
 * Model that stores and controls the app's data and state.
 */
export default class AppModel extends Model {
  // eslint-disable-next-line
  constructor() {
    super();

    /** @type {'all'|string[]} */
    this.time = 'all';
  }

  /**
   * A method for dispatching the initial draw event of the app.
   */
  initialDraw() {
    document.dispatchEvent(new CustomEvent('initialDraw', {
      detail: this.time,
    }));
  }

  /**
   * @param {'all'|'1'|'21'|'22'|'23'|'3'|'41'|'42'|'43'|'5'|'6'} time
   * @param {boolean} ctrlKey
   */
  updateTime({time, ctrlKey}) {
    if (time === 'all') {
      this.time = time;
    } else if (ctrlKey && this.time === 'all') {
      this.time = [time];
    } else if (ctrlKey) {
      this.time.push(time);
    } else {
      this.time = [time];
    }

    document.dispatchEvent(new CustomEvent('timeUpdated', {
      detail: this.time,
    }));
  }
}
