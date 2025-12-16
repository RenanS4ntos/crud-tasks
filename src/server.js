import http from 'node:http'

import { json } from './middlewares/json.js'
import { routes } from './routes.js';
import { extractQueryParams } from './utils/extract-query-params.js';

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if (route) {
    const routeParams = req.url.match(route.path)

    const { query, ...params } = routeParams.groups

    const queryParams = query ? extractQueryParams(query) : {}

    req.params = params
    req.query = queryParams

    return route.handler(req, res)
  }

  return res.writeHead(404).end();
});

server.listen(3333, () => console.log('Server is running on PORT 3333 🚀'));