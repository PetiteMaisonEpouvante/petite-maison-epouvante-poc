import apiClient from './client';
import type { Report, ReportReason, ReportTargetType } from '../types';

export const createReport = (data: {
  reason: ReportReason;
  details?: string;
  targetType: ReportTargetType;
  listingId?: string;
  messageId?: string;
}) => apiClient.post<Report>('/reports', data).then((r) => r.data);
