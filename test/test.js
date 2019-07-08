import {describe, it} from 'mocha';
import {expect} from 'chai';
import EventEmitter from 'eventemitter3';
import AppModel from '../src/client/app/App.model';

describe('AppModel', () => {
  describe('#updateDataset()', () => {
    it('should update the dataset when called', () => {
      const model = new AppModel(new EventEmitter());
      expect(model.dataset).to.equal('2065BAP');
      model.updateDataset('2065CityII');
      expect(model.dataset).to.equal('2065CityII');
    });
  });
});
