import { Container, Sprite, Graphics } from "pixi.js"

import { createColor } from "../utils"

/**
 * options
 *      radius                    (*)     number
 *      backgroundRoundColor
 *      width                     (*)     number
 *      height                    (*)     number
 *      num                       (*)     number
 */
class BackgroundContainer extends Container {
  constructor(options) {
    super()

    this.options = options

    this.init()
  }

  init() {
    for (let i = 0; i < this.options.num; i++) {
      const round = this.createRound(this.options.radius)
      this.addChild(round)
    }
  }

  animate(delta) {
    this.children.forEach(round => {
      this.updateRound(round)
    })
  }

  updateRound(round) {
    const WIDTH = this.options.width
    const HEIGHT = this.options.height
    const PAD = 80

    round.x += round.vx
    round.y += round.vy
    if (round.x > WIDTH + PAD) {
      round.x -= WIDTH + 2 * PAD
    }
    if (round.x < -PAD) {
      round.x += WIDTH + 2 * PAD
    }
    if (round.y > HEIGHT + PAD) {
      round.y -= HEIGHT + 2 * PAD
    }
    if (round.y < -PAD) {
      round.y += HEIGHT + 2 * PAD
    }
  }

  createRound(radius, texture) {
    const sprite = new Sprite(texture)
    const angle = Math.random() * Math.PI * 2
    const speed = radius * 0.3 // px per second
    sprite.vx = (Math.cos(angle) * speed) / 60.0
    sprite.vy = (Math.sin(angle) * speed) / 60.0
    sprite.position.set(Math.random() * this.options.width, Math.random() * this.options.height)
    sprite.anchor.set(0.5, 0.5)

    const lightbulb = new Graphics()
    const rad = radius * 0.2 + Math.random() * radius * 0.7
    const color = createColor(this.options.backgroundRoundColor)
    lightbulb.beginFill(color, 0.2 + Math.random() * 0.5)
    lightbulb.drawCircle(0, 0, rad)
    lightbulb.endFill()

    sprite.addChild(lightbulb)

    return sprite
  }
}

export default BackgroundContainer
