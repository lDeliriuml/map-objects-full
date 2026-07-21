import type { MapObjectApiService } from './interfaces/map-object.api.service';
import type { MapEventApiService } from './interfaces/map-event.api.service';
import { RemoteMapObjectService, MockMapObjectService } from './map-object/index';
import { RemoteMapEventService, MockMapEventService } from './map-event/index';

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

export const objectService: MapObjectApiService = useMocks
  ? new MockMapObjectService()
  : new RemoteMapObjectService();

export const eventService: MapEventApiService = useMocks
  ? new MockMapEventService()
  : new RemoteMapEventService();

