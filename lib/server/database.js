import './env.js';
import pkg from 'pg';

const { Pool } = pkg;

const createPool = () => {
  const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  const shouldUseSsl =
    process.env.PGSSLMODE === 'require' ||
    process.env.NODE_ENV === 'production' ||
    Boolean(connectionString?.includes('supabase'));

  if (connectionString) {
    return new Pool({
      connectionString,
      ssl: shouldUseSsl
        ? { rejectUnauthorized: process.env.PG_SSL_REJECT_UNAUTHORIZED !== 'false' }
        : false,
    });
  }

  return new Pool({
    host: process.env.PGHOST || 'localhost',
    port: Number(process.env.PGPORT || 5432),
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'demographic',
    ssl: shouldUseSsl
      ? { rejectUnauthorized: process.env.PG_SSL_REJECT_UNAUTHORIZED !== 'false' }
      : false,
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
