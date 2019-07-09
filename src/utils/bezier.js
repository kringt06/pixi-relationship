export default class {
  constructor(r) {
    // 贝尔塞斯曲线
    const p1 = [0, 0]
    const p2 = [59, -119]
    const p3 = [220, 18]
    const p4 = [86, 264]
    const timeArr = (function(startNum, d) {
      const arr = []
      let i = 0
      while (startNum + i * d - i * 0.05 < 1) {
        arr.push(startNum + i * d - i * 0.05)
        i++
      }
      return arr
    })(0.3, 0.15)
    this.maxBezierNum = timeArr.length
    let threeBezierArr = []
    timeArr.forEach(item => {
      threeBezierArr.push(threeBezier(item, p1, p2, p3, p4))
    })
    // 倍数
    const ba = distanceByCoor(threeBezierArr[0], threeBezierArr[1]) / (2 * r + 30)
    const newThreeBezierArr = [] // 注意至少要又2个点
    Array.isArray(threeBezierArr) &&
      threeBezierArr.forEach(item => {
        newThreeBezierArr.push([item[0] / ba, (item[1] * -1) / ba])
      })

    // 直线
    this.radianK = Math.atan(
      ((p4[1] - newThreeBezierArr[this.maxBezierNum - 1][1]) * -1) /
        (p4[0] - newThreeBezierArr[this.maxBezierNum - 1][0])
    )
    this.dd = distanceByCoor(
      newThreeBezierArr[this.maxBezierNum - 2],
      newThreeBezierArr[this.maxBezierNum - 1]
    )

    this.newThreeBezierArr = newThreeBezierArr
  }

  /**
   *
   * @param {*} index
   * @param  offset 偏移量 [x, y]
   */
  getCoor(index) {
    const { maxBezierNum, radianK, dd, newThreeBezierArr } = this

    let coor
    // 曲线
    if (index < maxBezierNum) {
      coor = newThreeBezierArr[index]
    }
    // 直线
    else {
      coor = [
        newThreeBezierArr[maxBezierNum - 1][0] - dd * (index - maxBezierNum) * Math.cos(radianK),
        newThreeBezierArr[maxBezierNum - 1][1] - dd * (index - maxBezierNum) * Math.sin(radianK)
      ]
    }

    return coor
  }
}

function distanceByCoor(p1, p2) {
  return parseInt(Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2)))
}

// /**
//  * @desc 一阶贝塞尔
//  * @param {number} t 当前百分比
//  * @param {Array} p1 起点坐标
//  * @param {Array} p2 终点坐标
//  */
// function oneBezier(t, p1, p2) {
//   const [x1, y1] = p1
//   const [x2, y2] = p2
//   let x = x1 + (x2 - x1) * t
//   let y = y1 + (y2 - y1) * t
//   return [x, y]
// }

// /**
//  * @desc 二阶贝塞尔
//  * @param {number} t 当前百分比
//  * @param {Array} p1 起点坐标
//  * @param {Array} p2 终点坐标
//  * @param {Array} cp 控制点
//  */
// function twoBezier(t, p1, cp, p2) {
//   const [x1, y1] = p1
//   const [cx, cy] = cp
//   const [x2, y2] = p2
//   let x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2
//   let y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2
//   return [x, y]
// }

/**
 * @desc 三阶贝塞尔
 * @param {number} t 当前百分比
 * @param {Array} p1 起点坐标
 * @param {Array} p2 终点坐标
 * @param {Array} cp1 控制点1
 * @param {Array} cp2 控制点2
 */
function threeBezier(t, p1, cp1, cp2, p2) {
  const [x1, y1] = p1
  const [x2, y2] = p2
  const [cx1, cy1] = cp1
  const [cx2, cy2] = cp2
  let x =
    x1 * (1 - t) * (1 - t) * (1 - t) +
    3 * cx1 * t * (1 - t) * (1 - t) +
    3 * cx2 * t * t * (1 - t) +
    x2 * t * t * t
  let y =
    y1 * (1 - t) * (1 - t) * (1 - t) +
    3 * cy1 * t * (1 - t) * (1 - t) +
    3 * cy2 * t * t * (1 - t) +
    y2 * t * t * t
  return [x, y]
}
