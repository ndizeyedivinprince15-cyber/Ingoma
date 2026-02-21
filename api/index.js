const app = require("./apps/api/dist/main"); module.exports = (req, res) => { return app(req, res); };
