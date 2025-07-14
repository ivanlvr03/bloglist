const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/users')

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await require('bcrypt').hash('sekret', 10)
  const user = new User({ username: 'root', name: 'Root', passwordHash })
  await user.save()
})

describe('user creation', () => {
  test('fails with 400 if username is too short', async () => {
    const newUser = {
      username: 'ab',
      name: 'Shorty',
      password: 'validpass'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.match(result.body.error, /is shorter than the minimum allowed length/)

  })

  test('fails with 400 if password is too short', async () => {
    const newUser = {
      username: 'validusername',
      name: 'Tiny',
      password: '12'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.match(result.body.error, /at least 3 characters/)
  })

  test('fails with 400 if username already exists', async () => {
    const newUser = {
      username: 'root',
      name: 'Duplicate',
      password: 'validpass'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert.match(result.body.error, /unique/)
  })

  test('succeeds with valid username and password', async () => {
    const newUser = {
      username: 'newuser',
      name: 'Test User',
      password: 'validpassword'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.username, 'newuser')
  })
})

after(async () => {
  await mongoose.connection.close()
})
