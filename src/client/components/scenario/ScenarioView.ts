import View from '../../superclasses/View';
import * as EventEmitter from 'eventemitter3';

export default class ScenarioView extends View {
  private readonly scenarioEntries: NodeListOf<HTMLElement>;
  private readonly scenarioCollapse: HTMLElement;

  public constructor(container: HTMLElement, emitter: EventEmitter) {
    super(container, emitter);

    this.scenarioEntries = document.querySelectorAll('.scenario-entry');
    this.scenarioCollapse = document.getElementById('scenario-collapse');

    this.scenarioEntries.forEach((entry: HTMLElement): void => {
      entry.addEventListener('click', (event: MouseEvent): void => {
        if (!(event.target instanceof HTMLElement)) return;

        this.emitter.emit('scenario-clicked', event.target.dataset.value);
      });
    });
    this.scenarioCollapse.addEventListener('click', (): void => {
      this.emitter.emit('toggle-scenario-collapse');
    });
  }

  public draw(scenarios: Map<string, boolean>, collapsed: boolean): void {
    scenarios.forEach((active: boolean, scenario: string): void => {
      const element = document.getElementById(`scenario-${scenario}`);
      const icon = element.querySelector('.control-entry-icon');

      if (active) {
        element.classList.add('active');
        icon.textContent = 'radio_button_checked';
      } else {
        element.classList.remove('active');
        icon.textContent = 'radio_button_unchecked';
      }
    });

    const content = document.getElementById('scenario-content');
    if (collapsed) {
      content.classList.add('collapsed');
      this.scenarioCollapse.textContent = 'expand_more';
    } else {
      content.classList.remove('collapsed');
      this.scenarioCollapse.textContent = 'expand_less';
    }
  }
}
