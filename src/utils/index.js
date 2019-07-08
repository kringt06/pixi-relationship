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

// R > r (*)
export function dealSecondLevel(data, R, r) {
  if (!Array.isArray(data) || data.length <= 0) {
    return []
  }

  const len = data.length
  const angle = 360 / len
  const radiusMin = 2 * (r + R)
  let arr = []
  let radius = radiusMin
  let deviationAngle = 0
  if (data.length > 2) {
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
    arr.push({
      r,
      radius,
      data: data[i],
      coor: dealCoorByRadius(radius, angle * i - deviationAngle)
    })
  }

  return arr
}

// xy第1、4象限中线为起点，顺时针转动
function dealCoorByRadius(radius, angle) {
  let ax
  let ay
  let aAngle
  // 1
  if (angle <= 90) {
    ax = 1
    ay = 1
    aAngle = angle
  }
  // 2
  else if (angle <= 180) {
    ax = 1
    ay = -1
    aAngle = 180 - angle
  }
  // 3
  else if (angle <= 270) {
    ax = -1
    ay = -1
    aAngle = angle - 180
  }
  // 4
  else {
    ax = -1
    ay = 1
    aAngle = 360 - angle
  }

  const radian = angleToRadian(aAngle)
  const x = Math.ceil(ax * radius * Math.sin(radian))
  // canvas坐标轴中Y是反向的，所以 * -1
  const y = Math.ceil(ay * radius * Math.cos(radian)) * -1
  return [x, y]
}

export function angleToRadian(angle) {
  return (Math.PI / 180) * angle
}

export function radianToAngle(radian) {
  return radian / (Math.PI / 180)
}

export function dealThirdLevel(data, r) {
  if (!Array.isArray(data) || data.length <= 0) {
    return []
  }

  const coorLineBezier = new LineBezier(r)

  const res = []

  console.log(res)

  return res
}
