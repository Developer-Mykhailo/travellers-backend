import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import helmet from 'helmet';

import { getEnvVar } from './utils/getEnvVar.js';

//---------------------------------------------------------------

const PORT = Number(getEnvVar('PORT', 3001));
console.log(PORT);

export const startServer = async () => {
  const app = express();

  app.use(express.json());
  app.use(helmet());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
