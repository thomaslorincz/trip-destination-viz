import mapboxgl from 'mapbox-gl';
import View from '../../superclasses/View';

// eslint-disable-next-line
export default class MapView extends View {
  /**
   * @param {HTMLElement} container
   */
  constructor(container) {
    super(container);

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

    this.map.on('load', () => {
      this.map.addLayer({
        'id': 'destinations',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.1rvjiy6d',
        },
        'source-layer': '2065_BAP_all_300-dshlgz',
        'type': 'circle',
        'paint': {
          'circle-radius': 2,
          'circle-opacity': [
            'interpolate', ['linear'], ['zoom'],
            0, 0.1,
            6, 0.1,
            9, 0.3,
            12, 1,
            24, 1,
          ],
          'circle-color': '#FF0000',
        },
      });
    });
  }
}
