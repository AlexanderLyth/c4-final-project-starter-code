/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateTodoRequest {
  name: string,
  minLength: 2
  dueDate: string
  done: boolean
}