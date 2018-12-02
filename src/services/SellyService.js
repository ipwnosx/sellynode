const axios = require("axios")
const currency = require("currency-formatter")
const PaginatedRequester = require("../classes/PaginatedRequester")
const config = require("../../config.json")

const authorization = Buffer.from(config.email + ":" + config.apiKey).toString(
  "base64"
)

class SellyService {
  constructor() {
    const sellyEndpoint = axios.create({
      baseURL: "https://selly.gg/api/v2/",
      headers: {
        Authorization: `Basic ${authorization}`
      }
    })

    const paginatedRequester = new PaginatedRequester(sellyEndpoint)

    this.sellyEndpoint = sellyEndpoint
    this.paginatedRequester = paginatedRequester
  }

  async getProducts() {
    const allProducts = await this.paginatedRequester.get("/products")

    const mappedProducts = allProducts.map(product => {
      const { id, image, title, stock } = product
      const price = currency.format(parseFloat(product.price), {
        code: product.currency
      })

      return { id, image, title, stock, price }
    })

    return mappedProducts
  }
}

module.exports = SellyService
