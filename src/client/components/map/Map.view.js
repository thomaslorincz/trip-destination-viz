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

    this.legendEntries = document.querySelectorAll('.legend-entry');
    this.legendEntries.forEach((entry) => {
      entry.addEventListener('click', (event) => {
        this.container.dispatchEvent(new CustomEvent('legendClicked', {
          detail: {
            purpose: event.target.dataset.value,
            ctrlKey: event.ctrlKey,
          },
        }));
      });
    });

    this.datasetControls = document.querySelectorAll('.dataset-value');
    this.datasetControls.forEach((control) => {
      control.addEventListener('click', (event) => {
        this.container.dispatchEvent(new CustomEvent('datasetClicked', {
          detail: event.target.dataset.value,
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

      this.container.dispatchEvent(new CustomEvent('loaded'));
    });
  }

  /**
   * @param {'2065BAP'|'2065CityII'} dataset
   * @param {'all'|string[]} time
   * @param {'all'|string[]} purpose
   */
  draw({dataset, time, purpose}) {
    this.layers.forEach((layerId) => {
      this.map.setLayoutProperty(layerId, 'visibility', 'none');
    });

    this.map.setLayoutProperty(dataset, 'visibility', 'visible');

    // Clear all selected styling
    document.querySelectorAll('.control-value.selected').forEach((element) => {
      element.classList.remove('selected');
    });
    document.querySelectorAll('.legend-entry.selected').forEach((element) => {
      element.classList.remove('selected');
    });

    document.getElementById(`data-${dataset}`).classList.add('selected');

    if (time === 'all' && purpose === 'all') {
      document.getElementById('time-all').classList.add('selected');
      document.getElementById('purpose-all').classList.add('selected');
      this.map.getLayer(dataset).setPaintProperty(
          'circle-color',
          this.allCircleColor
      );
      this.map.setFilter(dataset, null);
    } else if (time === 'all' && typeof purpose === 'object') {
      document.getElementById('time-all').classList.add('selected');
      purpose.forEach((value) => {
        document.getElementById(`purpose-${value}`).classList.add('selected');
        this.map.setFilter(dataset, ['in', 'purp', ...purpose]);
      });
      this.map.getLayer(dataset).setPaintProperty(
          'circle-color',
          this.dataDrivenCircleColors
      );
    } else if (purpose === 'all' && typeof time === 'object') {
      document.getElementById('purpose-all').classList.add('selected');
      this.map.getLayer(dataset).setPaintProperty(
          'circle-color',
          this.allCircleColor
      );
      time.forEach((value) => {
        document.getElementById(`time-${value}`).classList.add('selected');
      });
      const timeNumbers = time.map((timeString) => parseInt(timeString));
      this.map.setFilter(dataset, ['in', 'time', ...timeNumbers]);
    } else {
      purpose.forEach((value) => {
        document.getElementById(`purpose-${value}`).classList.add('selected');
      });
      this.map.getLayer(dataset).setPaintProperty(
          'circle-color',
          this.dataDrivenCircleColors
      );
      time.forEach((value) => {
        document.getElementById(`time-${value}`).classList.add('selected');
      });
      const timeNumbers = time.map((timeString) => parseInt(timeString));
      this.map.setFilter(dataset, [
        'all',
        ['in', 'time', ...timeNumbers],
        ['in', 'purp', ...purpose],
      ]);
    }
  }
}
