import api from './api'
import { LoginRequest, RegisterRequest, User, AuthTokens, OAuthLoginResponse } from '../types'

export const authService = {
  async login(data: LoginRequest): Promise<{ tokens: AuthTokens; user: User }> {
    const response = await api.post('/auth/login', data)
    return {
      tokens: {
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken,
        expiresIn: response.data.data.expiresIn,
      },
      user: response.data.data.user,
    }
  },

  async initiateRegister(data: RegisterRequest): Promise<{ message: string; email: string }> {
    const response = await api.post('/auth/register-initiate', data)
    return response.data.data
  },

  async verifyRegister(data: { email: string; otp: string }): Promise<{ tokens: AuthTokens; user: User }> {
    const response = await api.post('/auth/register-verify', data)
    return {
      tokens: {
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken,
        expiresIn: response.data.data.expiresIn,
      },
      user: response.data.data.user,
    }
  },

  async register(data: RegisterRequest): Promise<User> {
    const response = await api.post('/auth/register', data)
    return response.data.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async forgotPassword(email: string) {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  async resetPassword(data: { token: string; password: string }) {
    const response = await api.post('/auth/reset-password', data)
    return response.data
  },

  async getMe(): Promise<User> {
    const response = await api.get('/auth/me')
    return response.data.data.user
  },

  async generateApiKey(): Promise<string> {
    const response = await api.post('/auth/api-key')
    return response.data.data.apiKey
  },

  async googleLogin(token: string): Promise<OAuthLoginResponse> {
    const response = await api.post('/auth/google', { token })
    return {
      isNewUser: response.data.data.isNewUser,
      data: response.data.data,
    }
  },

  async appleLogin(identityToken: string): Promise<OAuthLoginResponse> {
    const response = await api.post('/auth/apple', { identityToken })
    return {
      isNewUser: response.data.data.isNewUser,
      data: response.data.data,
    }
  },

  async completeOAuthRegistration(data: {
    email: string
    fullName: string
    provider: 'google' | 'apple'
    providerId: string
  }): Promise<{ tokens: AuthTokens; user: User }> {
    const response = await api.post('/auth/oauth-complete', data)
    return {
      tokens: {
        accessToken: response.data.data.accessToken,
        refreshToken: response.data.data.refreshToken,
        expiresIn: response.data.data.expiresIn,
      },
      user: response.data.data.user,
    }
  },
}
