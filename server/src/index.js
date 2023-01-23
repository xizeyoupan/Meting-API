import Koa from 'koa'
import cors from '@koa/cors'
import Router from '@koa/router'
import { requestLogger } from './middleware/logger.js'
import errors from './middleware/errors.js'
import apiService from './service/api.js'
import config from './config.js'

const app = new Koa({ proxy: true })

app.use(cors())
app.use(requestLogger)
app.use(errors)

const router = new Router()
router.get(`${config.http.prefix}/api`, apiService)
app.use(router.routes()).use(router.allowedMethods())

app.listen(process.env.PORT || 3000)

export default app;
