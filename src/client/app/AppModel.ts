import Model from '../superclasses/Model';
import * as EventEmitter from 'eventemitter3';

/** Model that stores and controls the app's data and state. */
export default class AppModel extends Model {
  /* Scenario component state data. */
  private readonly scenarios = new Map<string, boolean>([
    ['2065BAP', true],
    ['2065CityII', false],
  ]);
  private scenariosCollapsed: boolean = false;

  /* Purpose component state data. */
  private readonly purposes = new Map<string, boolean>([
    ['all', true],
    ['O', false],
    ['W', false],
    ['S', false],
    ['P', false],
    ['H', false],
    ['T', false],
    ['L', false],
    ['R', false],
    ['C', false],
    ['Q', false],
  ]);
  private readonly purposeColours = new Map<string, string>([
    ['all', '#FFFFFF'],
    ['O', '#FF0000'],
    ['W', '#FFA500'],
    ['S', '#FFFF00'],
    ['P', '#ADFF2F'],
    ['H', '#008000'],
    ['T', '#20B2AA'],
    ['L', '#0000FF'],
    ['R', '#9932CC'],
    ['C', '#FF1493'],
    ['Q', '#8B4513'],
  ]);
  private purposesCollapsed: boolean = false;

  /* Overlay component state data. */
  private readonly overlays = new Map<string, boolean>([
    ['cma', true],
    ['city', true],
    ['nc', false],
    ['lrt', true],
  ]);
  private readonly overlayColours = new Map<string, string>([
    ['cma', '#9932CC'],
    ['city', '#0000FF'],
    ['nc', '#FFFF00'],
    ['lrt', '#FF1493'],
  ]);
  private overlaysCollapsed: boolean = false;

  /* Time component state data. */
  private readonly times = new Map<string, boolean>([
    ['all', true],
    ['1', false],
    ['21', false],
    ['22', false],
    ['23', false],
    ['3', false],
    ['41', false],
    ['42', false],
    ['43', false],
    ['5', false],
    ['6', false],
  ]);
  private timesCollapsed: boolean = false;

  private helpOpen: boolean = false;

  public constructor(emitter: EventEmitter) {
    super(emitter);

    // Initial draw
    this.dispatchMapUpdated();
    this.dispatchScenarioUpdated();
    this.dispatchPurposeUpdated();
    this.dispatchOverlayUpdated();
    this.dispatchTimeUpdated();
    this.emitter.emit('help-updated', this.helpOpen);
  }

  public updateScenario(scenario: string): void {
    this.updateControlMap(this.scenarios, scenario);
    this.dispatchMapUpdated();
    this.dispatchScenarioUpdated();
  }

  public updatePurpose(purpose: string): void {
    this.updateControlMap(this.purposes, purpose);
    this.dispatchMapUpdated();
    this.dispatchPurposeUpdated();
  }

  public updateOverlay(overlay: string): void {
    this.updateControlMap(this.overlays, overlay);
    this.dispatchMapUpdated();
    this.dispatchOverlayUpdated();
  }

  public updateTime(time: string): void {
    this.updateControlMap(this.times, time);
    this.dispatchMapUpdated();
    this.dispatchTimeUpdated();
  }

  private updateControlMap(controlMap: Map<string, boolean>,
      key: string): void {
    // Set all control options to inactive
    Object.keys(controlMap).forEach((key: string): void => {
      controlMap.set(key, false);
    });

    // Set the selected control option to active
    controlMap.set(key, true);
  }

  public updatePurposeColours(purpose: string, colour: string): void {
    this.purposeColours.set(purpose, colour);
  }

  public updateOverlayColours(overlay: string, colour: string): void {
    this.overlayColours.set(overlay, colour);
  }

  /** Toggle the state of the help dialogue. */
  public toggleHelp(): void {
    this.helpOpen = !this.helpOpen;
    this.emitter.emit('helpUpdated', this.helpOpen);
  }

  public toggleCollapse(control: string): void {
    if (control === 'scenario') {
      this.scenariosCollapsed = !this.scenariosCollapsed;
      this.dispatchScenarioUpdated();
    } else if (control === 'purpose') {
      this.purposesCollapsed = !this.purposesCollapsed;
      this.dispatchPurposeUpdated();
    } else if (control === 'overlay') {
      this.overlaysCollapsed = !this.overlaysCollapsed;
      this.dispatchOverlayUpdated();
    } else if (control === 'time') {
      this.timesCollapsed = !this.timesCollapsed;
      this.dispatchTimeUpdated();
    }
  }

  /** Shorthand method for dispatching a map-updated event. */
  private dispatchMapUpdated(): void {
    this.emitter.emit(
        'map-updated',
        this.scenarios,
        this.purposes,
        this.overlays,
        this.times,
        this.purposeColours,
        this.overlayColours
    );
  }

  private dispatchScenarioUpdated(): void {
    this.emitter.emit(
        'scenario-updated',
        this.scenarios,
        this.scenariosCollapsed
    );
  }

  private dispatchPurposeUpdated(): void {
    this.emitter.emit(
        'purpose-updated',
        this.purposes,
        this.purposeColours,
        this.purposesCollapsed
    );
  }

  private dispatchOverlayUpdated(): void {
    this.emitter.emit(
        'overlay-updated',
        this.overlays,
        this.overlayColours,
        this.overlaysCollapsed
    );
  }

  private dispatchTimeUpdated(): void {
    this.emitter.emit(
        'time-updated',
        this.times,
        this.timesCollapsed
    );
  }
}
