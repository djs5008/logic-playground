define(function () {
  'use strict';

  class Logic {
    andd(a, b) {
      return a && b;
    }

    orr(a, b) {
      return a || b;
    }

    nott(a) {
      return !a;
    }

    nandd(a, b) {
      return this.nott(this.andd(a, b));
    }

    norr(a, b) {
      return this.nott(this.orr(a, b));
    }

    xnorr(a, b) {
      return !(a ^ b);
    }

    xorr(a, b) {
      return !this.xnorr(a, b);
    }
  }

  return Logic;
});