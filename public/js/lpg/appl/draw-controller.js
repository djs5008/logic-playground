import { States } from './selection-states/control-state';

export class DrawController {

  /**
   * Constructor for DrawController
   */
  constructor(stage, selectionController, moduleController, resourceController) {
    // setup properties
    this.stage = stage;
    this.stage.setClearColor('#FFF');
    this.flowOffset = 0;

    // init dependent controllers
    this.moduleController = moduleController;
    this.selectionController = selectionController;
    this.resourceController = resourceController;

    // initialize double-buffering properties
    this.buffer = new createjs.Shape();
    this.graphics = this.buffer.graphics;
    this.stage.addChild(this.buffer);

    // Setup pre-draw caches
    this.background = undefined;

    // resize canvas to window dims
    this.fitStage = this.fitStage.bind(this);
    window.addEventListener('resize', this.fitStage, false);
    this.fitStage();

    // DEBUG
    // setInterval(() => {
    //   console.log('FPS: ' + createjs.Ticker.getMeasuredFPS());
    // }, 1000);
  }

  /**
   * Resize the stage to fit within the window bounds (buffer cache gets updated on resize too)
   */
  fitStage() {
    let SIZE_RATIO = (3 / 4);
    this.stage.canvas.width = window.innerWidth * SIZE_RATIO;
    this.stage.canvas.height = window.innerHeight * SIZE_RATIO;
    this.stage.updateViewport(window.innerWidth * SIZE_RATIO, window.innerHeight * SIZE_RATIO);
    this.buffer.uncache();
    this.buffer.cache(0, 0, this.stage.canvas.width, this.stage.canvas.height);
    this.stage.removeChild(this.background);
    this.background = undefined;
  }

  /**
   * Begin painting the scene
   */
  startPainting() {
    createjs.Ticker.on('tick', this.paint.bind(this));
    // createjs.Ticker.framerate = 144;
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
  }

  /**
   * Initialize the animation timer
   */
  startAnimationTimer() {
    let me = this;
    let slideAmounts = {};

    const ANIM_TIMER_INTERVAL = 10;
    const MAX_FLOW_OFFSET = 20;
    const FLOW_OFFSET_DELTA = 1.0;
    const LERP_DELTA = 0.1;

    setInterval(() =>  {
      // Animate wire flow
      me.flowOffset = (me.flowOffset < MAX_FLOW_OFFSET)
        ? me.flowOffset + FLOW_OFFSET_DELTA
        : FLOW_OFFSET_DELTA;

      // Lerp slide bar
      me.moduleController.activeModule.components.forEach(component => {
        if (component.type === 'SWITCH-BUTTON') {
          if (!slideAmounts[component.id]) {
            slideAmounts[component.id] = 0.0;
          }

          let slideAmount = slideAmounts[component.id];
          if (component.getState()) {
            slideAmounts[component.id] = (slideAmount < 1.0) ? slideAmount + LERP_DELTA : 1.0;
          } else {
            slideAmounts[component.id] = (slideAmount > 0.0) ? slideAmount - LERP_DELTA : 0.0;
          }
          component.setSlideAmount(slideAmounts[component.id]);
        }
      });
    }, ANIM_TIMER_INTERVAL);
  }

  /**
   * Paint the canvas
   */
  paint() {
    setTimeout(() => {
      // clear before each frame
      this.graphics.clear();

      // draw layers
      this.background === undefined && this.drawBackground();
      this.drawGrid();
      this.drawOrigin();
      this.drawAllWires();
      this.drawCurrentWire();
      this.drawComponents();
      this.drawConnectorSelection();
      this.drawComponentSelections();
      this.drawHoveredConnector();
      this.drawHoveredComponent();
      this.drawSelection();

      // update buffer cache and stage after changes
      this.buffer.updateCache();
      this.stage.update();
    }, 0);
  }

  /**
   * Draw the (white) background 
   *  (to allow for mouse events to be handled nicely)
   */
  drawBackground() {
    console.log('drawing background...');
    this.background = new createjs.Shape();
    const BG_COLORS = ['#FFF', '#DDD'];
    const RATIOS = [0.5, 1.0];
    this.background.graphics
      .beginLinearGradientFill(BG_COLORS, RATIOS, 0, 0, 0, this.stage.canvas.height)
      .rect(0, 0, this.stage.canvas.width, this.stage.canvas.height)
      .endFill();
    this.background.cache(0, 0, this.stage.canvas.width, this.stage.canvas.height);
    this.stage.addChildAt(this.background, 0);
  }

  /**
   * Draw the background grid
   */
  drawGrid() {
    const GRID_GAP = 50;
    const GRID_COLOR = '#CCC';
    const LINE_GAP = GRID_GAP / 4;
    let origin = this.moduleController.activeModule.startPos;

    this.graphics.setStrokeDash([GRID_GAP / 2], 1);
    // draw from top to bottom
    for (let x = (origin.x % GRID_GAP); x < this.stage.canvas.width; x += GRID_GAP) {
      this.graphics.beginStroke(GRID_COLOR)
        .moveTo(x, (origin.y % GRID_GAP) - LINE_GAP)
        .lineTo(x, this.stage.canvas.height)
        .endStroke();
    }
    // draw from left to right
    for (let y = (origin.y % GRID_GAP); y < this.stage.canvas.height; y += GRID_GAP) {
      this.graphics.beginStroke(GRID_COLOR)
        .moveTo((origin.x % GRID_GAP) - LINE_GAP, y)
        .lineTo(this.stage.canvas.width, y)
        .endStroke();
    }
    // reset stroke dash
    this.graphics.setStrokeDash();
  }

  /**
   * Draw the origin point
   */
  drawOrigin() {
    const radius = 2;
    let posX = this.moduleController.activeModule.startPos.x;
    let posY = this.moduleController.activeModule.startPos.y;
    this.graphics.beginFill('red')
      .drawCircle(posX, posY, radius)
      .endFill();
  }

  /**
   * Draw each component in the active module
   */
  drawComponents() {
    let me = this;
    this.moduleController.activeModule.components.forEach((component) =>  {
      let location = me.selectionController.getScreenCoords(component.bounds);
      component.paint(me.graphics, location);

      // draw components connectors
      component.connectors.forEach((connector) =>  {
        let connLocScreen = me.selectionController.getScreenCoords(connector.bounds);
        connector.paint(me.graphics, connLocScreen);
      });
      
    });
  }

  /**
   * Draw a selection box around the currently hovered component in the active module
   */
  drawHoveredComponent() {
    if (this.selectionController.getActiveState() === States.HOVER_COMPONENT) {
      let hoveredComp = this.selectionController.getHoveredComponent();
      if (hoveredComp !== null) {
        let location = this.selectionController.getScreenCoords({ x: hoveredComp.bounds.x, y: hoveredComp.bounds.y });
        const padding = 2;
        this.graphics.beginFill('rgba(127,0,0,0.3)')
          .drawRect(
            location.x - (padding / 2),
            location.y - (padding / 2),
            hoveredComp.bounds.width + padding,
            hoveredComp.bounds.height + padding)
          .endFill()
          .beginStroke('rgba(127,0,0,0.2)')
          .setStrokeStyle(2)
          .drawRect(
            location.x - (padding / 2),
            location.y - (padding / 2),
            hoveredComp.bounds.width + padding,
            hoveredComp.bounds.height + padding)
          .endStroke();
      }
    }
  }

  /**
   * Draw a "selected" box around each of the currently selected components
   */
  drawComponentSelections() {
    let me = this;
    this.selectionController.selectedComponents.forEach((component) =>  {
      let location = me.selectionController.getScreenCoords({ x: component.bounds.x, y: component.bounds.y });
      const padding = 2;
      me.graphics.beginFill('rgba(150,0,0,0.3)')
        .drawRect(
          location.x - (padding / 2),
          location.y - (padding / 2),
          component.bounds.width + padding,
          component.bounds.height + padding)
        .endFill()
        .beginStroke('rgba(150,0,0,0.4)')
        .setStrokeStyle(2)
        .drawRect(
          location.x - (padding / 2),
          location.y - (padding / 2),
          component.bounds.width + padding,
          component.bounds.height + padding)
        .endStroke();
    });
  }

  /**
   * Draw the currently hovered-over connector
   */
  drawHoveredConnector() {
    if (this.selectionController.getActiveState() === States.HOVER_CONNECTOR
        || this.selectionController.getActiveState() === States.CONNECTING) {
      let hoveredConn = this.selectionController.getHoveredConnector();
      if (hoveredConn !== null) {
        let location = this.selectionController.getScreenCoords({ x: hoveredConn.bounds.x, y: hoveredConn.bounds.y });
        this.graphics.beginFill('rgba(150,0,0,0.5)')
          .drawCircle(location.x, location.y, hoveredConn.bounds.width)
          .endFill()
          .beginStroke('rgba(150,0,0,1)')
          .setStrokeStyle(2)
          .drawCircle(location.x, location.y, hoveredConn.bounds.width)
          .endStroke();
      }
    }
  }

  /**
   * Draw the previously selected connector
   */
  drawConnectorSelection() {
    let selectedConnector = this.selectionController.getSelectedConnector();
    if (selectedConnector !== null) {
      let location = this.selectionController.getScreenCoords({ x: selectedConnector.bounds.x, y: selectedConnector.bounds.y });
      this.graphics.beginFill('rgba(150,0,0,0.5)')
        .drawCircle(location.x, location.y, selectedConnector.bounds.width)
        .endFill()
        .beginStroke('rgba(150,0,0,1)')
        .setStrokeStyle(2)
        .drawCircle(location.x, location.y, selectedConnector.bounds.width)
        .endStroke();
    }
  }

  /**
   * Draw your current left mouse-drag selection
   */
  drawSelection() {
    if (this.selectionController.getActiveState() === States.SELECTING) {
      let selectionRect = this.selectionController.getSelectionRect();
      this.graphics.beginFill('rgba(0,50,127,0.3)')
        .drawRect(selectionRect.x, selectionRect.y, selectionRect.width, selectionRect.height)
        .endFill()
        .beginStroke('rgba(0,50,127,0.4)')
        .setStrokeStyle(2)
        .drawRect(selectionRect.x, selectionRect.y, selectionRect.width, selectionRect.height)
        .endStroke();
    }
  }

  /**
   * Draw the wire that is currently being created (selectedConnector to mousePos)
   */
  drawCurrentWire() {
    let selectedConnector = this.selectionController.getSelectedConnector();
    if (selectedConnector !== null) {
      let connLocation = this.selectionController.getScreenCoords(selectedConnector.bounds);
      let mouseLocation = this.selectionController.getMouseLoc();
      this.graphics.beginStroke('rgb(0,0,0)')
        .setStrokeStyle(4)
        .moveTo(connLocation.x, connLocation.y)
        .lineTo(mouseLocation.x, mouseLocation.y)
        .endStroke()
        .setStrokeStyle();
    }
  }

  /**
   * Draw all of the wires in the activeModule based on the ModuleController's connector map
   */
  drawAllWires() {
    let me = this;
    const FLOW_GAP = 10;
    const LINE_SIZE = 6;
    const FLOW_SIZE = LINE_SIZE - 3;
    Object.keys(me.moduleController.activeModule.getConnectorMap()).forEach((inConnID) =>  {
      let inConn = me.moduleController.activeModule.getConnector(inConnID);
      let inConnLoc = me.selectionController.getScreenCoords(inConn.bounds);
      me.moduleController.activeModule.getConnectorMap()[inConnID].forEach((outConn) =>  {
        let outConnLoc = me.selectionController.getScreenCoords(outConn.bounds);
        let color = outConn.getState() ? 'rgb(0,100,0)' : 'rgb(50,0,0)';
        let curvePadding = 30;
        me.graphics.beginStroke(color)
          .setStrokeStyle(LINE_SIZE)
          .moveTo(outConnLoc.x, outConnLoc.y)
          .bezierCurveTo(outConnLoc.x + curvePadding, outConnLoc.y, inConnLoc.x - curvePadding, inConnLoc.y, inConnLoc.x, inConnLoc.y)
          .endStroke()
          .setStrokeStyle();
        if (outConn.getState()) {
          me.graphics.beginStroke('rgb(0,200,0)')
            .setStrokeStyle(FLOW_SIZE)
            .setStrokeDash([FLOW_GAP], -me.flowOffset)
            .moveTo(outConnLoc.x, outConnLoc.y)
            .bezierCurveTo(outConnLoc.x + curvePadding, outConnLoc.y, inConnLoc.x - curvePadding, inConnLoc.y, inConnLoc.x, inConnLoc.y)
            .endStroke()
            .setStrokeStyle()
            .setStrokeDash();
        }
      });
    });
  }
}