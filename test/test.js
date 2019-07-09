import {describe, it, beforeEach} from 'mocha';
import {expect} from 'chai';
import EventEmitter from 'eventemitter3';
import AppModel from '../src/client/app/App.model';

describe('AppModel', function() {
  this.emitter = null;
  this.model = null;

  describe('#initialDraw()', () => {
    beforeEach(() => {
      this.emitter = new EventEmitter();
      this.model = new AppModel(this.emitter);
    });

    it('should dispatch a helpUpdated event', () => {
      let dispatched = false;
      this.emitter.on('helpUpdated', () => {
        dispatched = true;
      });

      this.model.initialDraw();
      expect(dispatched).to.be.true;
    });
  });

  describe('#updateDataset()', () => {
    beforeEach(() => {
      this.emitter = new EventEmitter();
      this.model = new AppModel(this.emitter);
    });

    it('should update the dataset when called', () => {
      expect(this.model.dataset).to.equal('2065BAP');
      this.model.updateDataset('2065CityII');
      expect(this.model.dataset).to.equal('2065CityII');
    });

    it('should dispatch a settingsUpdated event', () => {
      let dispatched = false;
      this.emitter.on('settingsUpdated', () => {
        dispatched = true;
      });

      this.model.updateDataset('2065CityII');
      expect(dispatched).to.be.true;
    });
  });

  describe('#updatePurpose', () => {
    beforeEach(() => {
      this.emitter = new EventEmitter();
      this.model = new AppModel(this.emitter);
    });

    it('should update the purpose from \'all\' to a Set when input is not \'all\'', () => {
      expect(this.model.purpose).to.equal('all');
      this.model.updatePurpose('O');
      expect(this.model.purpose).to.be.instanceof(Set);
      expect(this.model.purpose).to.contain('O');
    });

    it('should deselect \'all\' when the input is \'all\'', () => {
      expect(this.model.purpose).to.equal('all');
      this.model.updatePurpose('all');
      expect(this.model.purpose).to.be.instanceof(Set);
      expect(this.model.purpose).to.be.empty;
    })
  });
});
