import "dotenv/config";
import app from "./app";
import env from "./config/env";

app.listen(env.PORT, () => {
  console.log(`server is running at port ${env.PORT}`);
});
