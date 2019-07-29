import * as mapboxgl from 'mapbox-gl';
import View from '../../superclasses/View';
import * as EventEmitter from 'eventemitter3';

export default class MapView extends View {
  private layers: string[] = [];
  private overlays: string[] = [];
  private map: mapboxgl.Map;
  private datasetEntries = document.querySelectorAll('.dataset-entry');
  private datasetCollapse = document.getElementById('collapse-dataset');
  private purposeEntries = document.querySelectorAll('.purpose-entry');
  private colourChoices = document.getElementById('colour-choices');
  private purposeCollapse = document.getElementById('collapse-purpose');
  private overlayEntries = document.querySelectorAll('.overlay-entry');
  private helpIcon = document.getElementById('help-icon');
  private timeEntries = document.querySelectorAll('.time-entry');
  private hideButton = document.getElementById('hide-controls-button');
  private overlayCollapse = document.getElementById('collapse-overlay');
  private help = document.getElementById('help');
  private timeCollapse = document.getElementById('collapse-time');
  private closeHelp = document.getElementById('close-help');
  private colourChoicesCover = document.getElementById('colour-choices-cover');

  public constructor(container: HTMLElement, emitter: EventEmitter) {
    super(container, emitter);

    document.querySelectorAll('.dataset-entry')
        .forEach((entry: HTMLElement): void => {
          this.layers.push(entry.dataset.value);
        });
    document.querySelectorAll('.overlay-entry')
        .forEach((entry: HTMLElement): void => {
          this.overlays.push(entry.dataset.value);
        });

    this.initializeDatasetControl();
    this.initializePurposeControl();
    this.initializeOverlayControl();
    this.initializeTimeControl();
    this.initializeHide();
    this.initializeColourChooser();
    this.initializeHelp();

    mapboxgl.accessToken = 'pk.eyJ1IjoidGhvbWFzbG9yaW5jeiIsImEiOiJjamx5aXVwaH' +
        'AxamZzM3dsaWdkZ3Q2eGJyIn0.mXjlp9c3l2-NBoS1uaEUdw';

    const href = 'href="https://github.com/thomaslorincz"';
    const rel = 'rel="noopener"';
    const target = 'target="_blank"';
    const credit = 'Developed by Thomas Lorincz';
    const attribution = `<a ${href} ${rel} ${target}>${credit}<a/>`;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/thomaslorincz/cjx0png073khh1cpap7m6449e',
      bounds: [[-115.11466, 53.04465], [-112.16116, 54.06214]],
      attributionControl: false,
      dragRotate: false,
      pitchWithRotate: false,
    }).addControl(new mapboxgl.AttributionControl({
      customAttribution: attribution,
    }));

    this.map.on('load', (): void => {
      this.map.addLayer({
        'id': '2065BAP',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.b38h0wik',
        },
        'source-layer': 'output_2065BAP_300-2jb2ha',
        'type': 'circle',
        'paint': {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            9, [
              'max', 0.1, ['/', ['to-number', ['get', 'count']], 300],
            ],
            12, [
              'max', 1, ['*', 2, ['/', ['to-number', ['get', 'count']], 300]],
            ],
          ],
        },
      });

      this.map.addLayer({
        'id': '2065CityII',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.4qfirexj',
        },
        'source-layer': 'output_2065CityII_300-7gjcgt',
        'type': 'circle',
        'paint': {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            9, [
              'max', 0.1, ['/', ['to-number', ['get', 'count']], 300],
            ],
            12, [
              'max', 1, ['*', 2, ['/', ['to-number', ['get', 'count']], 300]],
            ],
          ],
        },
      });

      this.map.addLayer({
        'id': 'cma',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.1kz18y39',
        },
        'source-layer': 'cma_boundary-5vtklc',
        'type': 'line',
        'paint': {'line-width': 2},
      });

      this.map.addLayer({
        'id': 'city',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.48okpw5t',
        },
        'source-layer': 'city_boundary-d6ewoz',
        'type': 'line',
        'paint': {'line-width': 2},
      });

      this.map.addLayer({
        'id': 'nc',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.d571qaco',
        },
        'source-layer': 'nc_CityII-axaip8',
        'type': 'line',
        'paint': {'line-width': 2},
      });

      this.map.addLayer({
        'id': 'lrt',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.75obfmea',
        },
        'source-layer': 'lrt_2065-0kp6p1',
        'type': 'line',
        'paint': {'line-width': 2},
      });

      this.emitter.emit('loaded');
    });
  }

  /** Initializes the radio button control for selecting a dataset. */
  private initializeDatasetControl(): void {
    this.datasetEntries.forEach((entry: Element): void => {
      entry.addEventListener('click', (event: Event): void => {
        if (event.target instanceof HTMLElement) {
          this.emitter.emit('datasetClicked', event.target.dataset.value);
        }
      });
    });
    this.datasetCollapse.addEventListener('click', (): void => {
      this.emitter.emit('toggleCollapse', 'dataset');
    });
  }

  /** Initializes the checkbox purpose control for filtering by purpose. */
  private initializePurposeControl(): void {
    this.purposeEntries.forEach((entry: HTMLElement): void => {
      entry.addEventListener('click', (event: Event): void => {
        if (event.target instanceof HTMLElement) {
          this.emitter.emit('purposeClicked', event.target.dataset.value);
        }
      });
      entry.addEventListener('contextmenu', (event: Event): void => {
        event.preventDefault();
        this.colourChoices.classList.remove('square-choices');
        this.colourChoices.classList.add('circle-choices');
        this.colourChoices.setAttribute('category', 'purpose');
        this.drawColourChoices(event, entry);
      });
    });
    this.purposeCollapse.addEventListener('click', (): void => {
      this.emitter.emit('toggleCollapse', 'purpose');
    });
  }

  /** Initializes the checkbox overlay control for adding/removing overlays. */
  private initializeOverlayControl(): void {
    this.overlayEntries.forEach((entry: HTMLElement): void => {
      entry.addEventListener('click', (event: Event): void => {
        if (event.target instanceof HTMLElement) {
          this.emitter.emit('overlayClicked', event.target.dataset.value);
        }
      });
      entry.addEventListener('contextmenu', (event: Event): void => {
        event.preventDefault();
        this.colourChoices.classList.remove('circle-choices');
        this.colourChoices.classList.add('square-choices');
        this.colourChoices.setAttribute('category', 'overlay');
        this.drawColourChoices(event, entry);
      });
    });
    this.overlayCollapse.addEventListener('click', (): void => {
      this.emitter.emit('toggleCollapse', 'overlay');
    });
  }

  /** Initializes the checkbox time control for filtering by time. */
  private initializeTimeControl(): void {
    this.timeEntries.forEach((entry: HTMLElement): void => {
      entry.addEventListener('click', (event: Event): void => {
        if (event.target instanceof HTMLElement) {
          this.emitter.emit('timeClicked', event.target.dataset.value);
        }
      });
    });
    this.timeCollapse.addEventListener('click', (): void => {
      this.emitter.emit('toggleCollapse', 'time');
    });
  }

  /** Initializes the hide/show chevron button used to minimize the controls. */
  private initializeHide(): void {
    this.hideButton.addEventListener('click', (): void => {
      this.emitter.emit('hideClicked');
    });
  }

  /**
   * Initializes the colour chooser which is used to change control colours.
   */
  private initializeColourChooser(): void {
    const circles = this.colourChoices.querySelectorAll('.colour-choice-icon');
    circles.forEach((circle: HTMLElement): void => {
      circle.addEventListener('click', (): void => {
        this.hideColourChoices();
        this.emitter.emit('colourClicked', {
          category: this.colourChoices.dataset.category,
          key: this.colourChoices.dataset.value,
          value: getComputedStyle(circle).backgroundColor,
        });
      });
      this.colourChoices.appendChild(circle);
    });
    this.colourChoicesCover.addEventListener('click', (): void => {
      this.hideColourChoices();
    });
  }

  /**
   * Initializes the help icon and help dialogue for displaying project
   * information and controls.
   */
  private initializeHelp(): void {
    this.helpIcon.addEventListener('click', (): void => {
      this.emitter.emit('helpClicked');
    });
    this.help.addEventListener('click', (event: Event): void => {
      if (event.target === document.getElementById('help')) {
        this.emitter.emit('helpClicked');
      }
    });
    this.closeHelp.addEventListener('click', (): void => {
      this.emitter.emit('helpClicked');
    });
  }

  public draw(dataset: string, purpose: Set<string>, overlay: Set<string>,
      time: Set<string>, hidden: boolean, colours: object): void {
    this.applyColours(purpose, colours);
    this.drawDataset(dataset);
    this.drawPurpose(purpose);
    this.drawOverlay(overlay);
    this.drawTime(time);
    this.drawDots(dataset, purpose, time);
    this.drawVisibility(hidden);
  }

  public applyColours(purpose: Set<string>, colours: object): void {
    document.querySelectorAll('.purpose-entry')
        .forEach((entry: HTMLElement): void => {
          const icon = entry.querySelector('.left-control-icon');
          if (icon instanceof HTMLElement) {
            icon.style.backgroundColor
                = colours['purpose'][entry.dataset.value];
          }
        });

    this.layers.forEach((id: string): void => {
      if (purpose.has('all')) {
        this.map.setPaintProperty(
            id, 'circle-color', colours['purpose']['all']
        );
      } else {
        this.map.setPaintProperty(
            id, 'circle-color', colours['purpose']['dataDriven']
        );
      }
    });

    this.overlays.forEach((id: string): void => {
      this.map.setPaintProperty(id, 'line-color', colours['overlay'][id]);
    });

    document.querySelectorAll('.overlay-entry')
        .forEach((entry: HTMLElement): void => {
          const icon = entry.querySelector('.left-control-icon');
          if (icon instanceof HTMLElement) {
            icon.style.backgroundColor
                = colours['overlay'][entry.dataset.value];
          }
        });
  }

  public drawDataset(dataset: string): void {
    this.layers.forEach((layerId: string): void => {
      this.map.setLayoutProperty(layerId, 'visibility', 'none');
    });
    this.map.setLayoutProperty(dataset, 'visibility', 'visible');

    document.querySelectorAll('.dataset-entry')
        .forEach((entry: HTMLElement): void => {
          entry.classList.remove('selected');
          const icon = entry.querySelector('.left-control-icon');
          icon.textContent = 'radio_button_unchecked';
        });

    document.getElementById(`data-${dataset}`).classList.add('selected');
    const selected = document.querySelector('.dataset-entry.selected');
    const icon = selected.querySelector('.left-control-icon');
    icon.textContent = 'radio_button_checked';
  }

  public drawPurpose(purpose: Set<string>): void {
    document.querySelectorAll('.purpose-entry.selected')
        .forEach((element: HTMLElement): void => {
          element.classList.remove('selected');
        });
    if (purpose.has('all')) {
      document.getElementById('purpose-all').classList.add('selected');
    } else {
      purpose.forEach((value): void => {
        document.getElementById(`purpose-${value}`).classList.add('selected');
      });
    }
    document.querySelectorAll('.purpose-entry')
        .forEach((entry: HTMLElement): void => {
          if (entry.classList.contains('selected')) {
            const icon = entry.querySelector('.left-control-checkbox');
            icon.textContent = 'check_box';
          } else {
            const icon = entry.querySelector('.left-control-checkbox');
            icon.textContent = 'check_box_outline_blank';
          }
        });
  }

  public drawOverlay(overlay: Set<string>): void {
    this.overlays.forEach((layerId: string): void => {
      this.map.setLayoutProperty(layerId, 'visibility', 'none');
    });

    document.querySelectorAll('.overlay-entry.selected')
        .forEach((element: HTMLElement): void => {
          element.classList.remove('selected');
        });
    overlay.forEach((value: string): void => {
      document.getElementById(`overlay-${value}`).classList.add('selected');
      this.map.setLayoutProperty(value, 'visibility', 'visible');
    });
    this.overlayEntries.forEach((entry: HTMLElement): void => {
      if (entry.classList.contains('selected')) {
        const icon = entry.querySelector('.left-control-checkbox');
        icon.textContent = 'check_box';
      } else {
        const icon = entry.querySelector('.left-control-checkbox');
        icon.textContent = 'check_box_outline_blank';
      }
    });
  }

  public drawTime(time: Set<string>): void {
    document.querySelectorAll('.time-entry.selected')
        .forEach((element: Element): void => {
          element.classList.remove('selected');
        });

    if (time.has('all')) {
      document.getElementById('time-all').classList.add('selected');
    } else {
      time.forEach((value: string): void => {
        document.getElementById(`time-${value}`).classList.add('selected');
      });
    }

    this.timeEntries.forEach((entry): void => {
      if (entry.classList.contains('selected')) {
        const icon = entry.querySelector('.left-control-checkbox');
        icon.textContent = 'check_box';
      } else {
        const icon = entry.querySelector('.left-control-checkbox');
        icon.textContent = 'check_box_outline_blank';
      }
    });
  }

  public drawDots(dataset: string, purpose: Set<string>,
      time: Set<string>): void {
    if (time.has('all') && purpose.has('all')) {
      this.map.setFilter(dataset, null);
    } else if (time.has('all')) {
      this.map.setFilter(
          dataset,
          ['in', 'purp', ...Array.from(purpose.values())]
      );
    } else if (purpose.has('all')) {
      const timeNumbers = Array.from(time.values())
          .map((timeString: string): number => parseInt(timeString));
      this.map.setFilter(dataset, ['in', 'time', ...timeNumbers]);
    } else {
      const timeNumbers = Array.from(time.values())
          .map((timeString: string): number => parseInt(timeString));
      this.map.setFilter(dataset, [
        'all',
        ['in', 'time', ...timeNumbers],
        ['in', 'purp', ...Array.from(purpose.values())],
      ]);
    }
  }

  public drawColourChoices(event: Event, entry: HTMLElement): void {
    this.colourChoices.classList.add('visible');
    if (event.target instanceof HTMLElement) {
      this.colourChoices.dataset.value = event.target.dataset.value;
    }
    const rect = entry.getBoundingClientRect();
    this.colourChoices.style.top = `${rect.top}px`;
    this.colourChoices.style.left = `${rect.right}px`;
    this.colourChoicesCover.style.display = 'block';
  }

  public hideColourChoices(): void {
    this.colourChoices.classList.remove('visible');
    this.colourChoicesCover.style.display = 'none';
  }

  public static drawHelp(open: boolean): void {
    document.getElementById('help').style.display = (open) ? 'flex' : 'none';
  }

  public drawCollapsed(collapsedMap: object): void {
    Object.keys(collapsedMap).forEach((control: string): void => {
      const content = document.getElementById(`${control}-content`);
      const icon = document.getElementById(`collapse-${control}`);
      if (collapsedMap[control]) {
        content.classList.add('collapsed');
        icon.textContent = 'expand_more';
      } else {
        content.classList.remove('collapsed');
        icon.textContent = 'expand_less';
      }
    });
  }

  public drawVisibility(hidden: boolean): void {
    const leftControls = document.getElementById('left-controls-container');
    if (hidden) {
      this.hideButton.innerHTML
          = '<i class="material-icons-round">chevron_right</i>';
      leftControls.classList.add('hidden');
    } else {
      this.hideButton.innerHTML
          = '<i class="material-icons-round">chevron_left</i>';
      leftControls.classList.remove('hidden');
    }
  }
}
