const { Client } = require('pg');

// Database connection configuration
const client = new Client({
    host: 'localhost',      // Database host
    port: 5432,             // Default PostgreSQL port
    user: '',  // Your PostgreSQL username
    password: 'postgres', // Your PostgreSQL password
    database: ''  // Your database name
});

async function main() {
    try {
        // Connect to PostgreSQL
        await client.connect();
        console.log('✅ Connected to PostgreSQL');

        // INSERT example
        const insertText = 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *';
        const insertValues = ['Alice', 'alice@example.com'];
        const insertRes = await client.query(insertText, insertValues);
        console.log('Inserted:', insertRes.rows[0]);

        // SELECT example
        const selectRes = await client.query('SELECT * FROM users');
        console.log('All users:', selectRes.rows);

    } catch (err) {
        console.error('❌ Database error:', err.message);
    } finally {
        // Always close the connection
        await client.end();
        console.log('🔌 Connection closed');
    }
}

// Run the main function
main();