import { Container } from "pixi.js";

/**
 * options
 *      R                    (*)                               R > r
 *      r                    (*)
 */
class MainContainer extends Container {
  constructor(options) {
    super();

    // this.options = options;
    this.options = {
      R: 100,
      r: 60
    };

    this.init();
  }

  init() {}
}

export default MainContainer;
