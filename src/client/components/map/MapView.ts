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
        // BAU Scenario layers
        ['BAU_O_1', 'thomaslorincz.4acy10kj', 'BAU_O_1-5wmbil'],
        ['BAU_O_2', 'thomaslorincz.7jv201m8', 'BAU_O_2-4g8u49'],
        ['BAU_O_3', 'thomaslorincz.dcbca8ru', 'BAU_O_3-174onh'],
        ['BAU_O_4', 'thomaslorincz.9aty56h7', 'BAU_O_4-1d2nvp'],
        ['BAU_O_5', 'thomaslorincz.d7go63ec', 'BAU_O_5-44cop4'],
        ['BAU_O_6', 'thomaslorincz.cewm69mh', 'BAU_O_6-5tb13o'],
        ['BAU_W_1', 'thomaslorincz.0pdesu3e', 'BAU_W_1-6q3hly'],
        ['BAU_W_2', 'thomaslorincz.8yambk9t', 'BAU_W_2-67uhde'],
        ['BAU_W_3', 'thomaslorincz.75ta099t', 'BAU_W_3-3k1esn'],
        ['BAU_W_4', 'thomaslorincz.cgto8t5v', 'BAU_W_4-6ny8fx'],
        ['BAU_W_5', 'thomaslorincz.791qk3k8', 'BAU_W_5-4i8jjk'],
        ['BAU_W_6', 'thomaslorincz.029zbvm9', 'BAU_W_6-4we8z7'],
        ['BAU_S_1', 'thomaslorincz.51st1c41', 'BAU_S_1-28hqox'],
        ['BAU_S_2', 'thomaslorincz.0qt7bcjf', 'BAU_S_2-dgychu'],
        ['BAU_S_3', 'thomaslorincz.6pqzoyyu', 'BAU_S_3-aq2u51'],
        ['BAU_S_4', 'thomaslorincz.2agfmhkc', 'BAU_S_4-1nt1vj'],
        ['BAU_S_5', 'thomaslorincz.4xqukxh6', 'BAU_S_5-98hewb'],
        ['BAU_S_6', 'thomaslorincz.9jmrdoch', 'BAU_S_6-9wptua'],
        ['BAU_P_1', 'thomaslorincz.1enqtlsq', 'BAU_P_1-46ybsk'],
        ['BAU_P_2', 'thomaslorincz.ccg7ny42', 'BAU_P_2-bnemuc'],
        ['BAU_P_3', 'thomaslorincz.cz5mda0r', 'BAU_P_3-9cno48'],
        ['BAU_P_4', 'thomaslorincz.3y3tltqn', 'BAU_P_4-bd923x'],
        ['BAU_P_5', 'thomaslorincz.6m0otxyt', 'BAU_P_5-759112'],
        ['BAU_P_6', 'thomaslorincz.arvsvsuc', 'BAU_P_6-14bv6k'],
        ['BAU_H_1', 'thomaslorincz.0o6zh005', 'BAU_H_1-5mxmd2'],
        ['BAU_H_2', 'thomaslorincz.9hec68gg', 'BAU_H_2-cwjq01'],
        ['BAU_H_3', 'thomaslorincz.828cj7y8', 'BAU_H_3-1jv4y5'],
        ['BAU_H_4', 'thomaslorincz.7kcwr6lq', 'BAU_H_4-9yd20b'],
        ['BAU_H_5', 'thomaslorincz.50wnvkya', 'BAU_H_5-cwau4h'],
        ['BAU_H_6', 'thomaslorincz.4shb9w4w', 'BAU_H_6-65tky7'],
        ['BAU_T_1', 'thomaslorincz.96peuiea', 'BAU_T_1-2qt6vg'],
        ['BAU_T_2', 'thomaslorincz.2qiocljn', 'BAU_T_2-32egdv'],
        ['BAU_T_3', 'thomaslorincz.746gvl4w', 'BAU_T_3-415hp8'],
        ['BAU_T_4', 'thomaslorincz.ce7ptm68', 'BAU_T_4-b91p6f'],
        ['BAU_T_5', 'thomaslorincz.37oy53k9', 'BAU_T_5-01zncg'],
        ['BAU_T_6', 'thomaslorincz.1i84k55q', 'BAU_T_6-8cwdg0'],
        ['BAU_Other_1', 'thomaslorincz.9jxghlq6', 'BAU_Other_1-5lu7so'],
        ['BAU_Other_2', 'thomaslorincz.dyswhwl3', 'BAU_Other_2-4k151d'],
        ['BAU_Other_3', 'thomaslorincz.blkmrt6v', 'BAU_Other_3-537u0t'],
        ['BAU_Other_4', 'thomaslorincz.drzpa7rq', 'BAU_Other_4-41zqd6'],
        ['BAU_Other_5', 'thomaslorincz.6imkx7ez', 'BAU_Other_5-1h5n9v'],
        ['BAU_Other_6', 'thomaslorincz.89w31gz0', 'BAU_Other_6-0v0686'],
        // Preferred Scenario Layers
        ['Pref_O_1', 'thomaslorincz.84a503zi', 'Pref_O_1-dxieeu'],
        ['Pref_O_2', 'thomaslorincz.1idjiax3', 'Pref_O_2-81bbzl'],
        ['Pref_O_3', 'thomaslorincz.216j503f', 'Pref_O_3-4q0wo5'],
        ['Pref_O_4', 'thomaslorincz.c5s7l9wv', 'Pref_O_4-dfgps6'],
        ['Pref_O_5', 'thomaslorincz.akfahb82', 'Pref_O_5-1qhr5w'],
        ['Pref_O_6', 'thomaslorincz.1i2ddoyz', 'Pref_O_6-7v3osf'],
        ['Pref_W_1', 'thomaslorincz.cyvag8my', 'Pref_W_1-b73jn1'],
        ['Pref_W_2', 'thomaslorincz.ayanpral', 'Pref_W_2-46mijx'],
        ['Pref_W_3', 'thomaslorincz.dxjpa6bb', 'Pref_W_3-8v9jax'],
        ['Pref_W_4', 'thomaslorincz.ayuvnfol', 'Pref_W_4-aeelnz'],
        ['Pref_W_5', 'thomaslorincz.195e57g8', 'Pref_W_5-4a66i7'],
        ['Pref_W_6', 'thomaslorincz.d0dyqkd3', 'Pref_W_6-3pym7b'],
        ['Pref_S_1', 'thomaslorincz.075t2l1g', 'Pref_S_1-933vrt'],
        ['Pref_S_2', 'thomaslorincz.977vowhk', 'Pref_S_2-dup474'],
        ['Pref_S_3', 'thomaslorincz.0lr672zl', 'Pref_S_3-d62i0a'],
        ['Pref_S_4', 'thomaslorincz.dfrxjkwj', 'Pref_S_4-9mxosf'],
        ['Pref_S_5', 'thomaslorincz.776p68q1', 'Pref_S_5-3kj8sn'],
        ['Pref_S_6', 'thomaslorincz.18y5qkh5', 'Pref_S_6-1frxbt'],
        ['Pref_P_1', 'thomaslorincz.d3ilcizc', 'Pref_P_1-7bxc9q'],
        ['Pref_P_2', 'thomaslorincz.dm4di5c6', 'Pref_P_2-5fz86t'],
        ['Pref_P_3', 'thomaslorincz.9nbs5kcb', 'Pref_P_3-dyxwgj'],
        ['Pref_P_4', 'thomaslorincz.2b6d5v1h', 'Pref_P_4-cm5wpk'],
        ['Pref_P_5', 'thomaslorincz.76rmi121', 'Pref_P_5-455ikl'],
        ['Pref_P_6', 'thomaslorincz.a64qpmjb', 'Pref_P_6-cg8b6k'],
        ['Pref_H_1', 'thomaslorincz.7hnmg5eq', 'Pref_H_1-dzkql0'],
        ['Pref_H_2', 'thomaslorincz.dnqg2ucv', 'Pref_H_2-2wvho9'],
        ['Pref_H_3', 'thomaslorincz.7352xrzs', 'Pref_H_3-56grn1'],
        ['Pref_H_4', 'thomaslorincz.23oix5wa', 'Pref_H_4-cvb9va'],
        ['Pref_H_5', 'thomaslorincz.bjtng4ag', 'Pref_H_5-61uag5'],
        ['Pref_H_6', 'thomaslorincz.96g4rnfe', 'Pref_H_6-95y842'],
        ['Pref_T_1', 'thomaslorincz.5c5g2t1d', 'Pref_T_1-04bdus'],
        ['Pref_T_2', 'thomaslorincz.76ju1dvn', 'Pref_T_2-4qbc4e'],
        ['Pref_T_3', 'thomaslorincz.270790vs', 'Pref_T_3-0oturb'],
        ['Pref_T_4', 'thomaslorincz.c6x1cfj5', 'Pref_T_4-1ws4g2'],
        ['Pref_T_5', 'thomaslorincz.96bwv404', 'Pref_T_5-7ycnoo'],
        ['Pref_T_6', 'thomaslorincz.an6hy0tg', 'Pref_T_6-6h9eud'],
        ['Pref_Other_1', 'thomaslorincz.1npdgtri', 'Pref_Other_1-acz442'],
        ['Pref_Other_2', 'thomaslorincz.1eg71dng', 'Pref_Other_2-5hujq7'],
        ['Pref_Other_3', 'thomaslorincz.dqsvs4c2', 'Pref_Other_3-6d6a4g'],
        ['Pref_Other_4', 'thomaslorincz.0lpn8jwh', 'Pref_Other_4-3u2c93'],
        ['Pref_Other_5', 'thomaslorincz.bw6yp3kj', 'Pref_Other_5-8fddl7'],
        ['Pref_Other_6', 'thomaslorincz.8oj12ptv', 'Pref_Other_6-9u8p9s'],
      ];

      for (let i = 0; i < scenarios.length; i++) {
        this.map.addLayer({
          'id': scenarios[i][0],
          'source': {
            type: 'vector',
            url: 'mapbox://' + scenarios[i][1],
          },
          'source-layer': scenarios[i][2],
          'type': 'circle',
          'paint': {
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              0, 0,
              7, 0.4,
              14, 1,
              22, 1,
            ],
            'circle-opacity': 0,
            'circle-opacity-transition': {
              'duration': 1000,
              'delay': 0,
            },
            'circle-color-transition': {
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
        this.map.addLayer({
          'id': overlays[i][0],
          'source': {
            type: 'vector',
            url: 'mapbox://' + overlays[i][1],
          },
          'source-layer': overlays[i][2],
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
    // Update colour and opacity for data layers
    scenarios.forEach((scenarioActive: boolean, scenario: string): void => {
      purposes.forEach((purposeActive: boolean, purpose: string): void => {
        times.forEach((timeActive: boolean, time: string): void => {
          if (purpose === 'all' || time === 'all') return;

          const layerId = `${scenario}_${purpose}_${time}`;

          if (purposes.get('all')) {
            purposeActive = true;
          }

          if (times.get('all')) {
            timeActive = true;
          }

          this.map.setPaintProperty(
              layerId,
              'circle-opacity',
              (scenarioActive && purposeActive && timeActive) ? 0.6 : 0
          );

          if (purposes.get('all')) {
            this.map.setPaintProperty(
                layerId, 'circle-color', purposeColours.get('all')
            );
          } else {
            this.map.setPaintProperty(
                layerId, 'circle-color', purposeColours.get(purpose)
            );
          }
        });
      });
    });

    // Update colour and opacity for overlay layers
    overlays.forEach((active: boolean, layer: string): void => {
      this.map.setPaintProperty(layer, 'line-color', overlayColours.get(layer));
      this.map.setPaintProperty(layer, 'line-opacity', (active) ? 1 : 0);
    });
  }

  public static drawHelp(open: boolean): void {
    document.getElementById('help').style.display = (open) ? 'flex' : 'none';
  }
}
