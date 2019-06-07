import mapboxgl from 'mapbox-gl';
import View from '../../superclasses/View';

// eslint-disable-next-line
export default class MapView extends View {
  /**
   * @param {HTMLElement} container
   */
  constructor(container) {
    super(container);

    this.layers = ['2065BAP', '2065CityII'];
    this.overlays = ['city', 'nc'];

    this.datasetEntries = document.querySelectorAll('.dataset-entry');
    this.datasetEntries.forEach((entry) => {
      entry.addEventListener('click', (event) => {
        this.container.dispatchEvent(new CustomEvent('datasetClicked', {
          detail: event.target.dataset.value,
        }));
      });
    });

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

    this.timeEntries = document.querySelectorAll('.time-entry');
    this.timeEntries.forEach((entry) => {
      entry.addEventListener('click', (event) => {
        this.container.dispatchEvent(new CustomEvent('timeClicked', {
          detail: {value: event.target.dataset.value},
        }));
      });
    });

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

    mapboxgl.accessToken = 'pk.eyJ1IjoidGhvbWFzbG9yaW5jeiIsImEiOiJjamx5aXVwaH' +
        'AxamZzM3dsaWdkZ3Q2eGJyIn0.mXjlp9c3l2-NBoS1uaEUdw';

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/thomaslorincz/cjwjclmjn22nj1cqohlh03qrf',
      center: [-113.323975, 53.631611],
      zoom: 8,
      attributionControl: false,
    }).addControl(new mapboxgl.AttributionControl({
      customAttribution: '<a href="https://github.com/thomaslorincz" target="_blank">Developed by Thomas Lorincz<a/>',
    }));

    this.map.dragRotate.disable();
    this.map.touchZoomRotate.disable();

    this.map.on('load', () => {
      this.map.addLayer({
        'id': '2065BAP',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.0bgp74x8',
        },
        'source-layer': 'output_2065BAP-4us5kj',
        'type': 'circle',
        'paint': {
          'circle-radius': [
            'max', 0.25, ['*', 2, ['/', ['get', 'count'], 500]],
          ],
        },
      });

      this.map.addLayer({
        'id': '2065CityII',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.6erkncy4',
        },
        'source-layer': 'output_2065CityII-cv66ke',
        'type': 'circle',
        'paint': {
          'circle-radius': [
            'max', 0.25, ['*', 2, ['/', ['get', 'count'], 500]],
          ],
        },
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
   * @param {'2065BAP'|'2065CityII'} dataset
   * @param {'all'|Set} purpose
   * @param {''|Set} overlay
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
   * @param {''|Set} overlay
   */
  drawOverlay(overlay) {
    this.overlays.forEach((layerId) => {
      this.map.setLayoutProperty(layerId, 'visibility', 'none');
    });

    document.querySelectorAll('.overlay-entry.selected').forEach((element) => {
      element.classList.remove('selected');
    });
    if (overlay !== '') {
      overlay.forEach((value) => {
        document.getElementById(`overlay-${value}`).classList.add('selected');
        this.map.setLayoutProperty(value, 'visibility', 'visible');
      });
    }
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
}
