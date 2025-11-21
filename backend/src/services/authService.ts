import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database';
import { redis } from '../config/redis';
import { config } from '../config/environment';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}

interface InitiateRegisterData {
  email: string;
  password: string;
  fullName: string;
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  async initiateRegistration(data: InitiateRegisterData) {
    const { email, password, fullName } = data;

    // Check if user already exists
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      throw new AppError('User with this email already exists', 400);
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store registration data in Redis with 10 minutes expiration
    const registrationData = {
      email,
      password,
      fullName,
      otp
    };

    await redis.setJSON(`pending_reg:${email}`, registrationData, 600); // 10 minutes

    // Send verification email
    const { emailService } = await import('./emailService');
    await emailService.sendVerificationEmail(email, otp);

    logger.info(`Registration initiated for: ${email}`);

    return {
      message: 'Verification code sent to your email',
      email
    };
  }

  async verifyRegistration(email: string, otp: string) {
    // Retrieve registration data from Redis
    const registrationData = await redis.getJSON(`pending_reg:${email}`);

    if (!registrationData) {
      throw new AppError('Verification session expired or invalid. Please register again.', 400);
    }

    // Validate OTP
    if (registrationData.otp !== otp) {
      throw new AppError('Invalid verification code', 400);
    }

    // Create user in database
    const passwordHash = await bcrypt.hash(registrationData.password, config.security.bcryptSaltRounds);
    const apiKey = `pk_${uuidv4().replace(/-/g, '')}`;

    const result = await db.query(
      `INSERT INTO users (email, password_hash, full_name, api_key, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, full_name, role, created_at`,
      [registrationData.email, passwordHash, registrationData.fullName, apiKey, 'user']
    );

    const user = result.rows[0];

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id, user.email);
    const refreshToken = this.generateRefreshToken(user.id, user.email);

    // Store refresh token in Redis
    await redis.set(`refresh_token:${user.id}`, refreshToken, 7 * 24 * 60 * 60); // 7 days

    // Delete pending registration data
    await redis.del(`pending_reg:${email}`);

    logger.info(`User registered and verified: ${email}`);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        hasPassword: true
      }
    };
  }

  async register(data: RegisterData) {
    const { email, password, fullName } = data;

    // Check if user already exists
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      throw new AppError('User with this email already exists', 400);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, config.security.bcryptSaltRounds);

    // Generate API key
    const apiKey = `pk_${uuidv4().replace(/-/g, '')}`;

    // Insert user
    const result = await db.query(
      `INSERT INTO users (email, password_hash, full_name, api_key, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, full_name, role, created_at`,
      [email, passwordHash, fullName, apiKey, 'user']
    );

    const user = result.rows[0];

    logger.info(`New user registered: ${email}`);

    return {
      userId: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      createdAt: user.created_at
    };
  }

  async login(data: LoginData) {
    const { email, password } = data;

    // Find user
    const result = await db.query(
      'SELECT id, email, password_hash, full_name, role, google_id, apple_id FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw new AppError('Invalid email or password', 401);
    }

    const user = result.rows[0];

    // Check if user registered with OAuth but has no password set
    if (!user.password_hash && (user.google_id || user.apple_id)) {
      const oauthProvider = user.google_id ? 'Google' : 'Apple';
      throw new AppError(
        `This account was created using ${oauthProvider} Sign-In. Please use the ${oauthProvider} button to login, or reset your password to enable email/password login.`,
        401
      );
    }

    // Check if password_hash is null (shouldn't happen, but safety check)
    if (!user.password_hash) {
      throw new AppError('Invalid email or password', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id, user.email);
    const refreshToken = this.generateRefreshToken(user.id, user.email);

    // Store refresh token in Redis
    await redis.set(`refresh_token:${user.id}`, refreshToken, 7 * 24 * 60 * 60); // 7 days

    // Update last login
    await db.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    logger.info(`User logged in: ${email}`);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        hasPassword: !!user.password_hash
      }
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as any;

      // Check if refresh token exists in Redis
      const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

      if (!storedToken || storedToken !== refreshToken) {
        throw new AppError('Invalid refresh token', 401);
      }

      // Generate new tokens
      const newAccessToken = this.generateAccessToken(decoded.userId, decoded.email);
      const newRefreshToken = this.generateRefreshToken(decoded.userId, decoded.email);

      // Update refresh token in Redis
      await redis.set(`refresh_token:${decoded.userId}`, newRefreshToken, 7 * 24 * 60 * 60);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: 900
      };
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError('Refresh token expired', 401);
      }
      throw error;
    }
  }

  async logout(userId: string) {
    // Remove refresh token from Redis
    await redis.del(`refresh_token:${userId}`);
    logger.info(`User logged out: ${userId}`);
  }

  private generateAccessToken(userId: string, email: string): string {
    const secret = config.jwt.secret || 'temp-secret-32-chars-long-for-dev';
    return jwt.sign(
      { userId, email },
      secret,
      { expiresIn: (config.jwt.expiresIn || '15m') as any }
    );
  }

  private generateRefreshToken(userId: string, email: string): string {
    const secret = config.jwt.refreshSecret || 'temp-refresh-secret-32-chars';
    return jwt.sign(
      { userId, email },
      secret,
      { expiresIn: (config.jwt.refreshExpiresIn || '7d') as any }
    );
  }

  async generateApiKey(userId: string): Promise<string> {
    const apiKey = `pk_${uuidv4().replace(/-/g, '')}`;

    await db.query('UPDATE users SET api_key = $1 WHERE id = $2', [apiKey, userId]);

    logger.info(`API key generated for user: ${userId}`);

    return apiKey;
  }

  async forgotPassword(email: string) {
    // Check if user exists
    const result = await db.query('SELECT id, email FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      // Don't reveal if user exists or not for security
      return;
    }

    const user = result.rows[0];

    // Generate reset token
    const resetToken = uuidv4();

    // Store in Redis with 1 hour expiration
    await redis.set(`reset_token:${resetToken}`, user.id, 60 * 60);

    // Create reset link
    // Assuming frontend is running on port 5173 (Vite default) or configured URL
    const frontendUrl = process.env.FRONTEND_URL;
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    // Send email
    const { emailService } = await import('./emailService');
    await emailService.sendResetPasswordEmail(user.email, resetLink);

    logger.info(`Password reset requested for: ${email}`);
  }

  async resetPassword(token: string, newPassword: string) {
    // Verify token
    const userId = await redis.get(`reset_token:${token}`);

    if (!userId) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, config.security.bcryptSaltRounds);

    // Update password
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, userId]);

    // Delete token
    await redis.del(`reset_token:${token}`);

    // Optional: Invalidate all sessions (logout user from all devices)
    await redis.del(`refresh_token:${userId}`);

    logger.info(`Password reset successful for user: ${userId}`);
  }

  async verifyGoogleToken(token: string) {
    try {
      // The frontend sends an access token from useGoogleLogin
      // We need to fetch user info from Google's userinfo endpoint
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new AppError('Failed to fetch Google user info', 401);
      }

      const userInfo = await response.json() as { email?: string; name?: string; sub: string };

      if (!userInfo.email) {
        throw new AppError('Email not provided by Google', 401);
      }

      return {
        email: userInfo.email,
        name: userInfo.name || '',
        sub: userInfo.sub,
      };
    } catch (error) {
      logger.error('Google token verification failed:', error);
      throw new AppError('Invalid Google token', 401);
    }
  }



  async handleOAuthLogin(provider: 'google', token: string) {
    const profile = await this.verifyGoogleToken(token);

    if (!profile.email) {
      throw new AppError('Email not provided by OAuth provider', 400);
    }

    // Check if user exists by provider ID or email
    const result = await db.query(
      `SELECT id, email, full_name, role, google_id 
       FROM users 
       WHERE email = $1 OR google_id = $2`,
      [profile.email, profile.sub]
    );

    if (result.rows.length > 0) {
      // Existing user - update provider ID if not set
      const user = result.rows[0];

      if (!user.google_id) {
        await db.query(
          `UPDATE users SET google_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
          [profile.sub, user.id]
        );
      }

      // Update last login
      await db.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

      // Generate tokens
      const accessToken = this.generateAccessToken(user.id, user.email);
      const refreshToken = this.generateRefreshToken(user.id, user.email);

      // Store refresh token in Redis
      await redis.set(`refresh_token:${user.id}`, refreshToken, 7 * 24 * 60 * 60);

      logger.info(`User logged in via ${provider}: ${user.email}`);

      return {
        success: true,
        isNewUser: false,
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.full_name,
            role: user.role,
            hasPassword: !!user.password_hash
          },
          tokens: {
            accessToken,
            refreshToken,
            expiresIn: 900
          }
        }
      };
    }

    // New user - return profile data for registration completion
    return {
      success: true,
      isNewUser: true,
      data: {
        profile: {
          email: profile.email,
          fullName: profile.name,
          providerId: profile.sub,
          provider,
        }
      }
    };
  }

  async completeOAuthRegistration(data: {
    email: string;
    fullName: string;
    provider: 'google';
    providerId: string;
  }) {
    const { email, fullName, provider, providerId } = data;

    // Check if user already exists
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      throw new AppError('User with this email already exists', 400);
    }

    // Generate API key
    const apiKey = `pk_${uuidv4().replace(/-/g, '')}`;
    const providerColumn = provider === 'google' ? 'google_id' : 'apple_id';

    // Insert user with provider ID
    const result = await db.query(
      `INSERT INTO users (email, full_name, api_key, role, ${providerColumn})
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, full_name, role, created_at`,
      [email, fullName, apiKey, 'user', providerId]
    );

    const user = result.rows[0];

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id, user.email);
    const refreshToken = this.generateRefreshToken(user.id, user.email);

    // Store refresh token in Redis
    await redis.set(`refresh_token:${user.id}`, refreshToken, 7 * 24 * 60 * 60);

    logger.info(`User registered via ${provider}: ${email}`);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        hasPassword: false
      },
    };
  }
}

export const authService = new AuthService();
