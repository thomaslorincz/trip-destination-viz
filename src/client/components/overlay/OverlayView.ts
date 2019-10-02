import View from '../../superclasses/View';
import * as EventEmitter from 'eventemitter3';

export default class OverlayView extends View {
  private overlayEntries = document.querySelectorAll('.overlay-entry');
  private overlayCollapse = document.getElementById('collapse-overlay');

  public constructor(container: HTMLElement, emitter: EventEmitter) {
    super(container, emitter);

    const overlays = new Map<string, boolean>();
    document.querySelectorAll('.overlay-entry')
        .forEach((entry: HTMLElement): void => {
          overlays.set(entry.dataset.value, entry.classList.contains('active'));
        });

    this.overlayEntries.forEach((entry: HTMLElement): void => {
      entry.addEventListener('click', (event: Event): void => {
        if (event.target instanceof HTMLElement) {
          this.emitter.emit('overlay-clicked', event.target.dataset.value);
        }
      });
    });
    this.overlayCollapse.addEventListener('click', (): void => {
      this.emitter.emit('toggle-collapse', 'overlay');
    });

    this.emitter.emit('overlay-component-loaded', overlays);
  }

  public draw(overlay: Set<string>, colours: Map<string, string>): void {
    document.querySelectorAll('.overlay-entry.selected')
        .forEach((element: HTMLElement): void => {
          element.classList.remove('selected');
        });
    overlay.forEach((value: string): void => {
      document.getElementById(`overlay-${value}`).classList.add('selected');
    });
    this.overlayEntries.forEach((entry: HTMLElement): void => {
      if (entry.classList.contains('selected')) {
        const icon = entry.querySelector('.control-entry-checkbox');
        icon.textContent = 'check_box';
      } else {
        const icon = entry.querySelector('.control-entry-checkbox');
        icon.textContent = 'check_box_outline_blank';
      }
    });

    document.querySelectorAll('.overlay-entry')
        .forEach((entry: HTMLElement): void => {
          const icon = entry.querySelector('.control-entry-icon');
          if (icon instanceof HTMLElement) {
            icon.style.backgroundColor = colours[entry.dataset.value];
          }
        });
  }
}
