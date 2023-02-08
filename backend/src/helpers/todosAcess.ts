import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
const AWSXRay = require('aws-xray-sdk');
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('TodosAcess')

// TODO: Implement the dataLayer logic

export class TodosAcess {
  private readonly docClient: DocumentClient;
  private readonly todosTable: string;
  private readonly todoCreatedAtIndex: string;

  constructor() {
      this.docClient = createDynamoDBClient();
      this.todosTable = process.env.TODOS_TABLE;
      this.todoCreatedAtIndex = process.env.TODOS_CREATED_AT_INDEX;
  }
  
    async getTodosFromUser(userId: string): Promise<TodoItem[]> {
    
      logger.info('Get all todos from the current user')
  
      const result = await this.docClient.query({
        TableName: this.todosTable,
        IndexName: this.todoCreatedAtIndex,
        KeyConditionExpression: 'userId = :pk',
        ExpressionAttributeValues: {
          ':pk': userId
        }
      }).promise()
  
      const todos = result.Items
      return todos as TodoItem[]
    }
  
    async createTodo(todoItem: TodoItem): Promise<TodoItem> {

      logger.info('Create todo item')
  
      await this.docClient.put({
        TableName: this.todosTable,
        Item: todoItem
      }).promise()
  
      return todoItem
    }
  
    async updateTodo(todoId: string, userId: string, updateTodoItem: TodoUpdate): Promise<TodoUpdate> {
        
      logger.info('Update todo item')
  
      await this.docClient.update({
        TableName: this.todosTable,
        Key: {
          todoId: todoId,
          userId: userId
        },
        UpdateExpression: "set #todo_name = :name, dueDate = :dueDate, done = :done",
        ExpressionAttributeNames: {
          '#todo_name': 'name',
        },
        ExpressionAttributeValues: {
          ":name": updateTodoItem.name,
          ":dueDate": updateTodoItem.dueDate,
          ":done": updateTodoItem.done
        }
      }).promise()
  
      return updateTodoItem
    }
  
    async deleteTodo(todoId: string, userId: string) {

      logger.info('Delete todo item')
  
      await this.docClient.delete({
        TableName: this.todosTable,
        Key: {
          todoId: todoId,
          userId: userId
        }
      }, (err) => {
        if (err) {
          throw new Error("")
        }
      }).promise()
    }
  
  }
  
  function createDynamoDBClient() {

    return new XAWS.DynamoDB.DocumentClient()
  }