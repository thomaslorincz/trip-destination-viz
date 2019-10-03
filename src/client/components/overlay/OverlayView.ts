import View from '../../superclasses/View';
import * as EventEmitter from 'eventemitter3';

export default class OverlayView extends View {
  private readonly overlayEntries: NodeListOf<HTMLElement>;
  private readonly overlayCollapse: HTMLElement;

  public constructor(container: HTMLElement, emitter: EventEmitter) {
    super(container, emitter);

    this.overlayEntries = document.querySelectorAll('.overlay-entry');
    this.overlayCollapse = document.getElementById('overlay-collapse');

    // Add click events for each overlay entry
    this.overlayEntries.forEach((entry: HTMLElement): void => {
      entry.addEventListener('click', (event: MouseEvent): void => {
        if (!(event.target instanceof HTMLElement)) return;

        this.emitter.emit('overlay-clicked', event.target.dataset.value);
      });
    });

    // Add click event for overlay collapse button
    this.overlayCollapse.addEventListener('click', (): void => {
      this.emitter.emit('toggle-overlay-collapse');
    });
  }

  public draw(overlays: Map<string, boolean>, colours: Map<string, string>,
      collapsed: boolean): void {
    overlays.forEach((active: boolean, overlay: string): void => {
      const element = document.getElementById(`overlay-${overlay}`);
      const icon = element.querySelector('.control-entry-icon');
      const checkbox = element.querySelector('.control-entry-checkbox');

      if (!(icon instanceof HTMLElement)) return;
      icon.style.backgroundColor = colours[overlay];

      if (active) {
        element.classList.add('active');
        checkbox.textContent = 'check_box';
      } else {
        element.classList.remove('active');
        checkbox.textContent = 'check_box_outline_blank';
      }
    });

    const content = document.getElementById('overlay-content');
    if (collapsed) {
      content.classList.add('collapsed');
      this.overlayCollapse.textContent = 'expand_more';
    } else {
      content.classList.remove('collapsed');
      this.overlayCollapse.textContent = 'expand_less';
    }
  }
}
