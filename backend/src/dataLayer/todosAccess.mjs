import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

export class TodoAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todosTable = process.env.TODOS_TABLE
  ) {
    this.documentClient = documentClient
    this.todosTable = todosTable
    this.dynamoDbClient = DynamoDBDocument.from(this.documentClient)
  }

  async getAllTodos(userId) {
    console.log(`Getting all todos of user ${userId}`)

    const result = await this.dynamoDbClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false,
    })
    return result.Items
  }

  async createTodo(todo) {
    console.log(`Creating a todo with todoId ${todo.todoId}`)

    await this.dynamoDbClient.put({
      TableName: this.todosTable,
      Item: todo
    })

    return todo
  }

  async todoExists(userId, todoId) {
    console.log(`find todo with todoId ${todoId} of user ${userId}`)

    const result = await this.dynamoDbClient.get({
      TableName: this.todosTable,
      Key: {
        userId,
        todoId
      }
    })
    return !!result.Item
  }

  async deleteTodo(userId, todoId) {
    console.log(`delete todo with todoId ${todoId} of user ${userId}`)

    return await this.dynamoDbClient.delete({
      TableName: this.todosTable,
      Key: {
        userId,
        todoId
      }
    })
  }

  async updateTodo(todo) {
    console.log(`Updating a todo with todoId ${todo.todoId}`)

    return await this.dynamoDbClient.update({
      TableName: this.todosTable,
      Key: {
        userId: todo.userId,
        todoId: todo.todoId
      },
      UpdateExpression: 'set #todo_name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
        "#todo_name": "name"
      },
      ExpressionAttributeValues: {
        ':name': todo.name,
        ':dueDate': todo.dueDate,
        ':done': todo.done
      },
      ReturnValues: 'UPDATED_NEW'
    })
  }

  async updateAttachmentUrl(userId, todoId) {
    console.log('updateAttachmentUrl', userId, todoId);
    return await this.dynamoDbClient.update({
      TableName: this.todosTable,
      Key: {
        userId,
        todoId
      },
      UpdateExpression: 'set attachmentUrl = :url',
      ExpressionAttributeValues: {
        ':url': `https://${process.env.IMAGES_S3_BUCKET}.s3.amazonaws.com/${userId}/${todoId}`
      },
      ReturnValues: 'UPDATED_NEW'
    })
  }
}
