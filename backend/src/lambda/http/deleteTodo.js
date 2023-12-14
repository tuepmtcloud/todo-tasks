import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'
import { deleteTodo, todoExists } from '../../businessLogic/todos.mjs'
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

    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)

    const isExist = await todoExists(userId, todoId)

    if (!isExist) {
      throw createError(
        404,
        JSON.stringify({
          error: 'Todo does not exist'
        })
      )
    }

    await deleteTodo(userId, todoId)

    return {
      statusCode: 204
    }
  })
