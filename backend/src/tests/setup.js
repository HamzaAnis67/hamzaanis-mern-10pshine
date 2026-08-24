const pool = require("../config/db");
const logger = require("../utils/logger");

exports.mochaHooks = {
  afterAll: async () => {
    try {
      await pool.end();
    } catch (error) {
      logger.error(`Database pool teardown failed: ${error.message}`);
      throw error;
    }
  },
};
