import { Graphics, Sprite, TextStyle, Text, Container } from "pixi.js"

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

    this.zIndex = this.options.zIndex
  }

  setLinks = links => {
    this.options.links = links
    this.renderLines()
  }

  init() {
    this.graphics = new Graphics()
    this.addChild(this.graphics)

    this.TextStyle = new TextStyle({
      fontFamily:
        "-apple-system,BlinkMacSystemFont,Segoe UI,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol",
      fontSize: 16,
      fontWeight: 500,
      fill: ["#fff"],
      align: "center"
    })

    this.textContainer = new Container()
    this.addChild(this.textContainer)

    this.renderLines()
  }

  renderLines() {
    const { links, nodes, lineColor } = this.options

    if (Array.isArray(links)) {
      this.graphics.clear()
      this.textContainer.removeChildren()

      links.forEach(item => {
        if (nodes[item.to] && nodes[item.from]) {
          const p1 = nodes[item.to].coor
          const p2 = nodes[item.from].coor
          if (p1 && p2) {
            this.graphics.lineStyle(lineColor ? 2 : 4, lineColor || item.color)
            this.graphics.moveTo(p1[0], p1[1])
            this.graphics.lineTo(p2[0], p2[1])
            this.graphics.closePath()

            if (!lineColor && item.name) {
              const xx = (p1[0] + p2[0]) / 2
              const yy = (p1[1] + p2[1]) / 2
              // 暂时不知道如何自动撑开
              const ww = item.name.length * 12 + 20
              const hh = 20
              this.graphics.beginFill(item.color)
              this.graphics.drawRect(xx - ww / 2, yy - hh / 2, ww, hh)
              this.graphics.endFill()

              const text = new Text(item.name, this.TextStyle)
              text.anchor.set(0.5, 0.5)
              text.position.set(xx, yy)
              this.textContainer.addChild(text)
            }
          }
        }
      })
    }
  }
}

export default LineSprite
