import './env.js';
import pkg from 'pg';
import { createPostgresSslConfig } from './postgres-ssl.js';

const { Pool } = pkg;
const envValue = (name) => process.env[name]?.trim();

const createPool = () => {
  const connectionString = envValue('DATABASE_URL') || envValue('SUPABASE_DB_URL');
  const ssl = createPostgresSslConfig({ connectionString, envValue });

  if (connectionString) {
    return new Pool({
      connectionString,
      ssl,
    });
  }

  return new Pool({
    host: envValue('PGHOST') || 'localhost',
    port: Number(envValue('PGPORT') || 5432),
    user: envValue('PGUSER') || 'postgres',
    password: envValue('PGPASSWORD') || 'postgres',
    database: envValue('PGDATABASE') || 'demographic',
    ssl,
  });
};

export const pool = createPool();

let schemaReadyPromise;

export const ensureDatabaseSchema = async () => {
  if (!schemaReadyPromise) {
    schemaReadyPromise = (async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          user_id SERIAL PRIMARY KEY,
          auth_user_id UUID,
          full_name TEXT,
          business_name TEXT,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          account_type TEXT NOT NULL DEFAULT 'client',
          business_type TEXT,
          city TEXT,
          phone TEXT,
          last_login TIMESTAMP,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await pool.query(`
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS auth_user_id UUID
      `);

      await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS users_auth_user_id_idx
        ON users (auth_user_id)
        WHERE auth_user_id IS NOT NULL
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS processes (
          process_id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT NOT NULL DEFAULT 'pending',
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS bookkeeping_transactions (
          transaction_id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
          party_name TEXT NOT NULL,
          category TEXT NOT NULL,
          entry_type TEXT NOT NULL,
          amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
          payment_method TEXT,
          transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
          due_date DATE,
          status TEXT NOT NULL DEFAULT 'Pending',
          notes TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
    })().catch((error) => {
      schemaReadyPromise = null;
      throw error;
    });
  }

  await schemaReadyPromise;
};
