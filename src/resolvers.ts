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

const users = [
  { id: 1, name: 'Richard', email: 'a@a.com', password: '!234' },
  { id: 2, name: 'John', email: 'b@a.com', password: '1@34'},
  { id: 3, name: 'Dogulas', email: 'c@a.com', password: '12#4' }
]

export const resolvers = {
  Query: {
    hello: (a: string) => `Hello ${a}`,
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
  },
  Mutation: {
    signUp: (root: any, { name, email, password }: SignUp) => {
      const user = {
        id: users.length + 1, name, email, password
      }
      users.push(user)
      return user
    }
  }
}