import type { MapEventDto } from '@/types/dto/map-event.dto';
import type { MapEvent } from '@/types/model/map-event.model';

export function mapEventDtoToDomain(dto: MapEventDto): MapEvent {
  return {
    id: dto.id,
    objectId: dto.objectId,
    message: dto.message,
    severity: dto.severity,
    createdAt: dto.createdAt,
  };
}

export function mapEventDtoToDomainArray(dtoList: MapEventDto[]): MapEvent[] {
  return dtoList.map(mapEventDtoToDomain);
}
