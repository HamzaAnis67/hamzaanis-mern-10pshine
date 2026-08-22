const pool = require("../config/db");

exports.mochaHooks = {
  afterAll: async () => {
    await pool.end();
  },
};
