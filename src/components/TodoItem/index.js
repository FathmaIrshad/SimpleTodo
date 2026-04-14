// Todo Item
// Write your code here
import {useState} from 'react'
import './index.css'

const TodoItem = props => {
  const {todoItem, deleteTodo, editTodo} = props
  const {id, title} = todoItem
  const [editedText, editText] = useState(title)
  const [currentStatusEdit, changeStatus] = useState(true)
  const [todochecked, toggleTodocheckbox] = useState(false)
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

  return (
    <li className="todo-item">
      <input
        type="checkbox"
        className="checkbox"
        value={todochecked}
        onChange={() => toggleTodocheckbox(!todochecked)}
      />
      {currentStatusEdit ? (
        <p className={todochecked ? 'strike-through' : ''}>{title}</p>
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
