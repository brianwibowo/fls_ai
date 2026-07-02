import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Automatically attach Bearer token to all outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().auth.accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
