const Koa = require("koa")
const Router = require("koa-router")
const serveStatic = require("koa-static")
const { join } = require("path")
const ejs = require("ejs")
const { promisify } = require("util")
const SellyService = require("./services/SellyService")
const UpdatingCache = require("./classes/UpdatingCache")

const port = parseInt(process.env.PORT || "3000")
const templateFile = join(__dirname, "template.ejs")

const renderFile = promisify(ejs.renderFile)
const renderTemplate = data => renderFile(templateFile, data)

startApp()

async function startApp() {
  const sellyService = new SellyService()

  let renderedTemplate = ""

  new UpdatingCache({
    name: "product",
    timer: 1000 * 60 * 60, // 1 hour
    requester: () => sellyService.getProducts(),
    sideEffect: async products => {
      renderedTemplate = await renderTemplate({ products })
    }
  })

  const app = new Koa()
  const router = new Router()

  router.get("/", context => {
    context.body = renderedTemplate
  })

  app.use(serveStatic(join(__dirname, "../", "assets")))
  app.use(router.routes())
  app.use(router.allowedMethods())

  app.listen(port)
  console.log(`App open on http://localhost:${port}`)
}
