import api from './api'

export const userService = {
    /**
     * Update user profile (name only)
     */
    async updateProfile(fullName: string) {
        const response = await api.put('/users/profile', { fullName })
        return response.data.data
    },

    /**
     * Request OTP for email change
     */
    async requestEmailChange(newEmail: string) {
        const response = await api.post('/users/request-email-change', { newEmail })
        return response.data.data
    },

    /**
     * Verify OTP and update email
     */
    async verifyEmailChange(newEmail: string, otp: string) {
        const response = await api.post('/users/verify-email-change', { newEmail, otp })
        return response.data.data
    },

    /**
     * Change password (for users with existing password)
     */
    async changePassword(data: { currentPassword?: string; newPassword?: string; confirmPassword?: string }) {
        const response = await api.post('/users/change-password', data)
        return response.data.data
    },

    /**
     * Set password (for OAuth users without password)
     */
    async setPassword(data: { newPassword?: string; confirmPassword?: string }) {
        const response = await api.post('/users/set-password', data)
        return response.data.data
    },
}
