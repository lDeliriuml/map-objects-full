import { v4 as uuidv4 } from 'uuid';
import { pool } from '../db';
import type { MapObjectEntity } from '../types/entity/map-object.entity';
import type { CreateMapObjectDto, UpdateMapObjectDto } from '../types/dto/map-object.dto';

const toDomain = (row: Record<string, unknown>): MapObjectEntity => ({
  id: String(row.id),
  title: String(row.title),
  type: row.type as MapObjectEntity['type'],
  status: row.status as MapObjectEntity['status'],
  coordinates: [
    Number((row.coordinates as unknown[])[0]),
    Number((row.coordinates as unknown[])[1]),
  ],
  createdAt: new Date(String(row.created_at)).toISOString(),
  updatedAt: new Date(String(row.updated_at)).toISOString(),
});

export const mapObjectRepository = {
  async findAll(): Promise<MapObjectEntity[]> {
    const result = await pool.query('SELECT * FROM objects ORDER BY created_at DESC');
    return result.rows.map(toDomain);
  },

  async findById(id: string): Promise<MapObjectEntity | null> {
    const result = await pool.query('SELECT * FROM objects WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return toDomain(result.rows[0]);
  },

  async create(dto: CreateMapObjectDto): Promise<MapObjectEntity> {
    const id = uuidv4();
    const now = new Date().toISOString();
    const result = await pool.query(
      'INSERT INTO objects (id, title, type, status, coordinates, created_at, updated_at) VALUES ($1, $2, $3, $4, $5::numeric[], $6, $7) RETURNING *',
      [id, dto.title, dto.type, dto.status, dto.coordinates, now, now]
    );
    return toDomain(result.rows[0]);
  },

  async update(id: string, dto: UpdateMapObjectDto): Promise<MapObjectEntity | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let index = 1;

    if (dto.title !== undefined) {
      fields.push(`title = $${index++}`);
      values.push(dto.title);
    }
    if (dto.type !== undefined) {
      fields.push(`type = $${index++}`);
      values.push(dto.type);
    }
    if (dto.status !== undefined) {
      fields.push(`status = $${index++}`);
      values.push(dto.status);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = $${index++}`);
    values.push(new Date().toISOString());
    values.push(id);

    const result = await pool.query(
      `UPDATE objects SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`,
      values
    );
    if (result.rows.length === 0) return null;
    return toDomain(result.rows[0]);
  },

  async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM objects WHERE id = $1 RETURNING id', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  },
};
