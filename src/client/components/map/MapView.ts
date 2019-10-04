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
      const scenarios = [
        ['2065BAP', 'thomaslorincz.1046c6an', 'output_2065BAP_focused-28fctt'],
        [
          '2065CityII',
          'thomaslorincz.3wttrtss',
          'output_2065CityII_focused-757xdf',
        ],
      ];

      for (let i = 0; i < scenarios.length; i++) {
        const scenario = scenarios[i];
        this.map.addLayer({
          'id': scenario[0],
          'source': {
            type: 'vector',
            url: 'mapbox://' + scenario[1],
          },
          'source-layer': scenario[2],
          'type': 'circle',
          'paint': {
            'circle-radius': ['/', ['to-number', ['get', 'count']], 300],
            'circle-opacity-transition': {
              'duration': 1000,
              'delay': 0,
            },
          },
        });
      }

      const overlays = [
        ['cma', 'thomaslorincz.1kz18y39', 'cma_boundary-5vtklc'],
        ['city', 'thomaslorincz.48okpw5t', 'city_boundary-d6ewoz'],
        ['nc', 'thomaslorincz.d571qaco', 'nc_CityII-axaip8'],
        ['lrt', 'thomaslorincz.75obfmea', 'lrt_2065-0kp6p1'],
      ];

      for (let i = 0; i < overlays.length; i++) {
        const overlay = overlays[i];
        this.map.addLayer({
          'id': overlay[0],
          'source': {
            type: 'vector',
            url: 'mapbox://' + overlays[1],
          },
          'source-layer': overlay[2],
          'type': 'line',
          'paint': {'line-width': 2},
          'line-opacity-transition': {
            'duration': 500,
            'delay': 0,
          },
        });
      }

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
              // 'T', purposeColours.get('T'),
              'Other', purposeColours.get('Other'),
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
      } else if (purposes.get('all')) {
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
