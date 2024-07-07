import axios from 'axios'
import { config } from '../../Constants'
import { parseJwt } from './Helpers'

export const movieApi = {
  authenticate,
  signup,
  numberOfUsers,
  numberOfMovies,
  getUsers,
  deleteUser,
  getMovies,
  deleteMovie,
  addMovie,
  generateForms, // Adding new function
  generateDocs,   // Adding new function
  getHistory
}

function authenticate(username, password) {
  return instance.post('/auth/authenticate', { username, password }, {
    headers: { 'Content-type': 'application/json' }
  })
}

function signup(user) {
  return instance.post('/auth/signup', user, {
    headers: { 'Content-type': 'application/json' }
  })
}

function numberOfUsers() {
  return instance.get('/public/numberOfUsers')
}

function numberOfMovies() {
  return instance.get('/public/numberOfMovies')
}

function getUsers(user, username) {
  const url = username ? `/api/users/${username}` : '/api/users'
  return instance.get(url, {
    headers: { 'Authorization': bearerAuth(user) }
  })
}

function deleteUser(user, username) {
  return instance.delete(`/api/users/${username}`, {
    headers: { 'Authorization': bearerAuth(user) }
  })
}

function getMovies(user, text) {
  const url = text ? `/api/movies?text=${text}` : '/api/movies'
  return instance.get(url, {
    headers: { 'Authorization': bearerAuth(user) }
  })
}

function deleteMovie(user, id) {
  return instance.delete(`/api/movies/${id}`, {
    headers: { 'Authorization': bearerAuth(user) }
  })
}

function addMovie(user, movie) {
  return instance.post('/api/movies', movie, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(user)
    }
  })
}

function generateForms(user, userEmail, formData) {
  return instance.post(`/api/google/generate-forms?userEmail=${userEmail}`, formData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': bearerAuth(user)
    }
  })
}

function generateDocs(user, userEmail, formData) {
  return instance.post(`/api/google/generate-docs?userEmail=${userEmail}`, formData, {
    headers: {
      'Authorization': bearerAuth(user)
    }
  })
}

async function getHistory(user, userEmail) {  
  const response = await instance.post('/api/history/fetch-data', null, {
    params: { userEmail: userEmail },
    headers: { 'Authorization': bearerAuth(user) }
  })
  console.log(response)
  return response // Assuming response.data is the list of GoogleApiRecord
}

// -- Axios

const instance = axios.create({
  baseURL: config.url.API_BASE_URL
})

instance.interceptors.request.use(function (config) {
  // If token is expired, redirect user to login
  if (config.headers.Authorization) {
    const token = config.headers.Authorization.split(' ')[1]
    const data = parseJwt(token)
    if (Date.now() > data.exp * 1000) {
      window.location.href = "/login"
    }
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// -- Helper functions

function bearerAuth(user) {
  return `Bearer ${user.accessToken}`
}
