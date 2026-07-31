const app = require("./src/app");
require("dotenv").config();

// Fix: Safely parse the port to a base-10 integer
const PORT = parseInt(process.env.PORT, 10) || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server listening dynamically on port ${PORT}`);
});
