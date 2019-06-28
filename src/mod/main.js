import { Container, Graphics, Sprite, Texture, Text, TextStyle } from "pixi.js"

import { dealSecondLevel } from "../utils"
import Card from "./card"
import Observers from "./observers"

const secondLevelData = new Array(6)

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

    this.arr = dealSecondLevel(secondLevelData, this.options.R, this.options.r)

    this.x = this.options.width / 2
    this.y = this.options.height / 2

    // this.scale.set(1);

    this.onChangeCardFn = this.onChangeCard.bind(this)

    this.init()

    this.addEvent()
  }

  addEvent() {
    Observers.on("change-card-key", this.onChangeCardFn)
  }

  removeEvent() {
    Observers.off("change-card-key", this.onChangeCardFn)
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
