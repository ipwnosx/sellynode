const getTotalPages = require("../helpers/getTotalPages")

class PaginatedRequester {
  constructor(endpoint) {
    this.endpoint = endpoint
  }

  async request(props) {
    const { endpoint } = this
    const { url } = props
    const urlWithPage = page => `${url}?page=${page}`
    const requestWithPage = page =>
      endpoint.request({
        ...props,
        url: urlWithPage(page)
      })

    const response = await requestWithPage(1)
    const totalPages = getTotalPages(response)
    let dataList = response.data

    if (totalPages > 1) {
      const extraRequests = []
      for (let page = 2; page <= totalPages; page++) {
        const newRequest = requestWithPage(page)
        extraRequests.push(newRequest)
      }

      const extraResponses = await Promise.all(extraRequests)
      for (const response of extraResponses) {
        const newData = response.data
        dataList.push(...newData)
      }
    }

    return dataList
  }

  get(url) {
    return this.request({ method: "get", url })
  }
  delete(url) {
    return this.request({ method: "delete", url })
  }
  head(url) {
    return this.request({ method: "head", url })
  }
  post(url, data) {
    return this.request({ method: "post", url, data })
  }
  put(url, data) {
    return this.request({ method: "put", url, data })
  }
  patch(url, data) {
    return this.request({ method: "patch", url, data })
  }
}

module.exports = PaginatedRequester
