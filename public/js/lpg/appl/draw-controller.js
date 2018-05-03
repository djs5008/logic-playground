/* global createjs */
define(() => {
  'use strict';

  class DrawController {

    /**
     * Constructor for DrawController
     */
    constructor(stage, selectionController, moduleController) {
      // setup properties
      this.stage = stage;
      this.stage.setClearColor('#FFF');
      this.flowOffset = 0;

      // init dependent controllers
      this.moduleController = moduleController;
      this.selectionController = selectionController;

      // initialize double-buffering properties
      this.buffer = new createjs.Shape();
      this.graphics = this.buffer.graphics;
      this.stage.addChild(this.buffer);

      // resize canvas to window dims
      this.fitStage = this.fitStage.bind(this);
      window.addEventListener('resize', this.fitStage, false);
      this.fitStage();
    }

    /**
     * Resize the stage to fit within the window bounds (buffer cache gets updated on resize too)
     */
    fitStage() {
      var SIZE_RATIO = (3 / 4);
      this.stage.canvas.width = window.innerWidth * SIZE_RATIO;
      this.stage.canvas.height = window.innerHeight * SIZE_RATIO;
      this.stage.updateViewport(window.innerWidth * SIZE_RATIO, window.innerHeight * SIZE_RATIO);
      this.buffer.uncache();
      this.buffer.cache(0, 0, this.stage.canvas.width, this.stage.canvas.height);
    }

    /**
     * Begin painting the scene
     */
    startPainting() {
      this.paint = this.paint.bind(this);
      createjs.Ticker.on('tick', this.paint);
      createjs.Ticker.framerate = 65;
    }

    /**
     * Initialize the animation timer
     */
    startAnimationTimer() {
      var me = this;
      const ANIM_TIMER_INTERVAL = 50;
      setInterval(() =>  {
        const MAX_FLOW_OFFSET = 20;
        const FLOW_OFFSET_DELTA = 2;
        me.flowOffset = (me.flowOffset < MAX_FLOW_OFFSET)
          ? me.flowOffset + FLOW_OFFSET_DELTA
          : FLOW_OFFSET_DELTA;
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
        this.drawBackground();
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
      var BG_COLORS = ['#FFF', '#DDD'];
      var RATIOS = [0.5, 1.0];
      this.graphics
        .beginLinearGradientFill(BG_COLORS, RATIOS, 0, 0, 0, this.stage.canvas.height)
        .rect(0, 0, this.stage.canvas.width, this.stage.canvas.height)
        .endFill();
    }

    /**
     * Draw the background grid
     */
    drawGrid() {
      const GRID_GAP = 50;
      const GRID_COLOR = '#CCC';
      const LINE_GAP = GRID_GAP / 4;
      var origin = this.moduleController.activeModule.startPos;

      this.graphics.setStrokeDash([GRID_GAP / 2], 1);
      // draw from top to bottom
      for (var x = (origin.x % GRID_GAP); x < this.stage.canvas.width; x += GRID_GAP) {
        this.graphics.beginStroke(GRID_COLOR)
          .moveTo(x, (origin.y % GRID_GAP) - LINE_GAP)
          .lineTo(x, this.stage.canvas.height)
          .endStroke();
      }
      // draw from left to right
      for (var y = (origin.y % GRID_GAP); y < this.stage.canvas.height; y += GRID_GAP) {
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
      var posX = this.moduleController.activeModule.startPos.x;
      var posY = this.moduleController.activeModule.startPos.y;
      var radius = 2;
      this.graphics.beginFill('red')
        .drawCircle(posX, posY, radius)
        .endFill();
    }

    /**
     * Draw each component in the active module
     */
    drawComponents() {
      var me = this;
      this.moduleController.activeModule.components.forEach((component) =>  {
        var location = me.selectionController.getScreenCoords(component.bounds);
        component.paint(me.graphics, location);

        // draw components connectors
        component.connectors.forEach((connector) =>  {
          var connLocScreen = me.selectionController.getScreenCoords(connector.bounds);
          connector.paint(me.graphics, connLocScreen);
        });
        
      });
    }

    /**
     * Draw a selection box around the currently hovered component in the active module
     */
    drawHoveredComponent() {
      var hoveredComp = this.selectionController.getHoveredComponent();
      if (hoveredComp !== null) {
        var location = this.selectionController.getScreenCoords({ x: hoveredComp.bounds.x, y: hoveredComp.bounds.y });
        var padding = 2;
        this.graphics.beginFill('rgba(150,0,0,0.1)')
          .drawRect(
            location.x - (padding / 2),
            location.y - (padding / 2),
            hoveredComp.bounds.width + padding,
            hoveredComp.bounds.height + padding)
          .endFill()
          .beginStroke('rgba(150,0,0,0.2)')
          .setStrokeStyle(2)
          .drawRect(
            location.x - (padding / 2),
            location.y - (padding / 2),
            hoveredComp.bounds.width + padding,
            hoveredComp.bounds.height + padding)
          .endStroke();
      }
    }

    /**
     * Draw a "selected" box around each of the currently selected components
     */
    drawComponentSelections() {
      var me = this;
      this.selectionController.selectedComponents.forEach((component) =>  {
        var location = me.selectionController.getScreenCoords({ x: component.bounds.x, y: component.bounds.y });
        var padding = 2;
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
      var hoveredConn = this.selectionController.getHoveredConnector();
      if (hoveredConn !== null) {
        var location = this.selectionController.getScreenCoords({ x: hoveredConn.bounds.x, y: hoveredConn.bounds.y });
        this.graphics.beginFill('rgba(150,0,0,0.5)')
          .drawCircle(location.x, location.y, hoveredConn.bounds.width)
          .endFill()
          .beginStroke('rgba(150,0,0,1)')
          .setStrokeStyle(2)
          .drawCircle(location.x, location.y, hoveredConn.bounds.width)
          .endStroke();
      }
    }

    /**
     * Draw the previously selected connector
     */
    drawConnectorSelection() {
      var selectedConnector = this.selectionController.getSelectedConnector();
      if (selectedConnector !== null) {
        var location = this.selectionController.getScreenCoords({ x: selectedConnector.bounds.x, y: selectedConnector.bounds.y });
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
      if (this.selectionController.getActiveState() === 'SELECTING') {
        var selectionRect = this.selectionController.getSelectionRect();
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
      var selectedConnector = this.selectionController.getSelectedConnector();
      if (selectedConnector !== null) {
        var connLocation = this.selectionController.getScreenCoords(selectedConnector.bounds);
        var mouseLocation = this.selectionController.getMouseLoc();
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
      var me = this;
      const FLOW_GAP = 10;
      const LINE_SIZE = 6;
      const FLOW_SIZE = LINE_SIZE - 3;
      Object.keys(me.moduleController.getConnectorMap()).forEach((outConnID) =>  {
        var outConn = me.moduleController.activeModule.getConnector(outConnID);
        var outConnLoc = me.selectionController.getScreenCoords(outConn.bounds);
        me.moduleController.getConnectorMap()[outConnID].forEach((inConn) =>  {
          var inConnLoc = me.selectionController.getScreenCoords(inConn.bounds);
          var color = outConn.getState() ? 'rgb(0,100,0)' : 'rgb(0,0,0)';
          var curvePadding = 30;
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

  return DrawController;
});