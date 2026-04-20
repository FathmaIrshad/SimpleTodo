import {Component} from 'react'
import TodoItem from '../TodoItem/index'
import './index.css'

// 1. Define your Backend URL
const API_URL = 'https://894zf6-5000.csb.app'

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
    TodosList: [], // Start with an empty list
    addedTodo: '',
  }

  // 2. Fetch data from SQLite when the component loads
  componentDidMount() {
    this.getTodos()
  }

  getTodos = async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      // Map 'task' from backend to 'title' for your frontend
      const formattedData = data.map(each => ({
        id: each.id,
        title: each.task,
        completed: each.completed,
      }))
      this.setState({TodosList: formattedData})
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  }

  // 3. Update Delete to sync with Backend
  deleteTodo = async id => {
    try {
      // 1. Send DELETE request to the backend
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // 2. Only if the backend delete is successful, update the UI
        const {TodosList} = this.state
        const filteredTodoList = TodosList.filter(
          eachTodo => eachTodo.id !== id,
        )
        this.setState({TodosList: filteredTodoList})
      }
    } catch (error) {
      console.error('Failed to delete todo:', error)
    }
  }

  editTodo = async (id, editedText) => {
    try {
      // 1. Send the update to the SQLite backend
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({task: editedText}),
      })

      // 2. Update the local React state after a successful database update
      const {TodosList} = this.state
      const editedTodoArray = TodosList.map(eachTodo => {
        if (eachTodo.id === id) {
          return {...eachTodo, title: editedText}
        }
        return eachTodo
      })

      this.setState({TodosList: editedTodoArray})
    } catch (error) {
      console.error('Failed to update todo:', error)
    }
  }

  onAddTodo = event => {
    this.setState({addedTodo: event.target.value})
  }

  onClickAddBtn = async () => {
    const {addedTodo} = this.state
    if (addedTodo.trim() === '') return

    const arrParts = addedTodo.split(' ')
    const lastPart = arrParts.at(-1)
    const todoNumber = Number(lastPart)
    const isMultiple = Number.isInteger(todoNumber) && arrParts.length > 1

    try {
      if (isMultiple) {
        const todoText = arrParts.slice(0, -1).join(' ')

        // Create an array of requests
        const promises = Array.from({length: todoNumber}).map(() =>
          fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({task: todoText}),
          }).then(res => res.json()),
        )

        // Execute all requests at once
        const results = await Promise.all(promises)
        const newTasks = results.map(todo => ({id: todo.id, title: todo.task}))

        this.setState(prevState => ({
          TodosList: [...prevState.TodosList, ...newTasks],
          addedTodo: '',
        }))
      } else {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({task: addedTodo}),
        })
        const savedTodo = await response.json()

        this.setState(prevState => ({
          TodosList: [
            ...prevState.TodosList,
            {id: savedTodo.id, title: savedTodo.task},
          ],
          addedTodo: '',
        }))
      }
    } catch (error) {
      console.error('Add failed:', error)
    }
  }

  toggleComplete = async (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1 // Flip between 0 and 1

    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({completed: newStatus}),
      })

      const {TodosList} = this.state
      const updatedList = TodosList.map(each => {
        if (each.id === id) {
          return {...each, completed: newStatus}
        }
        return each
      })

      this.setState({TodosList: updatedList})
    } catch (error) {
      console.error('Toggle failed:', error)
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
                    toggleComplete={this.toggleComplete} // Pass it here
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
