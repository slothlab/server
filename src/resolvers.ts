import { AuthenticationError } from 'apollo-server-micro'
import format from 'date-fns/format'

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

interface Answer {
  id: number
  value: number
}

const users = [
  { id: 1, name: 'Richard', email: 'a@a.com', password: '!234' },
  { id: 2, name: 'John', email: 'b@a.com', password: '1@34'},
  { id: 3, name: 'Dogulas', email: 'c@a.com', password: '12#4' }
]

const createdAt = new Date()
const questions = [
  { id: 1, title: 'My Daily Happiness', createdAt, questions: [
    { id: 1, title: '나는 가치있는 일을 하고 있다.', type: 'number' },
    { id: 2, title: '함께 일하는 것이 즐겁다.', type: 'number' },
    { id: 3, title: '산출한 결과물에 만족감을 느낀다.', type: 'number' },
    { id: 4, title: '배우고 성장하고 있다.', type: 'number' },
    { id: 5, title: '일의 목표를 명확하게 알고 공감한다.', type: 'number' },
    { id: 6, title: '주도적으로 일한다.', type: 'number' },
    { id: 7, title: '필요한 도움을 받고 있다.', type: 'number' },
  ] },
  { id: 2, title: 'Weekly Happiness', createdAt, questions: [
    { id: 1, title: 'question - 2', type: 'number' },
    { id: 2, title: 'question - 3', type: 'number' },
    { id: 3, title: 'question - 4', type: 'number' }
  ] }
]

/* 유저별로 하나의 document 를 갖는 구조 */
const happiness: { [key: string]: any} = {
  "20190824/1": {
    answers: [
      { id: 1, value: 3 },
      { id: 2, value: 4 },
    ]
  }
}

let INTERNAL_AUTO_INCREMENT = 0
const todos: Todo[] = []

// const clone = (data: any) => {
//   return JSON.parse(JSON.stringify(data))
// }

const getDate = () => {
  return format(new Date(), 'yyyyMMdd')
}

const getKey = (id: number) => `${getDate()}/${id}`

const createEmptyAnswers = (key: string): Answer[] => {
  happiness[key] = { answers: [] }
  return happiness[key].answers
}

const getAnswers = (id: number): Answer[] => {
  const key = getKey(id)
  const res = Object.entries(happiness).find(i => i[0] === key)

  return (res && res[1].answers) || createEmptyAnswers(key)
}

happiness[getKey(1)] = {
  answers: [
    { id: 1, value: 3 },
    { id: 2, value: 4 },
  ]
}

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
    },
    /*****************
     * happiness
     *****************/
    getAllHappiness: () => {
      return questions
    },
    happiness: (root: any, { id }: any, context: any) => {
      console.log('happiness', id)
      return questions.find(i => i.id = id)
    }
  },
  Mutation: {
    authenticateUser: (root: any, { email, password }: any, context: any) => {
      const user = users.find(u => u.email === email)
      if (!user) {
        throw new AuthenticationError('Authentication is needed to get requested response')
      }

      return { id: 'uuid', token: 'abcd' }
    },
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
    saveHappiness: (root: any, params: any, context: any) => {
      const happinessId = params.happiness
      const questionId = params.question
      const answers = getAnswers(happinessId)
      const answer = answers.find(a => a.id === questionId)

      if (answer) {
        answer.value = params.value
      } else {
        answers.push({ id: questionId, value: params.value })
      }

      return { answers }
    }
  }
}