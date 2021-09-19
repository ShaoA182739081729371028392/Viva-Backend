//For secure connection:
const fs = require("fs");

module.exports = {
    type: "cockroachdb",
    host: "free-tier.gcp-us-central1.cockroachlabs.cloud",
    port: 26257,
    username: "shaoa182739081729371",
    password: "Viva12345678",
    database: "super-deer-3433.defaultdb",
    //For secure connection:
    ssl: {
        ca: fs.readFileSync('certs/root.crt').toString()
    },
    synchronize: true,
    logging: false,
    entities: ["dist/**/*.entity.js"],
    // migrations: ["src/migration/**/*.ts"],
    // subscribers: ["src/subscriber/**/*.ts"],
    cli: {
        entitiesDir: "dist/**/*.entity.js",
        // migrationsDir: "src/migration",
        // subscribersDir: "src/subscriber",
    },
};