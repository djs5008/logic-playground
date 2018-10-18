import React from 'react';
import ControlButton from '../control-button';
import { States } from '../add-component-state';
import '../css/add-component.css';

import { connect } from 'react-redux';
import { setAddState } from '../../actions/actions.js';

const mapDispatchToProps = {
  setAddState,
};

const mapStateToProps = (state) => {
  return {
    inputTypes: state.inputTypes,
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(
  class InputState extends React.Component {

    goBack() {
      this.props.setAddState(States.INITIAL);
    }

    render() {
      return (
        <React.Fragment>
          <div className='Content'>
            { this.props.inputTypes }
          </div>
          <hr />
          <div className='Footer'>
            <ControlButton onClick={this.goBack.bind(this)}>
              Return
          </ControlButton>
          </div>
        </React.Fragment>
      );
    }

  }
);