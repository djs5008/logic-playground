import React from 'react';
import './css/drag-component.css';

export default class DragComponent extends React.Component {

  addDragData(event) {
    event.dataTransfer.setData('text/x-component', this.props.id);
  }

  onImageLoad(evt) {
    if (this.props.onLoad) {
      this.props.onLoad(evt.target);
    }
  }

  render() {
    return (
      <React.Fragment>
        <div
          id={this.props.id}
          key={this.props.id}
          className={`DragComponent drag-item noSelect`}
          onDragStart={this.addDragData.bind(this)}
        >
          <div className='imageContainer'>
            <img src={this.props.src} draggable onLoad={this.onImageLoad.bind(this)} alt=''/>
          </div>
          <h6 className={`DragComponent-Label noSelect`}>{this.props.label.replace(/-/g, ' ')}</h6>
        </div>
      </React.Fragment>
    )
  }
}