interface App {
  name: string
}

interface Me {
  name: string
}

interface User {
  id: number
}

interface SignUp {
  name: string
  email: string
  password: string
}

interface Todo {
  id: number
  title: string
  completed: boolean
  createdAt: Date
}

const users = [
  { id: 1, name: 'Richard', email: 'a@a.com', password: '!234' },
  { id: 2, name: 'John', email: 'b@a.com', password: '1@34'},
  { id: 3, name: 'Dogulas', email: 'c@a.com', password: '12#4' }
]

let INTERNAL_AUTO_INCREMENT = 0
const todos: Todo[] = []

export const resolvers = {
  Query: {
    hello: (root: any, { name }: App, context: any): string => {
      console.log(name)
      return `Hello ${name}`
    },
    me: (root: any, { name }: Me, context: any): string => {
      console.log(name)
      return name
    },
    log: () => {
      return new Date()
    },
    user: (root: any, { id }: User) => {
      return users.filter(user => user.id === id)[0]
    },
    users: () => users,
    today: (root: any, args: any, context: any) => {
      return todos
    },
    yesterday: (root: any, args: any, context: any) => {
      return todos
    },
    tomorrow: (root: any, args: any, context: any) => {
      return todos
    },
    /*****************
     * web.ext
     *****************/
    getUserToday: (root: any, { user }: any, context: any) => {
      console.log('getUserToday', user)
      return todos
    }
  },
  Mutation: {
    signUp: (root: any, { name, email, password }: SignUp) => {
      const user = {
        id: users.length + 1, name, email, password
      }
      users.push(user)
      return user
    },
    createTodo: (root: any, { title }: any, context: any) => {
      INTERNAL_AUTO_INCREMENT++

      const todo: Todo = {
        id: INTERNAL_AUTO_INCREMENT,
        title,
        completed: false,
        createdAt: new Date()
      }
      
      todos.push(todo)
      return todo
    },
    toggleTodo: (root: any, params: any, context: any) => {
      const todo = todos.find(t => t.id === params.id)
      if (todo) {
        todo.completed = params.completed
      }
      return todo
    },
    removeTodo: (root: any, params: any, context: any) => {
      const idx = todos.findIndex(t => t.id === params.id)
      const todo = todos.splice(idx, 1)
      return todo[0]
    },
  }
}