import type { MapObjectEntity } from '../types/entity/map-object.entity';
import type { MapObjectDto } from '../types/dto/map-object.dto';

export function mapObjectEntityToDto(entity: MapObjectEntity): MapObjectDto {
  return {
    id: entity.id,
    title: entity.title,
    type: entity.type,
    status: entity.status,
    coordinates: entity.coordinates,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

export function mapObjectEntityToDtoArray(entities: MapObjectEntity[]): MapObjectDto[] {
  return entities.map(mapObjectEntityToDto);
}
