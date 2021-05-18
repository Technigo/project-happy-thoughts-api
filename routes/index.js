import { Router } from 'express';

import * as thoughts from '../controllers/thoughtsController';

const router = new Router();

router.get('/thoughts', thoughts.getAll)
router.post('/thoughts', thoughts.createOne)
router.post('/thoughts/:id/like', thoughts.updateOne)

export default router;