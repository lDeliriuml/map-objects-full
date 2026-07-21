import type { MapObjectDto } from '@/types/dto/map-object.dto';
import type { MapObject } from '@/types/model/map-object.model';

export function mapDtoToDomain(dto: MapObjectDto): MapObject {
  return {
    id: dto.id,
    title: dto.title,
    type: dto.type,
    status: dto.status,
    coordinates: dto.coordinates,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export function mapDtoToDomainArray(dtoList: MapObjectDto[]): MapObject[] {
  return dtoList.map(mapDtoToDomain);
}
