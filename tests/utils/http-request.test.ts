import { Request } from '../../src/utils/http-request'

describe('HTTP Request', () => {
  test('HTTP get', async () => {
    const data = await Request.get('http://jsonplaceholder.typicode.com/todos/1')
    expect(data.body).toEqual({
      id: 1,
      title: 'delectus aut autem',
      completed: false,
      userId: 1,
    })
  })

  test('HTTPS get', async () => {
    const data = await Request.get('https://jsonplaceholder.typicode.com/todos/1')
    expect(data.body).toEqual({
      id: 1,
      title: 'delectus aut autem',
      completed: false,
      userId: 1,
    })
  })

  test('HTTP post', async () => {
    const data = await Request.post('http://jsonplaceholder.typicode.com/posts', {
      title: 'foo',
      body: 'bar',
      userId: 1,
    })
    expect(data.body).toEqual({
      id: 101,
      title: 'foo',
      body: 'bar',
      userId: 1
    })
  })

  test('HTTPS post', async () => {
    const data = await Request.post('https://jsonplaceholder.typicode.com/posts', {
      title: 'foo',
      body: 'bar',
      userId: 1,
    })
    expect(data.body).toEqual({
      id: 101,
      title: 'foo',
      body: 'bar',
      userId: 1
    })
  })
})