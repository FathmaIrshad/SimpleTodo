// Todo Item
// Write your code here
import {useState} from 'react'
import './index.css'

const TodoItem = props => {
  const {todoItem, deleteTodo, editTodo, toggleComplete} = props
  const {id, title, completed} = todoItem
  const [editedText, editText] = useState(title)
  const [currentStatusEdit, changeStatus] = useState(true)

  const onDelete = () => {
    deleteTodo(id)
  }
  const onClickEdit = () => {
    changeStatus(!currentStatusEdit)
  }
  const onChangeEditText = event => {
    editText(event.target.value)
  }
  const onClickSave = () => {
    editTodo(id, editedText)
    changeStatus(!currentStatusEdit)
  }
  // Apply a CSS class if completed
  const titleClassName = completed === 1 ? 'completed-task' : ''

  return (
    <li className="todo-item">
      <input
        type="checkbox"
        className="checkbox"
        checked={completed === 1}
        onChange={() => toggleComplete(id, completed)}
      />
      {currentStatusEdit ? (
        <p className={titleClassName}>{title}</p>
      ) : (
        <input
          type="text"
          value={editedText}
          onChange={onChangeEditText}
          className="edit-input"
        />
      )}
      <div className="button-group">
        {currentStatusEdit ? (
          <button className="edit-save-btn" type="button" onClick={onClickEdit}>
            Edit
          </button>
        ) : (
          <button
            className="edit-save-btn"
            type="button"
            onClick={onClickSave}
            name="Save"
          >
            Save
          </button>
        )}
        <button className="delete-btn" onClick={onDelete} type="button">
          Delete
        </button>
      </div>
    </li>
  )
}

export default TodoItem
