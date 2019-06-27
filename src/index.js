import * as PIXI from "pixi.js";

const defaultOptions = {
  containerID: "pixi-relationship"
};

/**
 * options:
 *          --key--                         --default--                     --value--
 *          containerID                   pixi-relationship                 string
 *          applicationOptions            null                              object<PIXI.Application - options>
 */
class CanvasApp {
  constructor(options) {
    this.options = Object.assign({}, defaultOptions, options);
    this.element = document.getElementById(this.options.containerID);
    const applicationOptions = Object.assign(
      {},
      this.options.applicationOptions,
      {
        autoStart: false,
        resizeTo: this.element
      }
    );
    this.app = new PIXI.Application(applicationOptions);
    this.element.appendChild(this.app.view);

    this.init();
  }

  init() {
    PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH;

    
  }

  destroy() {}
}

export default CanvasApp;
