import { Container, Texture } from "pixi.js"

import { dealNodes } from "../utils"
import Card from "./card"
import Observers from "./observers"

const defaultProps = {
  R: 80,
  r: 50
}

/**
 * options
 *      R                    (*)                               R > r
 *      r                    (*)
 */
class MainContainer extends Container {
  constructor(options) {
    super()

    this.options = Object.assign({}, defaultProps, options)

    this.data = { nodes: {}, links: [] }
    try {
      this.data = dealNodes(this.options)
    } catch (e) {
      console.trace(e)
    }

    this.x = this.options.width / 2
    this.y = this.options.height / 2

    this.init()

    this.addEvent()
  }

  addEvent() {
    Observers.on("change-card-key", this.onChangeCard)
  }

  removeEvent() {
    Observers.off("change-card-key", this.onChangeCard)
  }

  init() {
    if (this.options.placeholderImg) {
      this.placeholderTexture = Texture.from(this.options.placeholderImg)
    }

    Object.keys(this.data.nodes).forEach(key => {
      if (typeof this.data.nodes[key] === "object" && this.data.nodes[key].coor) {
        const round = new Card({
          color: this.options.backgroundRoundColor,
          data: this.data.nodes[key],
          onClick: this.options.onClick,
          placeholderTexture: this.placeholderTexture
        })
        this.addChild(round)
      }
    })
  }

  onChangeCard = sprite => {
    // console.log(sprite)
  }
}

export default MainContainer
