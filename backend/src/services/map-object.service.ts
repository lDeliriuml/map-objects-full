import type { CreateMapObjectDto, UpdateMapObjectDto } from '../types/dto/map-object.dto';

import type { MapObjectEntity } from '../types/entity/map-object.entity';
import { mapObjectRepository } from '../repository/map-object.repository';
import { mapEventRepository } from '../repository/map-event.repository';
import { CreateMapObjectSchema, UpdateMapObjectSchema } from '../schemas';
import { ValidationError } from '../errors';

function toIssues(error: import('zod').ZodError): { field: string; message: string }[] {
  return error.errors.map((e) => ({
    field: e.path.join('.') || '(root)',
    message: e.message,
  }));
}

export class MapObjectService {
  async getAll(): Promise<MapObjectEntity[]> {
    return mapObjectRepository.findAll();
  }

  async create(dto: CreateMapObjectDto) {
    const parseResult = CreateMapObjectSchema.safeParse(dto);
    if (!parseResult.success) {
      throw new ValidationError(toIssues(parseResult.error));
    }

    const obj = await mapObjectRepository.create(parseResult.data);
    await mapEventRepository.create(
      obj.id,
      `Объект "${obj.title}" создан`,
      'info'
    );
    return obj;
  }

  async update(id: string, dto: UpdateMapObjectDto) {
    const parseResult = UpdateMapObjectSchema.safeParse(dto);
    if (!parseResult.success) {
      throw new ValidationError(toIssues(parseResult.error));
    }

    const existing = await mapObjectRepository.findById(id);
    if (!existing) {
      return null;
    }

    const updated = await mapObjectRepository.update(id, parseResult.data);
    if (!updated) return null;

    const statusChanged = dto.status && dto.status !== existing.status;
    if (statusChanged) {
      await mapEventRepository.create(
        updated.id,
        `Статус объекта "${updated.title}" изменен с "${existing.status}" на "${dto.status}"`,
        'warning'
      );
    }

    return updated;
  }

  async remove(id: string) {
    const existing = await mapObjectRepository.findById(id);
    if (!existing) {
      return false;
    }

    await mapEventRepository.create(
      id,
      `Объект "${existing.title}" удален`,
      'critical'
    );

    const deleted = await mapObjectRepository.delete(id);
    return deleted;
  }
}