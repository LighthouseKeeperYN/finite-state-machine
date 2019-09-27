class FSM {
  /**
   * Creates new FSM instance.
   * @param config
   */
  constructor(config) {
    if (config === undefined) throw new Error();
    this.config = config;
    this.currentState = config.initial;
    this.possibleStates = Object.getOwnPropertyNames(config.states);
    this.history = {
      states: [],
      redo: []
    }
  }

  /**
   * Returns active state.
   * @returns {String}
   */
  getState() {
    return this.currentState;
  }

  /**
   * Goes to specified state.
   * @param state
   */
  changeState(state) {
    if (this.config.states[state] === undefined) throw new Error();
    this.history.states.push(this.currentState);
    this.currentState = state;
    this.history.redo = [];
  }

  /**
   * Changes state according to event transition rules.
   * @param event
   */
  trigger(event) {
    if (this.config.states[this.currentState].transitions[event] === undefined) throw new Error();
    this.history.states.push(this.currentState);
    this.currentState = this.config.states[this.currentState].transitions[event];
    this.history.redo = [];
  }

  /**
   * Resets FSM state to initial.
   */
  reset() {
    this.currentState = this.config.initial;
    this.history.states = [];
  }

  /**
   * Returns an array of states for which there are specified event transition rules.
   * Returns all states if argument is undefined.
   * @param event
   * @returns {Array}
   */
  getStates(event) {
    if (arguments.length === 0) return this.possibleStates;

    let result = [];
    for (let i = 0; i < this.possibleStates.length; i++) {
      if (this.config.states[this.possibleStates[i]].transitions[event] !== undefined) {
        result.push(this.possibleStates[i]);
      }
    }

    return result;
  }

  /**
   * Goes back to previous state.
   * Returns false if undo is not available.
   * @returns {Boolean}
   */
  undo() {
    if (this.history.states.length === 0) return false;
    this.history.redo.push(this.currentState);
    this.currentState = this.history.states[this.history.states.length - 1];
    this.history.states.pop();
    return true;
  }

  /**
   * Goes redo to state.
   * Returns false if redo is not available.
   * @returns {Boolean}
   */
  redo() { 
    if (this.history.redo.length === 0) return false;
    if (this.history.states.length === 0 && this.history.redo.length === 0) return false;
    this.currentState = this.history.redo[this.history.redo.length - 1];
    this.history.redo.pop();
    return true;
  }

  /**
   * Clears transition history
   */
  clearHistory() {
    this.history = {
      states: [],
      redo: []
    }
  }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
