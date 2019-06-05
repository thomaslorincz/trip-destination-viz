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

    this.datasetControl = document.getElementById('dataset-control');
    this.datasetControl.addEventListener('click', (event) => {
      this.container.dispatchEvent(new CustomEvent('datasetClicked', {
        detail: event.target.dataset.value,
      }));
    });

    this.timeControl = document.getElementById('time-control');
    this.timeControl.addEventListener('click', (event) => {
      this.container.dispatchEvent(new CustomEvent('timeClicked', {
        detail: {
          time: event.target.dataset.value,
          ctrlKey: event.ctrlKey,
        },
      }));
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
            8, 0.4,
            12, 1,
          ],
          'circle-color': '#FF0000',
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
            8, 0.4,
            12, 1,
          ],
          'circle-color': '#0000FF',
        },
      });

      this.container.dispatchEvent(new CustomEvent('loaded'));
    });
  }

  /**
   * @param {'2065BAP'|'2065CityII'} dataset
   * @param {'all'|string[]} time
   */
  draw({dataset, time}) {
    this.layers.forEach((layerId) => {
      this.map.setLayoutProperty(layerId, 'visibility', 'none');
    });

    this.map.setLayoutProperty(dataset, 'visibility', 'visible');

    // Clear all selected styling
    document.querySelectorAll('.control-value.selected').forEach((element) => {
      element.classList.remove('selected');
    });

    document.getElementById(`data-${dataset}`).classList.add('selected');

    if (time === 'all') {
      document.getElementById('time-all').classList.add('selected');
      this.map.setFilter(dataset, null);
    } else {
      time.forEach((value) => {
        document.getElementById(`time-${value}`).classList.add('selected');
      });
      const timeNumbers = time.map((timeString) => parseInt(timeString));
      this.map.setFilter(dataset, ['in', 'time', ...timeNumbers]);
    }
  }
}
