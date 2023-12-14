import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { todoExists, updateTodo } from '../../businessLogic/todos.mjs'
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

    const updatedTodo = JSON.parse(event.body)
    const updatedItem = await updateTodo(userId, todoId, updatedTodo)

    return {
      statusCode: 200,
      body: JSON.stringify({
        item: updatedItem
      })
    }
  })
