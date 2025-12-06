const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '.env') });

const sequelize = new Sequelize(
    process.env.DB_NAME || "textisur_db",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "",
    {
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
        logging: console.log,
    }
);

// We need to import the models so they register with the sequelize instance
// However, since models are TS files using ES modules, we can't easily require them directly in a JS script executed by node
// without compilation or ts-node.
// A simpler way for this environment might be to allow Sequelize to sync when the app starts or use a dedicated TS script running with tsx (which is available in package.json).

// Let's create a ts script instead that uses the existing setup.
console.log("This file is a placeholder. Please run 'npx tsx src/scripts/sync-db.ts'");
