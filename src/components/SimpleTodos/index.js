import {Component} from 'react'
import TodoItem from '../TodoItem/index'
import './index.css'

const initialTodosList = [
  {
    id: 1,
    title: 'Book the ticket for today evening',
  },
  {
    id: 2,
    title: 'Rent the movie for tomorrow movie night',
  },
  {
    id: 3,
    title: 'Confirm the slot for the yoga session tomorrow morning',
  },
  {
    id: 4,
    title: 'Drop the parcel at Bloomingdale',
  },
  {
    id: 5,
    title: 'Order fruits on Big Basket',
  },
  {
    id: 6,
    title: 'Fix the production issue',
  },
  {
    id: 7,
    title: 'Confirm my slot for Saturday Night',
  },
  {
    id: 8,
    title: 'Get essentials for Sunday car wash',
  },
]

// Write your code here
// Simple Todo
class SimpleTodos extends Component {
  state = {
    TodosList: initialTodosList,
    addedTodo: '',
  }

  deleteTodo = id => {
    const {TodosList} = this.state
    const filteredTodoList = TodosList.filter(eachTodo => eachTodo.id !== id)
    this.setState({TodosList: filteredTodoList})
  }

  editTodo = (id, editedText) => {
    const {TodosList} = this.state
    const editedTodoArray = TodosList.map(eachTodo => {
      if (eachTodo.id === id) {
        return {...eachTodo, title: editedText}
      }
      return eachTodo
    })
    this.setState({TodosList: editedTodoArray})
  }

  onAddTodo = event => {
    this.setState({addedTodo: event.target.value})
  }

  onClickAddBtn = () => {
    const {TodosList, addedTodo} = this.state
    const arrParts = addedTodo.split(' ')
    const todoText = String(arrParts.slice(0, -1).join(' '))
    const todoNumber = Number(arrParts.at(-1))
    const todoNumberisNum = Number.isInteger(Number(arrParts.at(-1)))
    const multipleTodos = []
    if (todoNumberisNum) {
      for (let i = 1; i < todoNumber + 1; i + 1) {
        const newTodo = {title: todoText, id: TodosList.at(-1).id + i}
        multipleTodos.push(newTodo)
      }
      this.setState(prevState => ({
        TodosList: [...prevState.TodosList, ...multipleTodos],
        addedTodo: '',
      }))
    } else {
      const newTodo = {title: addedTodo, id: TodosList.at(-1).id + 1}
      this.setState(prevState => ({
        TodosList: [...prevState.TodosList, newTodo],
        addedTodo: '',
      }))
    }
  }

  render() {
    const {TodosList, addedTodo} = this.state

    return (
      <div className="todo-bg">
        <div className="todo-container">
          <h1>Simple Todos</h1>
          <div className="addContainer">
            <input type="text" value={addedTodo} onChange={this.onAddTodo} />
            <button type="button" onClick={this.onClickAddBtn}>
              Add
            </button>
          </div>
          <ul>
            {TodosList !== undefined &&
              TodosList.map(eachTodo => (
                <li key={eachTodo.id}>
                  <TodoItem
                    todoItem={eachTodo}
                    deleteTodo={this.deleteTodo}
                    editTodo={this.editTodo}
                  />
                </li>
              ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default SimpleTodos
