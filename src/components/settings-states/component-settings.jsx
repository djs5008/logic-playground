import React from 'react';
import { connect } from 'react-redux';
import { } from '../../actions/actions.js';
import { } from '../../lpg/core.js';

const mapStateToProps = (state) => {
  return {
    settingsState: state.settingsState,
    selectedPiece: state.selectedPiece,
    activeModule: state.activeModule,
  }
};

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(
  class ComponentSettings extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        componentName: ((this.props.selectedPiece && this.props.selectedPiece.label) || 'no label'),
      }
    }

    componentWillReceiveProps(props) {
      this.setState({
        componentName: ((props.selectedPiece && props.selectedPiece.label) || 'no label'),
      });
    }

    updateComponentName(name) {
      if (this.props.selectedPiece) {
        this.setState({
          componentName: name,
        });
        // this.props.activeModule.getComponentByID(this.props.selectedPiece.id).label = name;
        this.props.selectedPiece.label = name;
      }
    }

    render() {
      return (
        <React.Fragment>
          <div className='Content-Container'>
            
          </div>
          <hr />
          <label htmlFor='active-module-name' className='ActiveModuleLabel'>Selected Component:</label>
          <input
            id='active-module-name'
            type='text'
            value={this.state.componentName}
            className='ActiveModuleName'
            onInput={(evt) => this.updateComponentName(evt.target.value)}
            onChange={(evt) => this.updateComponentName(evt.target.value)}
            onPaste={(evt) => this.updateComponentName(evt.target.value)}
          />
        </React.Fragment>
      );
    }

  }
);