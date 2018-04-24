define(() => {
  'use strict';

  /**
   * Logic module that allows for static calls boolean logic operations
   */
  class Logic {

    /**
     * @param {boolean} a input a
     * @param {boolean} b input b
     * @return {boolean} Result of boolean AND operation
     */
    static andd(a, b) {
      return a && b;
    }

    /**
     * @param {boolean} a input a
     * @param {boolean} b input b
     * @return {boolean} Result of boolean OR operation
     */
    static orr(a, b) {
      return a || b;
    }

    /**
     * @param {boolean} a input a
     * @return {boolean} Result of boolean NOT operation
     */
    static nott(a) {
      return !a;
    }

    /**
     * @param {boolean} a input a
     * @param {boolean} b input b
     * @return {boolean} Result of boolean NAND operation
     */
    static nandd(a, b) {
      return this.nott(this.andd(a, b));
    }

    /**
     * @param {boolean} a input a
     * @param {boolean} b input b
     * @return {boolean} Result of boolean NOR operation
     */
    static norr(a, b) {
      return this.nott(this.orr(a, b));
    }

    /**
     * @param {boolean} a input a
     * @param {boolean} b input b
     * @return {boolean} Result of boolean XNOR operation
     */
    static xnorr(a, b) {
      return !(a ^ b);
    }

    /**
     * @param {boolean} a input a
     * @param {boolean} b input b
     * @return {boolean} Result of boolean XOR operation
     */
    static xorr(a, b) {
      return !this.xnorr(a, b);
    }
  }

  return Logic;
});