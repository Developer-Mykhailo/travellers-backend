import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import helmet from 'helmet';

import router from './routers/index.js';
import { getEnvVar } from './utils/getEnvVar.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';

//---------------------------------------------------------------

const PORT = Number(getEnvVar('PORT', 3001));

export const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(helmet());
  app.use(cors());
  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use('/api', router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
