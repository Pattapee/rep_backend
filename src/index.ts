import bodyParser from 'body-parser';
import * as cors from 'cors';
import dotenv from 'dotenv';
import * as express from 'express';
import helmet from 'helmet';
import routes from './api';

// Create a new express application instance
dotenv.config();
const port = process.env.SERVER_PORT;
const app = express.default();

// Call midlewares
app.use(cors.default());
app.use(helmet());
app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }));

// Set all routes from routes folder.
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
