import express from 'express';
import cors from 'cors';
import './dotenv.js';
import optionsRouter from './routes/options.js';
import jerseysRouter from './routes/jerseys.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/options', optionsRouter);
app.use('/jerseys', jerseysRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});