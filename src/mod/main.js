import { Container, Texture } from "pixi.js"

import { dealSecondLevel, dealThirdLevel } from "../utils"
import Card from "./card"
import Observers from "./observers"

const secondLevelData = new Array(6)
const thirdLevelData = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]

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

    this.secondLevelArr = dealSecondLevel(secondLevelData, this.options.R, this.options.r)
    this.thirdLevelArr = dealThirdLevel(thirdLevelData, this.options.r)

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

    // 第一维度
    const mainRound = this.createRound({
      r: this.options.R,
      data: {},
      coor: [0, 0]
    })
    this.addChild(mainRound)
    // // 第二维度
    // Array.isArray(this.secondLevelArr) &&
    //   this.secondLevelArr.forEach(item => {
    //     const round = this.createRound(item)
    //     this.addChild(round)
    //   })
    // 第三维度
    Array.isArray(this.thirdLevelArr) &&
      this.thirdLevelArr.forEach(item => {
        const round = this.createRound(item)
        this.addChild(round)
      })
  }

  createRound(data) {
    return new Card({
      color: this.options.backgroundRoundColor,
      data,
      onClick: this.options.onClick,
      placeholderTexture: this.placeholderTexture
    })
  }

  onChangeCard = sprite => {
    console.log(sprite)
  }
}

export default MainContainer
