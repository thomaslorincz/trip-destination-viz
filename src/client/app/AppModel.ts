import Model from '../superclasses/Model';
import * as EventEmitter from 'eventemitter3';

/** Model that stores and controls the app's data and state. */
export default class AppModel extends Model {
  private scenario: string = '2065BAP';
  private overlay: Set<string> = new Set(['cma', 'city', 'lrt']);
  private purpose: Set<string> = new Set(['all']);
  private time: Set<string> = new Set(['all']);
  private controlsHidden: boolean = false;
  private readonly dataDrivenPurposeColours: any[];
  private readonly purposeToColourIndex: object;
  private readonly colours: object;
  private helpOpen: boolean = false;
  private readonly collapsed: object;

  private currentTime: string = '1';
  private animating: boolean = false;
  private animationInterval: number = undefined;
  private timeSequence = new Map<string, string>([
    ['1', '21'],
    ['21', '22'],
    ['22', '23'],
    ['23', '3'],
    ['3', '41'],
    ['41', '42'],
    ['42', '43'],
    ['43', '5'],
    ['5', '6'],
    ['6', '1'],
  ]);

  public constructor(emitter: EventEmitter) {
    super(emitter);

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

    this.collapsed = {
      dataset: false,
      purpose: false,
      overlay: false,
      time: false,
    };
  }

  /** A method for dispatching the initial draw event of the app. */
  public initialDraw(): void {
    this.dispatchSettingsUpdated();
    this.emitter.emit('helpUpdated', this.helpOpen);
  }

  public updateScenario(scenario: string): void {
    this.scenario = scenario;
    this.dispatchSettingsUpdated();
  }

  public updatePurpose(purpose: string): void {
    this.purpose = AppModel.updateStringSet(this.purpose, purpose);
    this.dispatchSettingsUpdated();
  }

  public updateOverlay(overlay: string): void {
    if (this.overlay.has(overlay)) {
      this.overlay.delete(overlay);
    } else {
      this.overlay.add(overlay);
    }

    this.dispatchSettingsUpdated();
  }

  public updateTime(time): void {
    this.time = AppModel.updateStringSet(this.time, time);
    this.dispatchSettingsUpdated();
  }

  private static updateStringSet(set: Set<string>, value: string): Set<string> {
    if (value === 'all') {
      if (set.has('all')) {
        set.delete('all');
      } else {
        set = new Set(['all']);
      }
    } else {
      if (set.has('all')) {
        set = new Set([value]);
      } else {
        if (set.has(value)) {
          set.delete(value);
        } else {
          set.add(value);
        }
      }
    }
    return set;
  }

  public updateColours(category: string, key: string, value: string): void {
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
   * Animate the time of day selection. Time is stored as a set so the set must
   * be cleared before the animation begins.
   */
  public toggleAnimation(): void {
    if (this.animating) {
      this.animating = false;
      window.clearInterval(this.animationInterval);
    } else {
      this.animating = true;
      this.time.clear();
      this.currentTime = '1';

      this.animationInterval = window.setInterval((): void => {
        this.currentTime = this.timeSequence.get(this.currentTime);
        this.time.clear();
        this.updateTime(this.currentTime);
      }, 1000);

      this.dispatchSettingsUpdated();
    }
  }

  /** Toggle the visibility of the left controls. */
  public toggleHide(): void {
    this.controlsHidden = !this.controlsHidden;
    this.dispatchSettingsUpdated();
  }

  /** Toggle the state of the help dialogue. */
  public toggleHelp(): void {
    this.helpOpen = !this.helpOpen;
    this.emitter.emit('helpUpdated', this.helpOpen);
  }

  public toggleCollapse(control: string): void {
    this.collapsed[control] = !this.collapsed[control];
    this.emitter.emit('collapsedUpdated', this.collapsed);
  }

  /** Shorthand method for dispatching a settingsUpdated event. */
  private dispatchSettingsUpdated(): void {
    this.emitter.emit('settingsUpdated', {
      scenario: this.scenario,
      purpose: this.purpose,
      overlay: this.overlay,
      time: this.time,
      animating: this.animating,
      hidden: this.controlsHidden,
      colours: this.colours,
    });
  }
}
