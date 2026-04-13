// Todo Item
// Write your code here
import './index.css'

const TodoItem = props => {
  const {todoItem, deleteTodo} = props
  const {id, title} = todoItem
  const onDelete = () => {
    deleteTodo(id)
  }
  return (
    <li>
      <p>{title}</p>
      <button onClick={onDelete} type="button">
        Delete
      </button>
    </li>
  )
}

export default TodoItem
