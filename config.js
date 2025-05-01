
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    port: process.env.PORT,
    dburl: process.env.DB_URL,
};