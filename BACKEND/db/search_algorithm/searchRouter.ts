import { Router, Request, Response } from 'express';
import { getHistoryByUserId } from '../searchHistoryController';
import { PremetaSearchCriteria, searchGeneral } from './search';
import { searchTopicSolely } from './individualized_algorithms/topicSearch';

const router = Router();


router.post('/history', async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body; // Updated to new naming convention
    const hist = await getHistoryByUserId(user_id);
    if (hist) {
      res.status(200).json(hist);
    } else {
      res.status(404).json({ error: 'History not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching history' });
  }
});


// Define a POST route for /search
router.post('/', async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const criteriaList: PremetaSearchCriteria = req.body.metaSearchCriteria;
    const userInfo: undefined | string = req.body.userId;
    const res_p_p: number = req.body.resultsPerPage;
    const p_n: number = req.body.pageNumber;

    if (!criteriaList) {
      return res.status(400).json({ error: 'Search criteria is required' });
    }
    if (typeof res_p_p !== 'number' || res_p_p <= 0) {
        return res.status(400).json({ error: 'Results per page must be a positive number' });
    }
    if (typeof p_n !== 'number' || p_n < 0) {
        return res.status(400).json({ error: 'Page number must be a non-negative number' });
    }
    console.log("calling const results = await searchGeneral(userInfo, res_p_p, p_n, criteriaList);")
    const results = await searchGeneral(userInfo, res_p_p, p_n, criteriaList);

    return res.status(200).json(results);
  } catch (error) {
    console.error('Error searching articles:', error);
    return res.status(500).json({ error: 'Error searching articles' });
  }
});


// Define a POST route for /search
router.post('/topic', async (req: Request, res: Response) => {
  try {
    const q: string = req.body.q;

    if (!q) {
      return res.status(400).json({ error: 'Search criteria is required' });
    }

    const results = await searchTopicSolely(q);

    return res.status(200).json(results);
  } catch (error) {
    console.error('Error searching topics:', error);
    return res.status(500).json({ error: 'Error searching topics' });
  }
});

export { router as searchRouter };
