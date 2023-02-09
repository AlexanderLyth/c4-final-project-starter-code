/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateTodoRequest {
  name: string,
  minLength: 2
  dueDate: string
}
