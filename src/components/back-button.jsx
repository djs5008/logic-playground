import React from 'react';
import { connect } from 'react-redux';
import { popActiveModule } from '../actions/actions.js';
import { getSelectionController } from '../lpg/core.js';
import './css/back-button.css';

const BACK_BUTTON_URL = '/img/lpg/arrow-back-button.png';

const mapStateToProps = (state) => {
  return {
    activeModules: state.activeModules,
  }
};

const mapDispatchToProps = {
  popActiveModule,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  class BackButton extends React.Component {

    handleClick(evt) {
      if (this.props.activeModules.length > 1) {
        this.props.popActiveModule();
        getSelectionController().clearSelection();
      }
    }

    renderButton() {
      if (this.props.activeModules.length > 1) {
        return (
          <button type='button' className='BackButton' onClick={this.handleClick.bind(this)}>
            <img src={BACK_BUTTON_URL} alt=''/>
          </button>
        );
      } else {
        return;
      }
    }

    render() {
      return (
        <React.Fragment>
          {this.renderButton()}
        </React.Fragment>
      );
    }

  }
);