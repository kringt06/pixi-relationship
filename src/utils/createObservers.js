class createObservers {
  constructor(id) {
    this.id = id
    this.onObj = {}
    this.oneObj = {}
  }

  reset() {
    this.onObj = {}
    this.oneObj = {}
  }

  on(key, fn) {
    if (this.onObj[key] === undefined) {
      this.onObj[key] = []
    }

    this.onObj[key].push(fn)
  }

  one(key, fn) {
    if (this.oneObj[key] === undefined) {
      this.oneObj[key] = []
    }

    this.oneObj[key].push(fn)
  }

  off(key, fn) {
    let onObjNews = []
    let oneObjNews = []
    if (typeof fn === "function") {
      Array.isArray(this.onObj[key]) &&
        this.onObj[key].forEach(item => {
          if (item !== fn) {
            onObjNews.push(item)
          }
        })
      Array.isArray(this.oneObj[key]) &&
        this.oneObj[key].forEach(item => {
          if (item !== fn) {
            oneObjNews.push(item)
          }
        })
    }

    this.onObj[key] = onObjNews
    this.oneObj[key] = oneObjNews
  }

  trigger() {
    let key, args
    if (arguments.length == 0) {
      return false
    }
    key = arguments[0]
    args = [].concat(Array.prototype.slice.call(arguments, 1))

    Array.isArray(this.onObj[key]) &&
      this.onObj[key].forEach(item => {
        item.apply(null, args)
      })

    if (Array.isArray(this.oneObj[key]) && this.oneObj[key].length > 0) {
      this.oneObj[key].forEach(item => {
        item.apply(null, args)
        item = undefined
      })
      this.oneObj[key] = []
    }
  }
}

export default createObservers
