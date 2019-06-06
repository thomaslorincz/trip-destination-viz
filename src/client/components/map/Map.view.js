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

    this.allCircleColor = '#FFFFFF';
    this.dataDrivenCircleColors = [
      'match', ['get', 'purp'],
      'O', '#FF0000',
      'W', '#FFA500',
      'S', '#FFFF00',
      'P', '#9ACD32',
      'H', '#008000',
      'T', '#20B2AA',
      'L', '#0000FF',
      'R', '#9932CC',
      'C', '#FF1493',
      'Q', '#8B4513',
      '#000000',
    ];

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
          detail: {
            value: event.target.dataset.value,
            ctrlKey: event.ctrlKey,
          },
        }));
      });
    });

    this.overlayEntries = document.querySelectorAll('.overlay-entry');
    this.overlayEntries.forEach((entry) => {
      entry.addEventListener('click', (event) => {
        this.container.dispatchEvent(new CustomEvent('overlayClicked', {
          detail: {
            value: event.target.dataset.value,
            ctrlKey: event.ctrlKey,
          },
        }));
      });
    });

    this.timeControls = document.querySelectorAll('.time-value');
    this.timeControls.forEach((control) => {
      control.addEventListener('click', (event) => {
        this.container.dispatchEvent(new CustomEvent('timeClicked', {
          detail: {
            time: event.target.dataset.value,
            ctrlKey: event.ctrlKey,
          },
        }));
      });
    });

    mapboxgl.accessToken = 'pk.eyJ1IjoidGhvbWFzbG9yaW5jeiIsImEiOiJjamx5aXVwaH' +
        'AxamZzM3dsaWdkZ3Q2eGJyIn0.mXjlp9c3l2-NBoS1uaEUdw';

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/thomaslorincz/cjwjclmjn22nj1cqohlh03qrf',
      center: [-113.323975, 53.631611],
      zoom: 7,
    });

    this.map.dragRotate.disable();
    this.map.touchZoomRotate.disable();

    this.map.on('load', () => {
      this.map.addLayer({
        'id': '2065BAP',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.cs0686xn',
        },
        'source-layer': 'output_2065BAP-aldvxa',
        'type': 'circle',
        'paint': {
          'circle-radius': 2,
          'circle-opacity': [
            'interpolate', ['linear'], ['zoom'],
            0, 0.1,
            8, 0.2,
            12, 1,
          ],
          'circle-color': this.allCircleColor,
        },
      });

      this.map.addLayer({
        'id': '2065CityII',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.6z4w75x7',
        },
        'source-layer': 'output_2065CityII-al5d0c',
        'type': 'circle',
        'paint': {
          'circle-radius': 2,
          'circle-opacity': [
            'interpolate', ['linear'], ['zoom'],
            0, 0.1,
            8, 0.2,
            12, 1,
          ],
          'circle-color': this.allCircleColor,
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
        'paint': {
          'line-width': 3,
          'line-color': '#FF0000',
        },
      });

      this.map.addLayer({
        'id': 'nc',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.d571qaco',
        },
        'source-layer': 'nc_CityII-axaip8',
        'type': 'line',
        'paint': {
          'line-width': 3,
          'line-color': '#0000FF',
        },
      });

      this.container.dispatchEvent(new CustomEvent('loaded'));
    });
  }

  /**
   * @param {'2065BAP'|'2065CityII'} dataset
   * @param {'all'|Set} purpose
   * @param {''|Set} overlay
   * @param {'all'|Set} time
   */
  draw({dataset, purpose, overlay, time}) {
    this.drawDataset(dataset);
    this.drawPurpose(purpose);
    this.drawOverlay(overlay);
    this.drawTime(time);
    this.drawDots(dataset, purpose, time);
  }

  /**
   * @param {'2065BAP'|'2065CityII'} dataset
   */
  drawDataset(dataset) {
    this.layers.forEach((layerId) => {
      this.map.setLayoutProperty(layerId, 'visibility', 'none');
    });
    this.map.setLayoutProperty(dataset, 'visibility', 'visible');

    const oldChecked = document.querySelector('.dataset-entry.selected');
    if (oldChecked) {
      oldChecked.classList.remove('selected');
      const icon = oldChecked.querySelector('.left-control-icon');
      icon.textContent = 'radio_button_unchecked';
    }

    document.getElementById(`data-${dataset}`).classList.add('selected');
    const newChecked = document.querySelector('.dataset-entry.selected');
    if (newChecked) {
      const icon = newChecked.querySelector('.left-control-icon');
      icon.textContent = 'radio_button_checked';
    }
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
  }

  /**
   * @param {'all'|Set} time
   */
  drawTime(time) {
    document.querySelectorAll('.time-value.selected').forEach((element) => {
      element.classList.remove('selected');
    });
    if (time === 'all') {
      document.getElementById('time-all').classList.add('selected');
    } else {
      time.forEach((value) => {
        document.getElementById(`time-${value}`).classList.add('selected');
      });
    }
  }

  /**
   * @param {'2065BAP'|'2065CityII'} dataset
   * @param {'all'|Set} purpose
   * @param {'all'|Set} time
   */
  drawDots(dataset, purpose, time) {
    if (time === 'all' && purpose === 'all') {
      this.map.getLayer(dataset).setPaintProperty(
          'circle-color',
          this.allCircleColor
      );
      this.map.setFilter(dataset, null);
    } else if (time === 'all' && typeof purpose === 'object') {
      this.map.getLayer(dataset).setPaintProperty(
          'circle-color',
          this.dataDrivenCircleColors
      );
      this.map.setFilter(dataset, ['in', 'purp', ...purpose]);
    } else if (purpose === 'all' && typeof time === 'object') {
      this.map.getLayer(dataset).setPaintProperty(
          'circle-color',
          this.allCircleColor
      );
      const timeNumbers = Array.from(time.values()).map((timeString) => {
        return parseInt(timeString);
      });
      this.map.setFilter(dataset, ['in', 'time', ...timeNumbers]);
    } else {
      this.map.getLayer(dataset).setPaintProperty(
          'circle-color',
          this.dataDrivenCircleColors
      );
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
}
