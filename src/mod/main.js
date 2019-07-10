import { Container, Texture } from "pixi.js"

import { dealNodes, randomString } from "../utils"
import Card from "./card"
import Line from "./line"
import Observers from "./observers"

const defaultProps = {
  R: 80,
  r: 50
}

/**
 * options
 *      R                    (*)                               R > r
 *      r                    (*)
 *      data
 *      linksColors
 */
class MainContainer extends Container {
  constructor(options) {
    super()

    this.options = Object.assign({}, defaultProps, options)

    this.data = { nodes: {} }
    try {
      this.data = dealNodes(this.options)
    } catch (e) {
      console.trace(e)
    }

    this.x = this.options.width / 2
    this.y = this.options.height / 2

    this.spriteObj = {}

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
    this.sortableChildren = true

    const { nodes } = this.data

    Object.keys(nodes).forEach(key => {
      const item = nodes[key]
      if (typeof item === "object" && item.coor) {
        const id = randomString(32)
        // links
        const lines = new Line({
          links: item.links,
          nodes,
          id
        })
        this.addChild(lines)

        // card
        const round = new Card({
          color: this.options.backgroundRoundColor,
          data: item,
          onClick: this.options.onClick,
          placeholderTexture: this.placeholderTexture,
          id
        })
        this.addChild(round)

        if (item.level === 0) {
          this.centreCard = round
        }

        this.spriteObj[id] = {
          cardId: item.id,
          id,
          card: round,
          lines
        }
      }
    })

    // 设置当前状态
    this.centreCard && Observers.trigger("change-card-key", this.centreCard)
  }

  onChangeCard = sprite => {
    const item = this.spriteObj[sprite.id]

    console.log(item)
  }
}

export default MainContainer
