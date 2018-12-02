class UpdatingCache {
  constructor({ name, requester, sideEffect, timer }) {
    this.name = name
    this.requester = requester
    this.sideEffect = sideEffect
    this.timer = timer

    console.log(`Updating ${name} cache every ${timer / 1000}s from now on.`)

    this.doRequest()
    setInterval(() => {
      this.doRequest()
    }, timer)
  }

  async doRequest() {
    this.data = await this.requester()
    console.log(`Updated ${this.name} cache.`)

    if (this.sideEffect) this.sideEffect(this.data)
  }
}

module.exports = UpdatingCache
