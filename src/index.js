import * as PIXI from "pixi.js";

import { createColor } from "./utils";

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
 */
class CanvasApp extends PIXI.Application {
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

    PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH;

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

    this.bgContainer = new PIXI.Container();
    stage.addChild(this.bgContainer);

    const radius = 50;
    const num = (screen.width * screen.height) / Math.pow(radius, 2) / 30;

    for (let i = 0; i < num; i++) {
      const round = this.createRound(radius);
      this.bgContainer.addChild(round);
    }
  }

  initMain() {
    const { stage } = this;

    this.mainContainer = new PIXI.Container();
    stage.addChild(this.mainContainer);
  }

  addEvent() {
    this.ticker.add(this.animate, this);
  }

  removeEvent() {
    this.ticker.remove(this.animate);
  }

  animate(delta) {
    this.bgContainer.children.forEach(round => {
      this.updateRound(round);
    });
  }

  updateRound(round) {
    const WIDTH = this.screen.width;
    const HEIGHT = this.screen.height;
    const PAD = 80;

    round.x += round.vx;
    round.y += round.vy;
    if (round.x > WIDTH + PAD) {
      round.x -= WIDTH + 2 * PAD;
    }
    if (round.x < -PAD) {
      round.x += WIDTH + 2 * PAD;
    }
    if (round.y > HEIGHT + PAD) {
      round.y -= HEIGHT + 2 * PAD;
    }
    if (round.y < -PAD) {
      round.y += HEIGHT + 2 * PAD;
    }
  }

  createRound(radius, texture) {
    const sprite = new PIXI.Sprite(texture);
    const angle = Math.random() * Math.PI * 2;
    const speed = radius * 0.3; // px per second
    sprite.vx = (Math.cos(angle) * speed) / 60.0;
    sprite.vy = (Math.sin(angle) * speed) / 60.0;
    sprite.position.set(
      Math.random() * this.screen.width,
      Math.random() * this.screen.height
    );
    sprite.anchor.set(0.5, 0.5);

    const lightbulb = new PIXI.Graphics();
    const rad = radius * 0.2 + Math.random() * radius * 0.7;
    const color = createColor(this.options.backgroundRoundColor);
    lightbulb.beginFill(color, 0.2 + Math.random() * 0.5);
    lightbulb.drawCircle(0, 0, rad);
    lightbulb.endFill();

    sprite.addChild(lightbulb);

    return sprite;
  }
}

export default CanvasApp;
