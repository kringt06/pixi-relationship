import { Graphics, Sprite } from "pixi.js"

import Observers from "./observers"
import zIndexConfig from "../utils/zIndex"

const defaultProps = {
  links: [],
  nodes: {}
}

class LineSprite extends Sprite {
  constructor(options) {
    super()

    this.options = Object.assign({}, defaultProps, options)

    this.id = this.options.id

    this.init()

    this.addEvent()
  }

  addEvent() {
    Observers.on("change-card-key", this.onTriggerClearHover)
  }

  removeEvent() {
    Observers.off("change-card-key", this.onTriggerClearHover)
  }

  init() {
    const { links, nodes } = this.options
    const graphics = new Graphics()
    graphics.lineStyle(2, 0xcedfe6, 0.5)
    this.addChild(graphics)

    Array.isArray(links) &&
      links.forEach(item => {
        if (nodes[item.id] && nodes[item.linkId]) {
          const p1 = nodes[item.linkId].coor
          const p2 = nodes[item.id].coor
          const dd = nodes[item.id].r
          if (p1 && p2) {
            graphics.moveTo(p1[0], p1[1])
            graphics.lineTo(p2[0], p2[1])
            graphics.closePath()
          }
        }
      })

    // this.visible = false
  }

  onTriggerClearHover = ({ id }) => {
    this.zIndex = zIndexConfig.lines[0]
    if (id !== this.id) {
    } else {
      // this.visible = true
    }
  }
}

export default LineSprite
