import { TodoList, TaskType } from "./TodoList"
import './App.css';
import { useState } from "react";
import { v1 } from 'uuid';
import { AddItemForm } from "./AddItemForm";
import { AppBar, Toolbar, IconButton, Button, Container, Grid, Paper } from "@material-ui/core";
import { Menu } from '@material-ui/icons/';

export type FilterValuesType = "all" | "active" | "completed"
export type TodoListType = {
  id: string
  title: string
  filter: FilterValuesType
}
type TasksType = {
  [key: string]: Array<TaskType>
}

function App() {

  const todoListId1 = v1()
  const todoListId2 = v1()

  let [tasks, setTasks] = useState<TasksType>({
    [todoListId1]: [
      { id: v1(), title: "HTML&CSS", isDone: true },
      { id: v1(), title: "JS", isDone: true },
      { id: v1(), title: "ReactJS", isDone: false },
      { id: v1(), title: "RestApi", isDone: false },
      { id: v1(), title: "GraphQL", isDone: false },
    ],
    [todoListId2]: [
      { id: v1(), title: "Bread", isDone: true },
      { id: v1(), title: "Beer", isDone: false },
      { id: v1(), title: "Chease", isDone: false }
    ]
  })
  let [todoLists, setTodoLists] = useState<Array<TodoListType>>([
    { id: todoListId1, title: "What to learn", filter: "all" },
    { id: todoListId2, title: "What to buy", filter: "all" },
  ])

  const removeTask = (taskID: string, tlID: string) => {
    setTasks({ ...tasks, [tlID]: tasks[tlID].filter(t => t.id !== taskID) })
  }

  const addTask = (title: string, tlID: string) => {
    setTasks({ ...tasks, [tlID]: [{ id: v1(), title, isDone: false }, ...tasks[tlID]] })
  }
  const changeTaskStatus = (taskID: string, isDone: boolean, tlID: string) => {
    setTasks({ ...tasks, [tlID]: tasks[tlID].map(t => t.id === taskID ? { ...t, isDone } : t) })
  }
  const changeTaskTitle = (title: string, tlID: string, taskID: string) => {
    setTasks({ ...tasks, [tlID]: tasks[tlID].map(t => t.id === taskID ? { ...t, title } : t) })
  }
  const removeTodoList = (tlID: string) => {
    setTodoLists(todoLists.filter(tl => tl.id !== tlID))
    delete tasks[tlID]
  }
  const changeFilter = (tlID: string, value: FilterValuesType) => {
    setTodoLists(todoLists.map(tl => tl.id === tlID ? { ...tl, filter: value } : tl))
  }
  const addTodoList = (title: string) => {
    const tlID = v1()
    setTodoLists([...todoLists, { id: tlID, title, filter: 'all' }])
    setTasks({ ...tasks, [tlID]: [] })
  }
  const changeTodoListTitle = (title: string, tlID: string) => {
    setTodoLists(todoLists.map(tl => tl.id === tlID ? { ...tl, title } : tl))
  }


  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Container fixed>
        <Grid container style={{ padding: "20px" }}>
          <AddItemForm addItem={addTodoList} />
        </Grid>
        <Grid container spacing={3}>
          {
            todoLists.map(tl => {

              let tasksForTodoList = tasks[tl.id]

              if (tl.filter === "active") {
                tasksForTodoList = tasks[tl.id].filter(t => !t.isDone)
              }
              if (tl.filter === "completed") {
                tasksForTodoList = tasks[tl.id].filter(t => t.isDone)
              }

              return (
                <Grid item>
                  <Paper style={{ padding: "10px" }} >
                    <TodoList key={tl.id}
                      tlID={tl.id}
                      title={tl.title}
                      tasks={tasksForTodoList}
                      filter={tl.filter}
                      changeTodoListTitle={changeTodoListTitle}
                      changeTaskTitle={changeTaskTitle}
                      removeTodoList={removeTodoList}
                      removeTask={removeTask}
                      addTask={addTask}
                      changeTaskStatus={changeTaskStatus}
                      changeFilter={changeFilter} />
                  </Paper>
                </Grid>
              )
            })
          }
        </Grid>
      </Container>
    </div>
  );
}

export default App;