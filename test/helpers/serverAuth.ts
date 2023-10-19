import { Session } from 'next-auth'

export const serverAuthMock: Session = {
  user: {
    _id: 'testid',
    name: 'John Doe',
    email: 'john@doe.com',
    image: 'fakeurl.com/image',
  },
  expires: 'never',
}
