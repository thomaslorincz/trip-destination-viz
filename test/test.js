import {describe, it} from 'mocha';
import {expect} from 'chai';
import EventEmitter from 'eventemitter3';
import AppModel from '../src/client/app/App.model';

describe('AppModel', () => {
  describe('#initialDraw()', () => {
    it('should dispatch a helpUpdated event', () => {
      const emitter = new EventEmitter();
      const model = new AppModel(emitter);

      let dispatched = false;
      emitter.on('helpUpdated', () => {
        dispatched = true;
      });

      model.initialDraw();
      expect(dispatched).to.be.true;
    });
  });

  describe('#updateDataset()', () => {
    it('should update the dataset when called', () => {
      const model = new AppModel(new EventEmitter());
      expect(model.dataset).to.equal('2065BAP');
      model.updateDataset('2065CityII');
      expect(model.dataset).to.equal('2065CityII');
    });

    it('should dispatch a settingsUpdated event', () => {
      const emitter = new EventEmitter();
      const model = new AppModel(emitter);

      let dispatched = false;
      emitter.on('settingsUpdated', () => {
        dispatched = true;
      });

      model.updateDataset('2065CityII');
      expect(dispatched).to.be.true;
    });
  });

  describe('#updatePurpose', () => {
    it('should update the purpose from \'all\' to a Set when input is not \'all\'', () => {
      const model = new AppModel(new EventEmitter());
      expect(model.purpose).to.equal('all');
      model.updatePurpose('O');
      expect(model.purpose).to.be.instanceof(Set);
      expect(model.purpose).to.contain('O');
    });

    it('should deselect \'all\' when the input is \'all\'', () => {
      const model = new AppModel(new EventEmitter());
      expect(model.purpose).to.equal('all');
      model.updatePurpose('all');
      expect(model.purpose).to.be.instanceof(Set);
      expect(model.purpose).to.be.empty;
    })
  });
});
