interface Me {
  name: string
}

interface User {
  id: number
}

const users = [
  { id: 1, name: 'A', email: 'a@a.com' },
  { id: 2, name: 'B', email: 'b@a.com' },
  { id: 3, name: 'C', email: 'c@a.com' }
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
    users: () => users
  }
}