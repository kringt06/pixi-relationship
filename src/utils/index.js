import LineBezier from "./bezier"

export function randomString(len) {
  len = len || 32
  const $chars =
    "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678" /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  const maxPos = $chars.length
  let pwd = ""
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

// color -> number
/**
 * 17-24位表示红色的分量
 * 9-16位表示绿色的分量
 * 1-8位表示蓝色的分量
 * @param color {number 0x}
 */
export function createColor(color) {
  if (typeof color === "undefined") {
    const rr = (Math.random() * 0x80) | 0
    const rg = (Math.random() * 0x80) | 0
    const rb = (Math.random() * 0x80) | 0
    return (rr << 16) + (rg << 8) + rb
  }
  return color + (random0x(0xefefef) << 16) + (random0x(0xefefef) << 8) + random0x(0xefefef)
}

function random0x(num = 0, d = 10) {
  return Math.random() * d * (Math.random() > 0.5 ? 1 : -1) + num
}

export function angleToRadian(angle) {
  return (Math.PI / 180) * angle
}

export function radianToAngle(radian) {
  return radian / (Math.PI / 180)
}

// 计算点位
export function dealNodes({ data = {}, R = 80, r = 50 }) {
  const { nodes, links } = data
  const res = {
    nodes: {},
    links
  }
  const level_1 = {}
  const level_2 = {}
  // 初始化数据
  Array.isArray(nodes) &&
    nodes.forEach(item => {
      let obj
      // 第一维度
      if (item.level === 0) {
        obj = Object.assign({}, item, {
          r: R,
          coor: [0, 0],
          visible: true
        })
      }
      // 第二维度
      else if (item.level === 1) {
        obj = Object.assign({}, item, {
          r,
          visible: true
        })
        level_1[item.id] = obj
      }
      // 第三维度
      else if (item.level === 2) {
        obj = Object.assign({}, item, {
          r,
          visible: false
        })
        level_2[item.id] = obj
      }

      obj && (res.nodes[item.id] = obj)
    })

  // 建立关系连接
  Array.isArray(links) &&
    links.forEach(item => {
      addLinks(res.nodes, {
        id: item.from,
        linkId: item.to,
        name: item.name
      })
      addLinks(res.nodes, {
        id: item.to,
        linkId: item.from,
        name: item.name
      })
    })

  const secondLevelArr = dealSecondLevel(level_1, R, r)
  secondLevelArr.forEach(item => {
    res.nodes[item.id].coor = item.coor
    const links = res.nodes[item.id].links
    for (let i = 0, l = links.length; i < l; i++) {
      if (typeof level_2[links[i].id] === "object" && !level_2[links[i].id].isUse) {
        level_2[links[i].id].isUse = true
        if (!Array.isArray(item.treeLinks)) {
          item.treeLinks = []
        }
        item.treeLinks.push(links[i])
      }
    }
  })

  const coorLineBezier = new LineBezier(r)

  secondLevelArr.forEach((item, index) => {
    dealThirdLevel(coorLineBezier, item, res.nodes)
  })

  console.log(res)
  return res
}

function addLinks(obj, item) {
  if (typeof obj[item.id] !== "object") {
    return
  }

  if (!Array.isArray(obj[item.id].links)) {
    obj[item.id].links = []
  }
  obj[item.id].links.push({
    id: item.linkId,
    name: item.name
  })
}

function dealThirdLevel(coorLineBezier, data, nodes) {
  if (typeof data !== "object" || !Array.isArray(data.treeLinks) || data.treeLinks.length <= 0) {
    return []
  }

  data.treeLinks.forEach((item, index) => {
    const offset = Array.isArray(data.coor) ? data.coor : [0, 0]
    let coor = coorLineBezier.getCoor(index)
    // 变换起始角度
    coor = [coor[1], -1 * coor[0]]
    // 添加旋转角度
    coor = angleToCorr(coor, data.angle)
    // 添加偏移量
    nodes[item.id].coor = [coor[0] + offset[0], coor[1] + offset[1]]
  })
}

function angleToCorr(coor, angle) {
  const alpha = angleToRadian(angle)
  return [
    coor[0] * Math.cos(alpha) - coor[1] * Math.sin(alpha),
    coor[0] * Math.sin(alpha) + coor[1] * Math.cos(alpha)
  ]
}

// R > r (*)
function dealSecondLevel(obj, R, r) {
  const keysArr = Object.keys(obj)
  if (!Array.isArray(keysArr) || keysArr.length <= 0) {
    return []
  }

  const len = keysArr.length
  const angle = 360 / len
  const radiusMin = 2 * (r + R)
  let arr = []
  let radius = radiusMin
  let deviationAngle = 0
  if (keysArr.length > 2) {
    const angle = 360 / len
    const distanceMin = 4 * r
    const sinAngle = Math.sin(angleToRadian(angle / 2)) * 2
    let distance = Math.ceil(radius * sinAngle)
    if (distance < distanceMin) {
      distance = distanceMin
      radius = Math.ceil(distance / sinAngle)
    }
  } else {
    deviationAngle = 90
  }

  for (let i = 0; i < len; i++) {
    const angleNew = angle * i - deviationAngle
    arr.push({
      angle: angleNew,
      id: obj[keysArr[i]].id,
      coor: angleToCorr([0, -1 * radius], angleNew)
    })
  }

  return arr
}
