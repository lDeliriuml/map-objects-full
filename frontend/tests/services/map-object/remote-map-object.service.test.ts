import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { RemoteMapObjectService } from '@/services/map-object/remote-map-object.service';
import { ApiValidationError } from '@/schemas/index';
import type { MapObjectDto } from '@/types/dto/map-object.dto';

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
  post: ReturnType<typeof vi.fn>;
  patch: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

const sampleDto: MapObjectDto = {
  id: 'obj-1',
  title: 'Test',
  type: 'vehicle',
  status: 'active',
  coordinates: [37.6, 55.7],
  createdAt: '2026-07-17T10:00:00.000Z',
  updatedAt: '2026-07-17T11:00:00.000Z',
};

describe('RemoteMapObjectService', () => {
  let service: RemoteMapObjectService;

  beforeEach(() => {
    service = new RemoteMapObjectService();
    vi.clearAllMocks();
  });

  it('getAll fetches /objects and maps to domain', async () => {
    mockedApi.get.mockResolvedValue({ data: [sampleDto] });
    const result = await service.getAll();
    expect(mockedApi.get).toHaveBeenCalledWith('/objects');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('obj-1');
    expect(result[0].type).toBe('vehicle');
  });

  it('create posts input and returns created object', async () => {
    mockedApi.post.mockResolvedValue({ data: sampleDto });
    const created = await service.create({
      title: 'Test',
      type: 'vehicle',
      status: 'active',
      coordinates: [37.6, 55.7],
    });
    expect(mockedApi.post).toHaveBeenCalledWith('/objects', {
      title: 'Test',
      type: 'vehicle',
      status: 'active',
      coordinates: [37.6, 55.7],
    });
    expect(created.id).toBe('obj-1');
  });

  it('update patches /objects/:id and returns object', async () => {
    mockedApi.patch.mockResolvedValue({ status: 200, data: sampleDto });
    const result = await service.update('obj-1', { status: 'offline' });
    expect(mockedApi.patch).toHaveBeenCalledWith('/objects/obj-1', { status: 'offline' });
    expect(result).not.toBeNull();
    expect(result!.id).toBe('obj-1');
  });

  it('update returns null when server responds 404', async () => {
    mockedApi.patch.mockResolvedValue({ status: 404, data: null });
    const result = await service.update('missing', { title: 'X' });
    expect(result).toBeNull();
  });

  it('remove deletes /objects/:id and returns true', async () => {
    mockedApi.delete.mockResolvedValue({});
    const result = await service.remove('obj-1');
    expect(mockedApi.delete).toHaveBeenCalledWith('/objects/obj-1');
    expect(result).toBe(true);
  });

  it('getAll throws ApiValidationError on invalid response', async () => {
    mockedApi.get.mockResolvedValue({ data: [{ id: 'bad' }] });
    await expect(service.getAll()).rejects.toBeInstanceOf(ApiValidationError);
  });
});
