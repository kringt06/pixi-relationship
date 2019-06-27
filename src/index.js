import { Application, settings, PRECISION } from "pixi.js";

import BackgroundContainer from "./mod/background";
import MainContainer from "./mod/main";

const defaultProps = {
  containerID: "pixi-relationship",
  backgroundRoundColor: 0xceefff,
  applicationOptions: {
    backgroundColor: 0xceefff
  }
};

/**
 * props:
 *          --key--                         --default--                     --value--
 *          containerID                   pixi-relationship                 string
 *          applicationOptions            null                              object<PIXI.Application - options>
 *          backgroundRoundColor          0xceefff                          0x...  number
 */
class CanvasApp extends Application {
  constructor(props = {}) {
    const options = Object.assign({}, defaultProps, props);
    const domElement = document.getElementById(options.containerID);

    super(
      Object.assign(
        {},
        defaultProps.applicationOptions,
        options.applicationOptions,
        { autoStart: false, resizeTo: domElement }
      )
    );

    this.options = options;

    settings.PRECISION_FRAGMENT = PRECISION.HIGH;

    domElement.appendChild(this.view);

    this.domElement = domElement;
  }

  /**
   * Convenience for getting resources
   * @member {object}
   */
  get resources() {
    return this.loader.resources;
  }

  /**
   * Load resources
   * @param {object} manifest Collection of resources to load
   */
  load(manifest, callback) {
    this.loader.add(manifest).load(() => {
      callback && callback();
      this.init();
    });
  }

  init() {
    this.initBackground();
    this.initMain();

    this.addEvent();

    this.start();
  }

  initBackground() {
    const { stage, screen } = this;
    const radius = 50;
    const bgContainer = new BackgroundContainer({
      radius,
      backgroundRoundColor: this.options.backgroundRoundColor,
      width: screen.width,
      height: screen.height,
      num: (screen.width * screen.height) / Math.pow(radius, 2) / 30
    });
    stage.addChild(bgContainer);
  }

  initMain() {
    const { stage } = this;
    const mainContainer = new MainContainer();
    stage.addChild(mainContainer);
  }

  addEvent() {
    this.ticker.add(this.animate, this);
  }

  removeEvent() {
    this.ticker.remove(this.animate);
  }

  animate(delta) {
    const { stage } = this;
    Array.isArray(stage.children) &&
      stage.children.forEach(item => {
        typeof item.animate === "function" && item.animate(delta);
      });
  }
}

export default CanvasApp;
