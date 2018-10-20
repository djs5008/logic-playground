import React from 'react';
import './css/drag-component.css';

export default class DragComponent extends React.Component {

  addDragData(event) {
    event.dataTransfer.setData('text/x-component', this.props.id);
  }

  render() {
    return (
      <React.Fragment>
        <div
          key={this.props.id}
          className={`DragComponent drag-item noSelect`}
          onDragStart={this.addDragData.bind(this)}
        >
          <img src={this.props.src} draggable width='100%' alt=''/>
          <h6 className={`DragComponent-Label noSelect`}>{this.props.label.replace(/-/g, ' ')}</h6>
        </div>
      </React.Fragment>
    )
  }
}