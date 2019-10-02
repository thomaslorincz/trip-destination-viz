import View from '../../superclasses/View';
import * as EventEmitter from 'eventemitter3';

export default class ScenarioView extends View {
  private scenarioEntries = document.querySelectorAll('.scenario-entry');
  private scenarioCollapse = document.getElementById('collapse-scenario');

  public constructor(container: HTMLElement, emitter: EventEmitter) {
    super(container, emitter);

    const scenarios = new Map<string, boolean>();
    document.querySelectorAll('.scenario-entry')
        .forEach((entry: HTMLElement): void => {
          scenarios.set(
              entry.dataset.value,
              entry.classList.contains('active')
          );
        });

    this.scenarioEntries.forEach((entry: HTMLElement): void => {
      entry.addEventListener('click', (event: MouseEvent): void => {
        if (!(event.target instanceof HTMLElement)) return;

        this.emitter.emit('scenario-clicked', event.target.dataset.value);
      });
    });
    this.scenarioCollapse.addEventListener('click', (): void => {
      this.emitter.emit('toggle-collapse', 'scenario');
    });

    this.emitter.emit('scenario-component-loaded', scenarios);
  }

  public draw(scenario: string): void {
    document.querySelectorAll('.scenario-entry')
        .forEach((entry: HTMLElement): void => {
          entry.classList.remove('selected');
          const icon = entry.querySelector('.control-entry-icon');
          icon.textContent = 'radio_button_unchecked';
        });

    document.getElementById(`scenario-${scenario}`).classList.add('selected');
    const selected = document.querySelector('.scenario-entry.selected');
    const icon = selected.querySelector('.control-entry-icon');
    icon.textContent = 'radio_button_checked';
  }
}
