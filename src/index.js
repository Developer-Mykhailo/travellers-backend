import { initMongoDB } from './db/initMongoDB.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';
import { startServer } from './server.js';

try {
  await initMongoDB();
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  startServer();
} catch (error) {
  console.error('App failed to start:', error.message);
  process.exit(1);
}
