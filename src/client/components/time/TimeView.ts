import View from '../../superclasses/View';
import * as EventEmitter from 'eventemitter3';

export default class TimeView extends View {
  private readonly timeEntries: NodeListOf<HTMLElement>;
  private readonly timeCollapse: HTMLElement;

  public constructor(container: HTMLElement, emitter: EventEmitter) {
    super(container, emitter);

    this.timeEntries = document.querySelectorAll('.time-entry');
    this.timeCollapse = document.getElementById('time-collapse');

    this.timeEntries.forEach((entry: HTMLElement): void => {
      entry.addEventListener('click', (event: Event): void => {
        if (!(event.target instanceof HTMLElement)) return;

        this.emitter.emit('time-clicked', event.target.dataset.value);
      });
    });

    this.timeCollapse.addEventListener('click', (): void => {
      this.emitter.emit('toggle-time-collapse');
    });
  }

  public draw(times: Map<string, boolean>, collapsed: boolean): void {
    times.forEach((active: boolean, time: string): void => {
      const element = document.getElementById(`time-${time}`);
      const checkbox = element.querySelector('.control-entry-checkbox');

      if (active) {
        element.classList.add('active');
        checkbox.textContent = 'check_box';
      } else {
        element.classList.remove('active');
        checkbox.textContent = 'check_box_outline_blank';
      }
    });

    const content = document.getElementById('time-content');
    if (collapsed) {
      content.classList.add('collapsed');
      this.timeCollapse.textContent = 'expand_more';
    } else {
      content.classList.remove('collapsed');
      this.timeCollapse.textContent = 'expand_less';
    }
  }
}
