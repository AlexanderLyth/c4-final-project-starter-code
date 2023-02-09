import { TodosAcess as TodosAcess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as AWS from 'aws-sdk'

// TODO: Implement businessLogic

const logger = createLogger('Todos business logic')
const bucket = process.env.ATTACHMENT_S3_BUCKET
const signedUrlExpirationTime = process.env.SIGNED_URL_EXPIRATION
const todoAcess = new TodosAcess();
const attachmentUtils = new AttachmentUtils();

const s3Bucket = new AWS.S3({
  signatureVersion: 'v4'
})


  export async function getTodosFromUser(userId: string): Promise<TodoItem[]> {
    return todoAcess.getTodosFromUser(userId);
  }
  
  export async function createTodo(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
  
    const todoId = uuid.v4()
  
    return await todoAcess.createTodo({
      todoId: todoId,
      userId: userId,
      name: createTodoRequest.name,
      dueDate: createTodoRequest.dueDate,
      createdAt: new Date().toISOString(),
      done: false
    })
  }
  
  export async function updateTodo(todoId: string, userId: string, updateTodoRequest: UpdateTodoRequest): Promise<TodoUpdate> {

    return await todoAcess.updateTodo(todoId, userId, {
      name: updateTodoRequest.name,
      dueDate: updateTodoRequest.dueDate,
      done: updateTodoRequest.done
    })
  }
  
  export async function deleteTodo(todoId: string, userId: string) {

    await todoAcess.deleteTodo(todoId, userId)
  }
  
  export async function createAttachmentPresignedUrl (todoId: string, userId: string) {

    logger.info('create presigned url for attachments')

    const imageUUID = uuid.v4()
    const imageUrl = `https://${bucket}.s3.amazonaws.com/${imageUUID}`

    await attachmentUtils.updateAttachmentUrl(todoId, userId, imageUrl)

    return getUploadUrl(imageUUID)
  }
  
  function getUploadUrl(imageId: string) {

    logger.info('upload url')

    return s3Bucket.getSignedUrl('putObject', {
      Bucket: bucket,
      Key: imageId,
      Expires: Number(signedUrlExpirationTime)
    })
  }