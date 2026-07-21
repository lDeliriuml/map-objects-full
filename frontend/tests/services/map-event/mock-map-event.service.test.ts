import { describe, it, expect } from 'vitest';
import { MockMapEventService } from '@/services/map-event/mock-map-event.service';

describe('MockMapEventService', () => {
  const service = new MockMapEventService();

  it('getAll returns seeded events', async () => {
    const result = await service.getAll();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].id).toBeDefined();
    expect(result[0].message).toBeDefined();
  });

  it('returns different objects each call (deep copy)', async () => {
    const a = await service.getAll();
    const b = await service.getAll();
    expect(a[0]).not.toBe(b[0]);
  });
});
