import { Container, Graphics, Sprite, Texture, Text, TextStyle } from "pixi.js"

import { dealSecondLevel } from "../utils"
import Card from "./card"
import Observers from "./observers"

const secondLevelData = new Array(6)

const defaultProps = {
  R: 80,
  r: 50
}

const maxZoom = 1
const minZoom = 0.1
const disScale = 0.01

/**
 * options
 *      R                    (*)                               R > r
 *      r                    (*)
 */
class MainContainer extends Container {
  constructor(options) {
    super()

    this.options = Object.assign({}, defaultProps, options)

    this.arr = dealSecondLevel(secondLevelData, this.options.R, this.options.r)

    this.x = this.options.width / 2
    this.y = this.options.height / 2

    this.onChangeCardFn = this.onChangeCard.bind(this)
    this.onChangeScaleFn = this.onChangeScale.bind(this)

    this.init()

    this.addEvent()
  }

  onChangeScale(delta) {
    let x = this.scale._x
    // 放大
    if (delta < 0) {
      x -= disScale
      if (x >= minZoom) {
        this.scale.set(x)
      }
    }
    // 缩小
    else if (delta > 0) {
      x += disScale
      if (x <= maxZoom) {
        this.scale.set(x)
      }
    }
  }

  addEvent() {
    Observers.on("change-card-key", this.onChangeCardFn)
    Observers.on("mousewheel-change", this.onChangeScaleFn)
  }

  removeEvent() {
    Observers.off("change-card-key", this.onChangeCardFn)
    Observers.off("mousewheel-change", this.onChangeScaleFn)
  }

  init() {
    if (this.options.placeholderImg) {
      this.placeholderTexture = Texture.from(this.options.placeholderImg)
    }

    // 第一维度
    const mainRound = this.createRound({
      r: this.options.R,
      data: {},
      coor: [0, 0]
    })
    this.addChild(mainRound)
    // 第二维度
    for (let i = 0, len = this.arr.length; i < len; i++) {
      const round = this.createRound(this.arr[i])
      this.addChild(round)
    }
  }

  createRound(data) {
    return new Card({
      color: this.options.backgroundRoundColor,
      data,
      onClick: this.options.onClick,
      placeholderTexture: this.placeholderTexture
    })
  }

  onChangeCard(sprite) {
    console.log(sprite)
  }
}

export default MainContainer
