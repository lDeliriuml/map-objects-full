import { v4 as uuidv4 } from 'uuid';
import { pool } from '../db';
import type { MapEventEntity } from '../types/entity/map-event.entity';

const toEventDomain = (row: Record<string, unknown>): MapEventEntity => ({
  id: row.id as string,
  objectId: (row.object_id as string) ?? null,
  message: row.message as string,
  severity: row.severity as MapEventEntity['severity'],
  createdAt: new Date(row.created_at as string).toISOString(),
});

export const mapEventRepository = {
  async findAll(): Promise<MapEventEntity[]> {
    const result = await pool.query('SELECT * FROM events ORDER BY created_at DESC LIMIT 50');
    return result.rows.map(toEventDomain);
  },

  async create(objectId: string, message: string, severity: MapEventEntity['severity']): Promise<MapEventEntity> {
    const id = uuidv4();
    const now = new Date().toISOString();
    const result = await pool.query(
      'INSERT INTO events (id, object_id, message, severity, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, objectId, message, severity, now]
    );
    return toEventDomain(result.rows[0]);
  },
};
