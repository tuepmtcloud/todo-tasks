import * as uuid from 'uuid'

import { TodoAccess } from '../dataLayer/todosAccess.mjs'
import { AttachmentUtils } from '../fileStorage/attachmentUtils.mjs'

const todoAccess = new TodoAccess()
const attachmentUtils = new AttachmentUtils()

export async function getAllTodos(userId) {
  return await todoAccess.getAllTodos(userId)
}

export async function createTodo(createTodoRequest, userId) {
  const todoId = uuid.v4()
  const createdAt = new Date().toISOString()

  return await todoAccess.createTodo({
    todoId,
    userId,
    attachmentUrl: '',
    dueDate: createTodoRequest.dueDate,
    createdAt,
    name: createTodoRequest.name,
    done: false,
  })
}

export async function todoExists(userId, todoId) {
  return await todoAccess.todoExists(userId, todoId)
}

export async function deleteTodo(userId, todoId) {
    return await todoAccess.deleteTodo(userId, todoId)
}

export async function updateTodo(userId, todoId, updateTodoRequest) {
  return await todoAccess.updateTodo({
    todoId,
    userId,
    ...updateTodoRequest,
  })
}

export async function generateUploadUrl(userId, todoId) {
  return await attachmentUtils.getPresignedURL(userId, todoId)
}

export async function updateAttachmentUrl(userId, todoId) {
  return await todoAccess.updateAttachmentUrl(userId, todoId)
}