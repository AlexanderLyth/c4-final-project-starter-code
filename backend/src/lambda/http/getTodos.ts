import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getTodosFromUser as getTodosFromUser } from '../../helpers/todos'
import { getUserId } from '../utils';

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    // Write your code here
    
    const userId = getUserId(event)
    const todosFromUser = await getTodosFromUser(userId)
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todosFromUser
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
