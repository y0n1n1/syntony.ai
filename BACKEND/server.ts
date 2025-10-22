import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { userRouter } from './db/user/userRoutes'; // Adjust as per your project structure
import { searchRouter } from './db/search_algorithm/searchRouter';
import { messageRouter } from './db/message/messageRoutes';
import { savedFolderRouter } from './db/saved_folder/savedFolderRouter';
import { savedArticleRouter } from './db/saved_article/savedArticleRouter';
import { pinnedFolderRouter } from './db/pinned/pinnedFolderRouter';
import { articleRouter } from './db/article/articleRouter';
import { authorRouter } from './db/author/authorRouter';
import { topicRouter } from './db/topic/topicRouter';

const app: Application = express();
const PORT = 8080;

/*

import { pinnedFolderRouter } from './db/pinned/pinnedFolderRouter';
import { articleRouter } from './db/article/articleRouter';
import { authorRouter } from './db/author/authorRouter';
import { topicRouter } from './db/topic/topicRouter';
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { userRouter } from './db/userRoutes'; // Adjust as per your project structure
import { searchRouter } from './db/searchRoutes';
import { messageRouter } from './db/messageRoutes';
import { savedFolderRouter } from './db/savedFolderRouter';
import { savedArticleRouter } from './db/savedArticleRouter';

const app: Application = express();
const PORT = 80;


const corsOptions = {
  origin: ['https://syntony.ai', 'https://www.syntony.ai'], // Allow requests from both syntony.ai and www.syntony.ai
  optionsSuccessStatus: 200 // For older browsers that choke on 204
};

// Middleware
app.use(bodyParser.json());

app.use(cors(corsOptions)); // Apply CORS configuration


*/

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/users', userRouter);


// Routes
app.use('/api/messages', messageRouter);

// Routes
app.use('/api/saved_folder/', savedFolderRouter);

// Routes
app.use('/api/saved_article/', savedArticleRouter);

app.use('/api/pinned_folder/', pinnedFolderRouter)

app.use('/api/article/', articleRouter)

app.use('/api/author/', authorRouter)

app.use('/api/topic/', topicRouter)


app.use('/api/search', searchRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
