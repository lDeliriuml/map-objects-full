import type { MapEventEntity } from '../types/entity/map-event.entity';
import type { MapEventDto } from '../types/dto/map-event.dto';

export function mapEventEntityToDto(entity: MapEventEntity): MapEventDto {
  return {
    id: entity.id,
    objectId: entity.objectId,
    message: entity.message,
    severity: entity.severity,
    createdAt: entity.createdAt,
  };
}

export function mapEventEntityToDtoArray(entities: MapEventEntity[]): MapEventDto[] {
  return entities.map(mapEventEntityToDto);
}
