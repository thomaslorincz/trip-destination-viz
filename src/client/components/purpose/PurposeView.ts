import View from '../../superclasses/View';
import * as EventEmitter from 'eventemitter3';

export default class PurposeView extends View {
  private readonly purposeEntries: NodeListOf<HTMLElement>;
  private readonly purposeCollapse: HTMLElement;

  public constructor(container: HTMLElement, emitter: EventEmitter) {
    super(container, emitter);

    this.purposeEntries = document.querySelectorAll('.purpose-entry');
    this.purposeCollapse = document.getElementById('purpose-collapse');

    this.purposeEntries.forEach((entry: HTMLElement): void => {
      entry.addEventListener('click', (event: Event): void => {
        if (!(event.target instanceof HTMLElement)) return;

        this.emitter.emit('purpose-clicked', event.target.dataset.value);
      });
    });
    this.purposeCollapse.addEventListener('click', (): void => {
      this.emitter.emit('toggle-purpose-collapse');
    });

    document.getElementById('purpose-edit-colours')
        .addEventListener('click', () => {
          this.emitter.emit('purpose-edit-colours-clicked');
        });
  }

  public draw(purposes: Map<string, boolean>, colours: Map<string, string>,
      collapsed: boolean): void {
    purposes.forEach((active: boolean, purpose: string): void => {
      const element = document.getElementById(`purpose-${purpose}`);
      const checkbox = element.querySelector('.control-entry-checkbox');
      const icon = element.querySelector('.control-entry-icon');

      if (!(icon instanceof HTMLElement)) return;
      icon.style.backgroundColor = colours.get(purpose);

      if (active) {
        element.classList.add('active');
        checkbox.textContent = 'check_box';
      } else {
        element.classList.remove('active');
        checkbox.textContent = 'check_box_outline_blank';
      }
    });

    const content = document.getElementById('purpose-content');
    if (collapsed) {
      content.classList.add('collapsed');
      this.purposeCollapse.textContent = 'expand_more';
    } else {
      content.classList.remove('collapsed');
      this.purposeCollapse.textContent = 'expand_less';
    }
  }
}
