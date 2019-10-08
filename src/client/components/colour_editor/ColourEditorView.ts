import './colour-editor.css';
import View from '../../superclasses/View';
import * as EventEmitter from 'eventemitter3';

export default class ColourEditorView extends View {
  private readonly mask: HTMLElement;
  public constructor(container: HTMLElement, emitter: EventEmitter) {
    super(container, emitter);

    this.mask = document.getElementById('colour-editor-mask');

    this.mask.addEventListener('click', () => {
      this.emitter.emit('colour-editor-mask-clicked');
      this.mask.classList.remove('active');
    });

    this.container.addEventListener('click', (event: MouseEvent) => {
      event.stopPropagation();
    });
  }

  public draw(type: string, colourMap: Map<string, string>): void {
    // Remove all elements in container
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }

    this.mask.classList.add('active');

    colourMap.forEach((colour: string, entry: string) => {
      const entryDiv = document.createElement('div');
      entryDiv.classList.add('colour-entry');
      entryDiv.addEventListener('click', () => {
        entryDiv.querySelector('input').click();
      });

      const icon = document.createElement('div');
      icon.classList.add('colour-choice-icon');
      if (type === 'purpose') {
        icon.classList.add('circle');
      } else {
        icon.classList.add('square');
      }
      icon.style.backgroundColor = colour;
      entryDiv.appendChild(icon);

      const input = document.createElement('input');
      input.setAttribute('id', `${entry}-colour-input`);
      input.setAttribute('name', `${entry}-colour-input`);
      input.setAttribute('value', colour);
      input.type = 'color';
      input.addEventListener('change', () => {
        icon.style.backgroundColor = input.value;
      });
      entryDiv.appendChild(input);

      const label = document.createElement('label');
      label.innerHTML = document.getElementById(`${type}-${entry}`)
          .querySelector('.control-entry-label').innerHTML;
      label.htmlFor = `${entry}-colour-input`;
      entryDiv.appendChild(label);

      this.container.appendChild(entryDiv);
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.setAttribute('id', 'button-container');

    const cancelButton = document.createElement('div');
    cancelButton.classList.add('colour-editor-button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', () => {
      this.mask.classList.remove('active');
    });
    buttonContainer.appendChild(cancelButton);

    const saveButton = document.createElement('div');
    saveButton.classList.add('colour-editor-button');
    saveButton.textContent = 'Save';
    saveButton.addEventListener('click', () => {
      colourMap.forEach((colour: string, entry: string) => {
        const input = document.getElementById(`${entry}-colour-input`);
        if (!(input instanceof HTMLInputElement)) return;
        colourMap.set(entry, input.value);
      });
      this.mask.classList.remove('active');
      this.emitter.emit('colours-updated', type, colourMap);
    });
    buttonContainer.appendChild(saveButton);

    this.container.appendChild(buttonContainer);
  }
}
