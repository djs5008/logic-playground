import React from 'react';
import ControlButton from '../control-button';
import { States } from '../add-component-state';
import '../css/add-component.css';

import { connect } from 'react-redux';
import { setAddState } from '../../actions/actions.js';

const mapDispatchToProps = {
  setAddState,
};

export default connect(null, mapDispatchToProps)(
  class GateState extends React.Component {

    goBack() {
      this.props.setAddState(States.INITIAL);
    }

    render() {
      return (
        <React.Fragment>
          <div className='Content'>
          
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