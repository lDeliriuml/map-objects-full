import app from './index.js';
import { initializeDatabase } from './db';

const PORT = Number(process.env.PORT ?? 3001);

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
