import { Container, Texture } from "pixi.js"

import { dealNodes } from "../utils"
import Card from "./card"
import Line from "./line"
import Observers from "./observers"
import zIndexConfig from "../utils/zIndex"

const defaultProps = {
  R: 80,
  r: 50,
  lineColor: 0xd2e5ee
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
    this.data = { nodes: {}, links: [] }
    try {
      this.data = dealNodes(this.options)
    } catch (e) {
      console.trace(e)
    }

    this.x = this.options.width / 2
    this.y = this.options.height / 2

    this.spriteObj = {}

    this.addEvent()

    this.init()
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

    // links
    this.lines = new Line({
      links: [],
      nodes,
      lineColor: this.options.lineColor,
      zIndex: zIndexConfig.lines[0]
    })
    this.addChild(this.lines)
    // curLines
    this.curLines = new Line({
      links: [],
      nodes,
      zIndex: zIndexConfig.lines[1]
    })
    this.addChild(this.curLines)

    Object.keys(nodes).forEach(key => {
      const item = nodes[key]
      if (typeof item === "object" && item.coor) {
        const id = item.id
        const round = new Card({
          color: this.options.backgroundRoundColor,
          data: item,
          onClick: this.options.onClick,
          placeholderTexture: this.placeholderTexture,
          id
        })
        this.addChild(round)

        if (item.level === 0) {
          this.centreCardID = id
        }

        this.spriteObj[id] = {
          id,
          card: round
        }
      }
    })
    this.centreCardID && Observers.trigger("change-card-key", this.centreCardID)
  }

  onChangeCard = id => {
    Observers.trigger("change-card-zIndex", zIndexConfig.card[0])

    this.centreCardID = id
    try {
      // 显示card
      const item = this.spriteObj[id]
      item.visible = true
      item.card.visible = true
      item.card.zIndex = zIndexConfig.card[2]

      item.card.options.data.links.forEach(item => {
        if (this.spriteObj[item.id]) {
          this.spriteObj[item.id].visible = true
          this.spriteObj[item.id].card.visible = true
          this.spriteObj[item.id].card.zIndex = zIndexConfig.card[1]
        }
      })
      // 绘制关系网
      const { curLinks, links } = this.dealLinks()
      this.lines && this.lines.setLinks(links)
      this.curLines && this.curLines.setLinks(curLinks)
    } catch (e) {
      console.trace(e)
    }
  }

  dealLinks = () => {
    const { links } = this.data
    const obj = {
      curLinks: [],
      links: []
    }

    Array.isArray(links) &&
      links.forEach(item => {
        // 添加当前线
        let isCur = false
        if (item.from === this.centreCardID) {
          isCur = true
        }
        // 普通背景线
        if (
          this.spriteObj[item.from] &&
          this.spriteObj[item.from].visible === true &&
          this.spriteObj[item.to] &&
          this.spriteObj[item.to].visible === true
        ) {
          const link = Object.assign({}, item, {
            color: this.options.linksColors[+item.type]
          })
          obj[isCur ? "curLinks" : "links"].push(link)
        }
      })

    return obj
  }
}

export default MainContainer
