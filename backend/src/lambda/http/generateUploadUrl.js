import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { generateUploadUrl } from '../../businessLogic/todos.mjs'
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
    const todoId = event.pathParameters.todoId

    const uploadUrl = await generateUploadUrl(userId, todoId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl
      })
    }
  })
