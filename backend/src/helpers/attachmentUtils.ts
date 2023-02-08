import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
const AWSXRay = require('aws-xray-sdk');
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('AttachmentUtils')

// TODO: Implement the fileStogare logic

export class AttachmentUtils {

    constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly todoTable = process.env.TODOS_TABLE
    ) {}
  
    async updateAttachmentUrl(todoId: string, userId: string, url: string): Promise<string> {

      logger.info("URL generation");
  
      await this.docClient.update({
        TableName: this.todoTable,
        Key: {
          todoId: todoId,
          userId: userId
        },
        UpdateExpression: "set attachmentUrl = :url",
        ExpressionAttributeValues: {
          ":url": url,
        }
      }).promise()
    
      return url
    }
  }
  
  function createDynamoDBClient() {  
    
    return new XAWS.DynamoDB.DocumentClient()
  }