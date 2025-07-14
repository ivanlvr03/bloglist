const Blog = require('../models/blog')
const User = require('../models/users')

// Datos iniciales para las pruebas
const initialBlogs = [
  {
    title: 'Tecnologías Web',
    author: 'Juan Pérez',
    url: 'https://tecnologiasweb.com',
    likes: 15
  },
  {
    title: 'Programación en JavaScript',
    author: 'María García',
    url: 'https://javascriptpro.com',
    likes: 20
  }
]

// Usuario inicial para pruebas
const initialUser = {
  username: 'testuser',
  name: 'Usuario de Prueba',
  password: 'password123'
}

// Función para obtener todos los blogs de la base de datos
const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

// Función para obtener todos los usuarios de la base de datos
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

// Función para generar un ID que existe en el formato correcto pero no en la BD
const nonExistingId = async () => {
  const blog = new Blog({
    title: 'Será removido pronto',
    author: 'Test',
    url: 'http://test.com',
    likes: 0
  })

  await blog.save()
  await blog.deleteOne()
  return blog._id.toString()
}

// Función para obtener un token de autenticación válido
const getAuthToken = async (api) => {
  // Primero creamos un usuario
  await api
    .post('/api/users')
    .send(initialUser)

  // Luego hacemos login para obtener el token
  const response = await api
    .post('/api/login')
    .send({
      username: initialUser.username,
      password: initialUser.password
    })

  return response.body.token
}

// Función para crear un blog con un usuario autenticado
const createBlog = async (api, token, blog) => {
  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blog)

  return response.body
}

module.exports = {
  initialBlogs,
  initialUser,
  blogsInDb,
  usersInDb,
  nonExistingId,
  getAuthToken,
  createBlog
}
