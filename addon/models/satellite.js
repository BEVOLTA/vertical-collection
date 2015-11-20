import Ember from 'ember';
import Geography from './geography';

const {
  guidFor
  } = Ember;

class Satellite {

  constructor(component, radar) {
    this.radar = radar;
    this.component = component;
    this.element = component.element;
    this.geography = new Geography(this.element);
    this.key = guidFor(component);
    if (component.registerSatellite) {
      component.registerSatellite(this);
    }
  }

  heightDidChange(/* delta */) {}
  widthDidChange(/* delta */) {}

  resize() {
    let cached = this.geography.getState();
    this.geography.setState();

    let heightChange = cached.height - this.geography.height;
    let widthChange = cached.width - this.geography.width;

    if (heightChange) {
      this.heightDidChange();
    }
    if (widthChange) {
      this.widthDidChange();
    }

    return heightChange || widthChange ? { dX: widthChange, dY: heightChange } : null;
  }

  _shift(dY, dX) {
    this.geography.left -= dX;
    this.geography.right -= dX;
    this.geography.bottom -= dY;
    this.geography.top -= dY;
  }

  willShift() {}
  didShift() {}

  shift(dY, dX) {
    this.willShift(dY, dX);
    this._shift(dY, dX);
    this.didShift(dY, dX);
  }

  destroy() {
    if (this.component.unregisterSatellite) {
      this.component.unregisterSatellite();
    }
    this.component = null;
    this.satellite = null;
    this.element = null;
    this.geography.destroy();
    this.geography = null;
    this.radar = null;
  }

}

export default Satellite;
