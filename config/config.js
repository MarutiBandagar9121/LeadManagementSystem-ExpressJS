require("dotenv").config();

const config = {
    port: process.env.PORT || 3000,
    mongoUsername: process.env.MONGO_USERNAME,
    mongoPassword: process.env.MONGO_PASSWORD,
    mongoHost: process.env.MONGO_HOST,
    mongoDbName: process.env.MONGO_DB_NAME,
    mongoPort: process.env.MONGO_PORT,
}

// Validate required conf values
const requiredConfig = ['mongoUsername', 'mongoPassword', 'mongoHost', 'mongoPort', 'mongoDbName'];
const missingConfig = [];

requiredConfig.forEach(key => {
    if (!config[key] || config[key].trim() === '') {
        missingConfig.push(key);
    }
});

if (missingConfig.length > 0) {
    throw new Error(`Missing required environment variables: ${missingConfig.join(', ')}. Application cannot start.`);
}

module.exports = config;