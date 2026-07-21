import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { RemoteMapEventService } from '@/services/map-event/remote-map-event.service';
import { ApiValidationError } from '@/schemas/index';
import type { MapEventDto } from '@/types/dto/map-event.dto';

vi.mock('axios', () => {
  const instance = {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  };
  return {
    default: {
      create: () => instance,
    },
    __esModule: true,
    ...instance,
  };
});

const mockedApi = axios.create({}) as unknown as {
  get: ReturnType<typeof vi.fn>;
};

const sampleDto: MapEventDto = {
  id: 'evt-1',
  objectId: 'obj-1',
  message: 'Alert',
  severity: 'critical',
  createdAt: '2026-07-17T10:00:00.000Z',
};

describe('RemoteMapEventService', () => {
  let service: RemoteMapEventService;

  beforeEach(() => {
    service = new RemoteMapEventService();
    vi.clearAllMocks();
  });

  it('getAll fetches /events and maps to domain', async () => {
    mockedApi.get.mockResolvedValue({ data: [sampleDto] });
    const result = await service.getAll();
    expect(mockedApi.get).toHaveBeenCalledWith('/events');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('evt-1');
    expect(result[0].severity).toBe('critical');
  });

  it('getAll maps null objectId', async () => {
    mockedApi.get.mockResolvedValue({ data: [{ ...sampleDto, objectId: null }] });
    const result = await service.getAll();
    expect(result[0].objectId).toBeNull();
  });

  it('getAll throws ApiValidationError on invalid response', async () => {
    mockedApi.get.mockResolvedValue({ data: [{ id: 'bad' }] });
    await expect(service.getAll()).rejects.toBeInstanceOf(ApiValidationError);
  });
});
