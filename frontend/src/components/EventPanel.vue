<template>
  <div class="event-panel">
    <h3 class="panel-title">Последние события</h3>

    <div v-if="loading" class="loading">Загрузка...</div>

    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else-if="events.length === 0" class="empty">Нет событий</div>

    <ul v-else class="event-list">
      <li
        v-for="event in events"
        :key="event.id"
        class="event-item"
        :class="'severity-' + event.severity"
      >
        <span class="severity-dot" :style="{ background: getSeverityColor(event.severity) }"></span>
        <div class="event-content">
          <span class="event-message">{{ event.message }}</span>
          <span class="event-time">{{ formatDate(event.createdAt) }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { MapEvent } from '@/types/model/map-event.model';
import { formatDateTime, getSeverityColor } from '@/utils/helpers';

defineProps<{
  events: MapEvent[];
  loading: boolean;
  error: string | null;
}>();

function formatDate(dateStr: string): string {
  return formatDateTime(dateStr);
}
</script>

<style scoped>
.event-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-title {
  margin: 0;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
}

.loading, .error, .empty {
  padding: 16px;
  text-align: center;
  font-size: 13px;
  color: #6b7280;
}

.error {
  color: #ef4444;
}

.event-list {
  list-style: none;
  margin: 0;
  padding: 8px;
  overflow-y: auto;
  flex: 1;
}

.event-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  margin-bottom: 4px;
  background: #f9fafb;
}

.event-item.severity-critical {
  background: #fef2f2;
  border-left: 3px solid #ef4444;
}

.event-item.severity-warning {
  background: #fffbeb;
  border-left: 3px solid #f59e0b;
}

.event-item.severity-info {
  background: #f0fdf4;
  border-left: 3px solid #22c55e;
}

.severity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
}

.event-content {
  flex: 1;
  min-width: 0;
}

.event-message {
  display: block;
  font-size: 13px;
  color: #374151;
  overflow: hidden;
}

.event-time {
  display: block;
  font-size: 11px;
  color: #9ca3af;
  margin-top: 2px;
}
</style>
