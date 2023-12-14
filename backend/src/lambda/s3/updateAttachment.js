import { updateAttachmentUrl } from '../../businessLogic/todos.mjs'

export async function handler(event) {
  console.log('Processing S3 event ', JSON.stringify(event))

  const s3ObjectKey = decodeURI(event.Records[0].s3.object.key)
  const [userId, todoId] = s3ObjectKey.split('/')

  await updateAttachmentUrl(userId, todoId)
}
