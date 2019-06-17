import mapboxgl from 'mapbox-gl';
import View from '../../superclasses/View';

// eslint-disable-next-line
export default class MapView extends View {
  /**
   * @param {HTMLElement} container
   */
  constructor(container) {
    super(container);

    this.layers = [];
    document.querySelectorAll('.dataset-entry').forEach((entry) => {
      this.layers.push(entry.dataset.value);
    });
    this.overlays = [];
    document.querySelectorAll('.overlay-entry').forEach((entry) => {
      this.overlays.push(entry.dataset.value);
    });

    this.initializeDatasetControl();
    this.initializePurposeControl();
    this.initializeOverlayControl();
    this.initializeTimeControl();
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

    this.map.on('load', () => {
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
            'max', 0.1, ['/', ['to-number', ['get', 'count']], 300],
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
            'max', 0.1, ['/', ['to-number', ['get', 'count']], 300],
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

      this.container.dispatchEvent(new CustomEvent('loaded'));
    });
  }

  /**
   * Initializes the radio button control for selecting a dataset.
   */
  initializeDatasetControl() {
    this.datasetEntries = document.querySelectorAll('.dataset-entry');
    this.datasetEntries.forEach((entry) => {
      entry.addEventListener('click', (event) => {
        this.container.dispatchEvent(new CustomEvent('datasetClicked', {
          detail: event.target.dataset.value,
        }));
      });
    });
    this.datasetCollapse = document.getElementById('collapse-dataset');
    this.datasetCollapse.addEventListener('click', () => {
      this.container.dispatchEvent(new CustomEvent('toggleCollapse', {
        detail: 'dataset',
      }));
    });
  }

  /**
   * Initializes the checkbox purpose control for filtering by purpose.
   */
  initializePurposeControl() {
    this.purposeEntries = document.querySelectorAll('.purpose-entry');
    this.purposeEntries.forEach((entry) => {
      entry.addEventListener('click', (event) => {
        this.container.dispatchEvent(new CustomEvent('purposeClicked', {
          detail: {value: event.target.dataset.value},
        }));
      });
      entry.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        this.colourChoices.classList.remove('square-choices');
        this.colourChoices.classList.add('circle-choices');
        this.colourChoices.dataset.category = 'purpose';
        this.drawColourChoices(event, entry);
      });
    });
    this.purposeCollapse = document.getElementById('collapse-purpose');
    this.purposeCollapse.addEventListener('click', () => {
      this.container.dispatchEvent(new CustomEvent('toggleCollapse', {
        detail: 'purpose',
      }));
    });
  }

  /**
   * Initializes the checkbox overlay control for adding/removing overlays.
   */
  initializeOverlayControl() {
    this.overlayEntries = document.querySelectorAll('.overlay-entry');
    this.overlayEntries.forEach((entry) => {
      entry.addEventListener('click', (event) => {
        this.container.dispatchEvent(new CustomEvent('overlayClicked', {
          detail: {value: event.target.dataset.value},
        }));
      });
      entry.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        this.colourChoices.classList.remove('circle-choices');
        this.colourChoices.classList.add('square-choices');
        this.colourChoices.dataset.category = 'overlay';
        this.drawColourChoices(event, entry);
      });
    });
    this.overlayCollapse = document.getElementById('collapse-overlay');
    this.overlayCollapse.addEventListener('click', () => {
      this.container.dispatchEvent(new CustomEvent('toggleCollapse', {
        detail: 'overlay',
      }));
    });
  }

  /**
   * Initializes the checkbox time control for filtering by time.
   */
  initializeTimeControl() {
    this.timeEntries = document.querySelectorAll('.time-entry');
    this.timeEntries.forEach((entry) => {
      entry.addEventListener('click', (event) => {
        this.container.dispatchEvent(new CustomEvent('timeClicked', {
          detail: {value: event.target.dataset.value},
        }));
      });
    });
    this.timeCollapse = document.getElementById('collapse-time');
    this.timeCollapse.addEventListener('click', () => {
      this.container.dispatchEvent(new CustomEvent('toggleCollapse', {
        detail: 'time',
      }));
    });
  }

  /**
   * Initializes the colour chooser which is used to change control colours.
   */
  initializeColourChooser() {
    this.colourChoices = document.getElementById('colour-choices');
    const circles = this.colourChoices.querySelectorAll('.colour-choice-icon');
    circles.forEach((circle) => {
      circle.addEventListener('click', () => {
        this.hideColourChoices();
        this.container.dispatchEvent(new CustomEvent('colourClicked', {
          detail: {
            category: this.colourChoices.dataset.category,
            key: this.colourChoices.dataset.value,
            value: getComputedStyle(circle).backgroundColor,
          },
        }));
      });
      this.colourChoices.appendChild(circle);
    });

    this.outsideClickListener = null;
  }

  /**
   * Initializes the help icon and help dialogue for displaying project
   * information and controls.
   */
  initializeHelp() {
    this.helpIcon = document.getElementById('help-icon');
    this.helpIcon.addEventListener('click', () => {
      this.container.dispatchEvent(new CustomEvent('helpClicked'));
    });
    this.help = document.getElementById('help');
    this.help.addEventListener('click', (event) => {
      if (event.target === document.getElementById('help')) {
        this.container.dispatchEvent(new CustomEvent('helpClicked'));
      }
    });
    this.closeHelp = document.getElementById('close-help');
    this.closeHelp.addEventListener('click', () => {
      this.container.dispatchEvent(new CustomEvent('helpClicked'));
    });
  }

  /**
   * @param {'2065BAP'|'2065CityII'} dataset
   * @param {'all'|Set} purpose
   * @param {Set} overlay
   * @param {'all'|Set} time
   * @param {{}} colours
   */
  draw({dataset, purpose, overlay, time, colours}) {
    this.applyColours(purpose, colours);
    this.drawDataset(dataset);
    this.drawPurpose(purpose);
    this.drawOverlay(overlay);
    this.drawTime(time);
    this.drawDots(dataset, purpose, time);
  }

  /**
   * @param {string} purpose
   * @param {{}} colours
   */
  applyColours(purpose, colours) {
    document.querySelectorAll('.purpose-entry').forEach((entry) => {
      const icon = entry.querySelector('.left-control-icon');
      icon.style.backgroundColor = colours['purpose'][entry.dataset.value];
    });

    this.layers.forEach((id) => {
      if (purpose === 'all') {
        this.map.setPaintProperty(
            id, 'circle-color', colours['purpose']['all']
        );
      } else {
        this.map.setPaintProperty(
            id, 'circle-color', colours['purpose']['dataDriven']
        );
      }
    });

    this.overlays.forEach((id) => {
      this.map.setPaintProperty(id, 'line-color', colours['overlay'][id]);
    });

    document.querySelectorAll('.overlay-entry').forEach((entry) => {
      const icon = entry.querySelector('.left-control-icon');
      icon.style.backgroundColor = colours['overlay'][entry.dataset.value];
    });
  }

  /**
   * @param {'2065BAP'|'2065CityII'} dataset
   */
  drawDataset(dataset) {
    this.layers.forEach((layerId) => {
      this.map.setLayoutProperty(layerId, 'visibility', 'none');
    });
    this.map.setLayoutProperty(dataset, 'visibility', 'visible');

    document.querySelectorAll('.dataset-entry').forEach((entry) => {
      entry.classList.remove('selected');
      const icon = entry.querySelector('.left-control-icon');
      icon.textContent = 'radio_button_unchecked';
    });

    document.getElementById(`data-${dataset}`).classList.add('selected');
    const selected = document.querySelector('.dataset-entry.selected');
    const icon = selected.querySelector('.left-control-icon');
    icon.textContent = 'radio_button_checked';
  }

  /**
   * @param {'all'|Set} purpose
   */
  drawPurpose(purpose) {
    document.querySelectorAll('.purpose-entry.selected').forEach((element) => {
      element.classList.remove('selected');
    });
    if (purpose === 'all') {
      document.getElementById('purpose-all').classList.add('selected');
    } else {
      purpose.forEach((value) => {
        document.getElementById(`purpose-${value}`).classList.add('selected');
      });
    }
    document.querySelectorAll('.purpose-entry').forEach((entry) => {
      if (entry.classList.contains('selected')) {
        const icon = entry.querySelector('.left-control-checkbox');
        icon.textContent = 'check_box';
      } else {
        const icon = entry.querySelector('.left-control-checkbox');
        icon.textContent = 'check_box_outline_blank';
      }
    });
  }

  /**
   * @param {Set} overlay
   */
  drawOverlay(overlay) {
    this.overlays.forEach((layerId) => {
      this.map.setLayoutProperty(layerId, 'visibility', 'none');
    });

    document.querySelectorAll('.overlay-entry.selected').forEach((element) => {
      element.classList.remove('selected');
    });
    overlay.forEach((value) => {
      document.getElementById(`overlay-${value}`).classList.add('selected');
      this.map.setLayoutProperty(value, 'visibility', 'visible');
    });
    document.querySelectorAll('.overlay-entry').forEach((entry) => {
      if (entry.classList.contains('selected')) {
        const icon = entry.querySelector('.left-control-checkbox');
        icon.textContent = 'check_box';
      } else {
        const icon = entry.querySelector('.left-control-checkbox');
        icon.textContent = 'check_box_outline_blank';
      }
    });
  }

  /**
   * @param {'all'|Set} time
   */
  drawTime(time) {
    document.querySelectorAll('.time-entry.selected').forEach((element) => {
      element.classList.remove('selected');
    });
    if (time === 'all') {
      document.getElementById('time-all').classList.add('selected');
    } else {
      time.forEach((value) => {
        document.getElementById(`time-${value}`).classList.add('selected');
      });
    }
    document.querySelectorAll('.time-entry').forEach((entry) => {
      if (entry.classList.contains('selected')) {
        const icon = entry.querySelector('.left-control-checkbox');
        icon.textContent = 'check_box';
      } else {
        const icon = entry.querySelector('.left-control-checkbox');
        icon.textContent = 'check_box_outline_blank';
      }
    });
  }

  /**
   * @param {'2065BAP'|'2065CityII'} dataset
   * @param {'all'|Set} purpose
   * @param {'all'|Set} time
   */
  drawDots(dataset, purpose, time) {
    if (time === 'all' && purpose === 'all') {
      this.map.setFilter(dataset, null);
    } else if (time === 'all' && typeof purpose === 'object') {
      this.map.setFilter(dataset, ['in', 'purp', ...purpose]);
    } else if (purpose === 'all' && typeof time === 'object') {
      const timeNumbers = Array.from(time.values()).map((timeString) => {
        return parseInt(timeString);
      });
      this.map.setFilter(dataset, ['in', 'time', ...timeNumbers]);
    } else {
      const timeNumbers = Array.from(time.values()).map((timeString) => {
        return parseInt(timeString);
      });
      this.map.setFilter(dataset, [
        'all',
        ['in', 'time', ...timeNumbers],
        ['in', 'purp', ...purpose],
      ]);
    }
  }

  /**
   * @param {Event} event
   * @param {HTMLElement} entry
   */
  drawColourChoices(event, entry) {
    this.colourChoices.classList.add('visible');
    this.colourChoices.dataset.value = event.target.dataset.value;
    const rect = entry.getBoundingClientRect();
    this.colourChoices.style.top = `${rect.top}px`;
    this.colourChoices.style.left = `${rect.right}px`;

    document.removeEventListener('click', this.outsideClickListener);
    this.outsideClickListener = (event) => {
      if (!this.colourChoices.contains(event.target)) {
        this.hideColourChoices();
      }
    };
    document.addEventListener('click', this.outsideClickListener);
  }

  /**
   * Hides the colour choices popup
   */
  hideColourChoices() {
    this.colourChoices.classList.remove('visible');
    document.removeEventListener('click', this.outsideClickListener);
  }

  /**
   * @param {boolean} open
   */
  drawHelp(open) {
    const help = document.getElementById('help');
    if (open) {
      help.style.display = 'flex';
    } else {
      help.style.display = 'none';
    }
  }

  /**
   * @param {object} collapsedMap
   */
  drawCollapsed(collapsedMap) {
    Object.keys(collapsedMap).forEach((control) => {
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
}
