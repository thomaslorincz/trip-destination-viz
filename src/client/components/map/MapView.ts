import * as mapboxgl from 'mapbox-gl';
import View from '../../superclasses/View';
import * as EventEmitter from 'eventemitter3';

export default class MapView extends View {
  private map: mapboxgl.Map;

  /* Help window elements */
  private helpIcon = document.getElementById('help-icon');
  private help = document.getElementById('help');
  private closeHelp = document.getElementById('close-help');

  public constructor(container: HTMLElement, emitter: EventEmitter) {
    super(container, emitter);

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
      const scenarioLayerStyling = {
        'type': 'circle',
        'paint': {
          'circle-radius': ['/', ['to-number', ['get', 'count']], 300],
          'circle-opacity-transition': {
            'duration': 1000,
            'delay': 0,
          },
        },
      };

      this.map.addLayer({
        'id': '2065BAP',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.1mgtoxdx',
        },
        'source-layer': 'output_2065BAP_300_peak-bjgso4',
        ...scenarioLayerStyling,
      });

      this.map.addLayer({
        'id': '2065CityII',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.3low14lh',
        },
        'source-layer': 'output_2065CityII_300_peak-avhe9k',
        ...scenarioLayerStyling,
      });

      const overlayLayerStyling = {
        'type': 'line',
        'paint': {'line-width': 2},
        'line-opacity-transition': {
          'duration': 500,
          'delay': 0,
        },
      };

      this.map.addLayer({
        'id': 'cma',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.1kz18y39',
        },
        'source-layer': 'cma_boundary-5vtklc',
        ...overlayLayerStyling,
      });

      this.map.addLayer({
        'id': 'city',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.48okpw5t',
        },
        'source-layer': 'city_boundary-d6ewoz',
        ...overlayLayerStyling,
      });

      this.map.addLayer({
        'id': 'nc',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.d571qaco',
        },
        'source-layer': 'nc_CityII-axaip8',
        ...overlayLayerStyling,
      });

      this.map.addLayer({
        'id': 'lrt',
        'source': {
          type: 'vector',
          url: 'mapbox://thomaslorincz.75obfmea',
        },
        'source-layer': 'lrt_2065-0kp6p1',
        ...overlayLayerStyling,
      });

      this.emitter.emit('loaded');
    });
  }

  /**
   * Initializes the help icon and help dialogue for displaying project
   * information and controls.
   */
  private initializeHelp(): void {
    this.helpIcon.addEventListener('click', (): void => {
      this.emitter.emit('help-clicked');
    });
    this.help.addEventListener('click', (event: Event): void => {
      if (event.target === document.getElementById('help')) {
        this.emitter.emit('help-clicked');
      }
    });
    this.closeHelp.addEventListener('click', (): void => {
      this.emitter.emit('help-clicked');
    });
  }

  public draw(scenarios: Map<string, boolean>, purposes: Map<string, boolean>,
      overlays: Map<string, boolean>, times: Map<string, boolean>,
      purposeColours: Map<string, string>,
      overlayColours: Map<string, string>): void {
    // Update colour and opacity for scenario layers
    scenarios.forEach((active: boolean, layer: string): void => {
      if (purposes.get('all')) {
        this.map.setPaintProperty(
            layer, 'circle-color', purposeColours.get('all')
        );
      } else {
        this.map.setPaintProperty(
            layer, 'circle-color', [
              'match', ['get', 'purp'],
              'O', purposeColours.get('O'),
              'W', purposeColours.get('W'),
              'S', purposeColours.get('S'),
              'P', purposeColours.get('P'),
              'H', purposeColours.get('H'),
              'T', purposeColours.get('T'),
              'L', purposeColours.get('L'),
              'R', purposeColours.get('R'),
              'C', purposeColours.get('C'),
              'Q', purposeColours.get('Q'),
              '#000000',
            ]
        );
      }

      this.map.setPaintProperty(layer, 'circle-opacity', (active) ? 1 : 0);
    });

    // Update colour and opacity for overlay layers
    overlays.forEach((active: boolean, layer: string): void => {
      this.map.setPaintProperty(layer, 'line-color', overlayColours.get(layer));
      this.map.setPaintProperty(layer, 'line-opacity', (active) ? 1 : 0);
    });

    // Draw the dots
    scenarios.forEach((active: boolean, layer: string): void => {
      if (!active) return;

      const activePurposes = [];
      purposes.forEach((active: boolean, purpose: string): void => {
        if (active) activePurposes.push(purpose);
      });

      const activeTimes = [];
      times.forEach((active: boolean, time: string): void => {
        if (active) activeTimes.push(parseInt(time));
      });

      if (times.get('all') && purposes.get('all')) {
        this.map.setFilter(layer, null);
      } else if (times.get('all')) {
        this.map.setFilter(layer, ['in', 'purp', ...activePurposes]);
      } else if (purposes.has('all')) {
        this.map.setFilter(layer, ['in', 'time', ...activeTimes]);
      } else {
        this.map.setFilter(layer, [
          'all',
          ['in', 'time', ...activeTimes],
          ['in', 'purp', ...activePurposes],
        ]);
      }
    });
  }

  public static drawHelp(open: boolean): void {
    document.getElementById('help').style.display = (open) ? 'flex' : 'none';
  }
}
