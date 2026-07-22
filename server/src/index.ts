import app from "./app";
import { env } from "./config/env";

const PORT = Number(env.PORT);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});