import { Router } from 'express';
import { MapObjectService } from '../services/map-object.service';
import { mapObjectEntityToDto, mapObjectEntityToDtoArray } from '../mappers/map-object.mapper';

const router = Router();
const objectService = new MapObjectService();

router.get('/', async (_req, res, next) => {
  try {
    const objects = await objectService.getAll();
    res.json(mapObjectEntityToDtoArray(objects));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const obj = await objectService.create(req.body);
    res.status(201).json(mapObjectEntityToDto(obj));
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const obj = await objectService.update(req.params.id, req.body);
    if (!obj) {
      return res.status(404).json({ error: 'Object not found' });
    }
    res.json(mapObjectEntityToDto(obj));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await objectService.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Object not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;