import { describe, it, expect } from 'vitest';
import { MockMapObjectService } from '@/services/map-object/mock-map-object.service';
import type { MapObject } from '@/types/model/map-object.model';

describe('MockMapObjectService', () => {
  const service = new MockMapObjectService();

  it('getAll returns seeded objects', async () => {
    const result = await service.getAll();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).toBeDefined();
    expect(result[0].title).toBeDefined();
  });

  it('create adds new object', async () => {
    const before = (await service.getAll()).length;
    const created = await service.create({
      title: 'Test Car',
      type: 'vehicle',
      status: 'active',
      coordinates: [37.6, 55.7],
    });
    expect(created.id).toBeDefined();
    expect(created.title).toBe('Test Car');
    const after = await service.getAll();
    expect(after.length).toBe(before + 1);
  });

  it('update modifies existing object', async () => {
    const list = await service.getAll();
    const first = list[0];
    const updated = await service.update(first.id, { status: 'offline' });
    expect(updated).not.toBeNull();
    expect(updated!.status).toBe('offline');
  });

  it('update returns null for non-existent id', async () => {
    const result = await service.update('nonexistent', { title: 'X' });
    expect(result).toBeNull();
  });

  it('remove deletes object', async () => {
    const list = await service.getAll();
    const last = list[list.length - 1];
    const deleted = await service.remove(last.id);
    expect(deleted).toBe(true);
    const after = await service.getAll();
    expect(after.length).toBe(list.length - 1);
  });

  it('remove returns false for non-existent id', async () => {
    const result = await service.remove('nonexistent');
    expect(result).toBe(false);
  });
});
