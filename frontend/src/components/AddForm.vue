<template>
  <div class="add-form" v-if="show">
    <div class="form-content">
      <h3>Добавить объект</h3>

      <div class="field">
        <label>Название</label>
        <input v-model="title" type="text" placeholder="Введите название" required />
      </div>

      <div class="field">
        <label>Тип</label>
        <select v-model="type">
          <option value="vehicle">Транспорт</option>
          <option value="person">Персона</option>
          <option value="sensor">Датчик</option>
        </select>
      </div>

      <div class="field">
        <label>Статус</label>
        <select v-model="status">
          <option value="active">Активный</option>
          <option value="warning">Предупреждение</option>
          <option value="offline">Недоступен</option>
        </select>
      </div>

      <div class="field">
        <label>Координаты (долгота, широта)</label>
        <div class="coord-row">
          <input
            type="number"
            step="0.0001"
            min="-180"
            max="180"
            v-model.number="coords[0]"
            placeholder="долгота"
          />
          <input
            type="number"
            step="0.0001"
            min="-90"
            max="90"
            v-model.number="coords[1]"
            placeholder="широта"
          />
        </div>
      </div>

      <div class="form-actions">
        <button class="btn btn-primary" @click="handleAdd" :disabled="!canSubmit">Добавить</button>
        <button class="btn btn-secondary" @click="emit('cancel')">Отмена</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { MapObjectType, MapObjectStatus } from '@/types/enum-types';
import type { CreateObjectInput } from '@/types/dto/map-object.dto';

const props = defineProps<{
  show: boolean;
  coords?: [number, number];
}>();

const emit = defineEmits<{
  add: [data: CreateObjectInput];
  cancel: [];
}>();

const title = ref('');
const type = ref<MapObjectType>('vehicle');
const status = ref<MapObjectStatus>('active');
  const coords = ref<[number, number]>([56.3167, 58.0000]);

watch(
  () => props.coords,
  (value) => {
    if (value) coords.value = [roundCoord(value[0]), roundCoord(value[1])];
  },
  { immediate: true }
);

const canSubmit = computed(() => title.value.trim().length > 0);

function roundCoord(value: number): number {
  return Math.round(value * 10000) / 10000;
}

function handleAdd(): void {
  if (!canSubmit.value) return;
  emit('add', {
    title: title.value.trim(),
    type: type.value,
    status: status.value,
    coordinates: [roundCoord(coords.value[0]), roundCoord(coords.value[1])],
  });
  title.value = '';
}
</script>

<style scoped>
.add-form {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.form-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 360px;
  max-width: 90vw;
}

.form-content h3 {
  margin: 0 0 16px;
  font-size: 18px;
}

.field {
  margin-bottom: 12px;
}

.field label {
  display: block;
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 4px;
}

  .field input,
  .field select {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
  }

  .field span {
    display: block;
    font-size: 13px;
    color: #374151;
  }

  .coord-row {
    display: flex;
    gap: 8px;
  }

  .coord-row input {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
  }

.form-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.btn {
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background: #d1d5db;
}
</style>
