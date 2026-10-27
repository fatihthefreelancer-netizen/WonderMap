import type { Request, Response } from 'express';
import type { CookieOptions } from 'express';
import { User } from '../models/User.js';
import { World } from '../models/World.js';
import { Lesson } from '../models/Lesson.js';
import { ApiError } from '../utils/ApiError.js';
import { registerSchema, loginSchema } from '../utils/validators.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { toUserDTO } from '../utils/serializers.js';
import { env } from '../config/env.js';

const REFRESH_COOKIE = 'wm_refresh';

function refreshCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    // `none` requires Secure, so the two move together
    secure: env.isProd || env.cookieSameSite === 'none',
    sameSite: env.cookieSameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth',
  };
}

/** Give a brand-new user the first world + its entry lessons. */
async function grantStartingContent(userId: string) {
  const firstWorld = await World.findOne().sort({ order: 1 });
  if (!firstWorld) return;
  const entryLessons = await Lesson.find({
    world: firstWorld._id,
    $or: [{ prerequisites: { $size: 0 } }, { prerequisites: { $exists: false } }],
  });
  await User.findByIdAndUpdate(userId, {
    $addToSet: {
      'progress.worldUnlocked': firstWorld._id,
      'progress.lessonUnlocked': { $each: entryLessons.map((l) => l._id) },
    },
    $set: { 'progress.currentWorld': firstWorld._id },
  });
}

export async function register(req: Request, res: Response) {
  const body = registerSchema.parse(req.body);
  const exists = await User.findOne({ email: body.email });
  if (exists) throw ApiError.conflict('Email already registered');

  const user = await User.create(body);
  await grantStartingContent(user.id);
  const fresh = await User.findById(user.id);

  issueTokens(res, user.id, user.role);
  res.status(201).json({
    user: toUserDTO(fresh),
    accessToken: signAccessToken({ sub: user.id, role: user.role }),
  });
}

export async function login(req: Request, res: Response) {
  const body = loginSchema.parse(req.body);
  const user = await User.findOne({ email: body.email }).select('+password');
  if (!user) throw ApiError.unauthorized('Invalid credentials');
  const ok = await user.comparePassword(body.password);
  if (!ok) throw ApiError.unauthorized('Invalid credentials');

  const full = await User.findById(user.id);
  issueTokens(res, user.id, user.role);
  res.json({
    user: toUserDTO(full),
    accessToken: signAccessToken({ sub: user.id, role: user.role }),
  });
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) throw ApiError.unauthorized('Missing refresh token');
  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw ApiError.unauthorized('Invalid refresh token');
  }
  const user = await User.findById(payload.sub);
  if (!user) throw ApiError.unauthorized('User no longer exists');
  issueTokens(res, user.id, user.role);
  res.json({
    user: toUserDTO(user),
    accessToken: signAccessToken({ sub: user.id, role: user.role }),
  });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie(REFRESH_COOKIE, { path: '/api/auth' });
  res.json({ ok: true });
}

function issueTokens(res: Response, userId: string, role: 'user' | 'admin') {
  const refreshToken = signRefreshToken({ sub: userId, role });
  res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions());
}
