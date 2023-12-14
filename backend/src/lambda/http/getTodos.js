import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getAllTodos } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('Processing Event: ', event)

    const userId = getUserId(event)

    const items = await getAllTodos(userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items
      })
    }
  })
