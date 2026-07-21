import { Router } from 'express';
import { MapEventService } from '../services/map-event.service';
import { mapEventEntityToDtoArray } from '../mappers/map-event.mapper';

const router = Router();
const eventService = new MapEventService();

router.get('/', async (_req, res, next) => {
  try {
    const events = await eventService.getAll();
    res.json(mapEventEntityToDtoArray(events));
  } catch (error) {
    next(error);
  }
});

export default router;