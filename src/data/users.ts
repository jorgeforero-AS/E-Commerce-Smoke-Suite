import * as dotenv from 'dotenv';

dotenv.config();

export interface UserCredentials {
  username: string;
  password: string;
}

const PASSWORD = process.env.PASSWORD ?? 'secret_sauce';

export const Users = {
  standard: {
    username: process.env.STANDARD_USER ?? 'standard_user',
    password: PASSWORD,
  } as UserCredentials,

  lockedOut: {
    username: process.env.LOCKED_OUT_USER ?? 'locked_out_user',
    password: PASSWORD,
  } as UserCredentials,

  problem: {
    username: process.env.PROBLEM_USER ?? 'problem_user',
    password: PASSWORD,
  } as UserCredentials,

  performanceGlitch: {
    username: process.env.PERFORMANCE_GLITCH_USER ?? 'performance_glitch_user',
    password: PASSWORD,
  } as UserCredentials,

  error: {
    username: process.env.ERROR_USER ?? 'error_user',
    password: PASSWORD,
  } as UserCredentials,

  visual: {
    username: process.env.VISUAL_USER ?? 'visual_user',
    password: PASSWORD,
  } as UserCredentials,
} as const;
