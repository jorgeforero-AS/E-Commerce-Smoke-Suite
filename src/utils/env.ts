import * as dotenv from 'dotenv';

dotenv.config();

// throws early if a required var is missing, better than getting a weird undefined error later
export function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var: "${name}". Check your .env file.`);
  }
  return value;
}

export function getEnvVarOrDefault(name: string, defaultValue: string): string {
  return process.env[name] ?? defaultValue;
}
