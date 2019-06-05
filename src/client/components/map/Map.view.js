import mapboxgl from 'mapbox-gl';
import View from '../../superclasses/View';

// eslint-disable-next-line
export default class MapView extends View {
  /**
   * @param {HTMLElement} container
   */
  constructor(container) {
    super(container);

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
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [-113.323975, 53.631611],
      zoom: 7,
    });

    this.map.dragRotate.disable();
    this.map.touchZoomRotate.disable();

    this.circlePaint = {
      'circle-radius': 2,
      'circle-opacity': 0.4,
      'circle-opacity-transition': {duration: 500},
      'circle-color': '#FF0000',
    };

    this.map.on('load', () => {
      // Time 1
      this.map.addLayer({
        'id': '1',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.583pjmkt',
        },
        'source-layer': 'output_2065CityII_1-4glz7d',
        'type': 'circle',
        'paint': this.circlePaint,
      });

      // Time 21
      this.map.addLayer({
        'id': '21',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.2bifjb7r',
        },
        'source-layer': 'output_2065CityII_21-4z53tz',
        'type': 'circle',
        'paint': this.circlePaint,
      });

      // Time 22
      this.map.addLayer({
        'id': '22',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.103wx5eq',
        },
        'source-layer': 'output_2065CityII_22-0ypg9r',
        'type': 'circle',
        'paint': this.circlePaint,
      });

      // Time 23
      this.map.addLayer({
        'id': '23',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.8v024ybb',
        },
        'source-layer': 'output_2065CityII_23-0asb0b',
        'type': 'circle',
        'paint': this.circlePaint,
      });

      // Time 3
      this.map.addLayer({
        'id': '3',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.0f930dhx',
        },
        'source-layer': 'output_2065CityII_3-0hy705',
        'type': 'circle',
        'paint': this.circlePaint,
      });

      // Time 41
      this.map.addLayer({
        'id': '41',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.70il1oe0',
        },
        'source-layer': 'output_2065CityII_41-b6wa2r',
        'type': 'circle',
        'paint': this.circlePaint,
      });

      // Time 42
      this.map.addLayer({
        'id': '42',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.apavzgr8',
        },
        'source-layer': 'output_2065CityII_42-8jwfg2',
        'type': 'circle',
        'paint': this.circlePaint,
      });

      // Time 43
      this.map.addLayer({
        'id': '43',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.bk6ao503',
        },
        'source-layer': 'output_2065CityII_43-3xxcy9',
        'type': 'circle',
        'paint': this.circlePaint,
      });

      // Time 5
      this.map.addLayer({
        'id': '5',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.4c836euq',
        },
        'source-layer': 'output_2065CityII_5-b90mgd',
        'type': 'circle',
        'paint': this.circlePaint,
      });

      // Time 6
      this.map.addLayer({
        'id': '6',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.4hlqkniu',
        },
        'source-layer': 'output_2065CityII_6-2opt4s',
        'type': 'circle',
        'paint': this.circlePaint,
      });

      this.container.dispatchEvent(new CustomEvent('loaded'));
    });
  }

  /**
   * @param {'all'|string[]} time
   */
  draw(time) {
    document.querySelectorAll('.time.selected').forEach((element) => {
      element.classList.remove('selected');
    });
    if (time === 'all') {
      document.getElementById('time-all').classList.add('selected');
    } else {
      time.forEach((value) => {
        document.getElementById(`time-${value}`).classList.add('selected');
      });
    }

    const layers = ['1', '21', '22', '23', '3', '41', '42', '43', '5', '6'];
    if (time === 'all') {
      layers.forEach((layer) => {
        this.map.setPaintProperty(layer, 'circle-opacity', 0.4);
      });
    } else {
      layers.forEach((layer) => {
        this.map.setPaintProperty(layer, 'circle-opacity', 0);
      });
      time.forEach((value) => {
        this.map.setPaintProperty(value, 'circle-opacity', 0.4);
      });
    }
  }
}
