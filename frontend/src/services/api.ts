import axios from 'axios';
import {
  User, Patient, Observation, ObservationExtractionResult,
  Handover, BurnoutRisk, CareTask, AlertItem, FamilyDiscussion,
  FamilySummary, ClinicalScenario, GuidanceResponse, DashboardSummary,
  PatientIntelligence
} from '../types';

const getApiBaseUrl = (): string => {
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim();
  }
  if (import.meta.env.DEV) {
    return 'http://localhost:8080/api';
  }
  // Production mode: never fall back to localhost
  return '/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('carepulse_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      // Avoid looping if already on login
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register') && window.location.pathname !== '/') {
        localStorage.removeItem('carepulse_token');
        localStorage.removeItem('carepulse_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  login: (data: any) => api.post('/auth/login', data).then(r => r.data),
  register: (data: any) => api.post('/auth/register', data).then(r => r.data),
  getMe: () => api.get('/auth/me').then(r => r.data),
};

export const patientApi = {
  getAll: () => api.get<{ success: boolean; data: Patient[] }>('/patients').then(r => r.data.data),
  getById: (id: number) => api.get<{ success: boolean; data: Patient }>(`/patients/${id}`).then(r => r.data.data),
  getTimeline: (id: number) => api.get<{ success: boolean; data: Observation[] }>(`/patients/${id}/timeline`).then(r => r.data.data),
  getIntelligence: (id: number) => api.get<PatientIntelligence>(`/intelligence/patient/${id}/changes`).then(r => r.data),
};

export const observationApi = {
  analyze: (data: { patientId: number; rawText: string; inputMethod?: string }) =>
    api.post<{ success: boolean; data: ObservationExtractionResult }>('/observations/analyze', data).then(r => r.data.data),
  confirm: (data: { patientId: number; rawText: string; inputMethod?: string; audioDurationSeconds?: number; extractedData?: any }) =>
    api.post<{ success: boolean; data: Observation }>('/observations/confirm', data).then(r => r.data.data),
  getByPatient: (patientId: number) =>
    api.get<{ success: boolean; data: Observation[] }>(`/observations/patient/${patientId}`).then(r => r.data.data),
  getRecent: () =>
    api.get<{ success: boolean; data: Observation[] }>('/observations/recent').then(r => r.data.data),
};

export const handoverApi = {
  generate: (data: { patientId: number; shiftName?: string }) =>
    api.post<{ success: boolean; data: Handover }>('/handover/generate', data).then(r => r.data.data),
  getByPatient: (patientId: number) =>
    api.get<{ success: boolean; data: Handover[] }>(`/handover/patient/${patientId}`).then(r => r.data.data),
  getRecent: () =>
    api.get<{ success: boolean; data: Handover[] }>('/handover/recent').then(r => r.data.data),
  markReviewed: (id: number) =>
    api.put<{ success: boolean; data: Handover }>(`/handover/${id}/review`).then(r => r.data.data),
};

export const burnoutApi = {
  getCurrent: () =>
    api.get<{ success: boolean; data: BurnoutRisk }>('/burnout/current').then(r => r.data.data),
  getByCaregiver: (id: number) =>
    api.get<{ success: boolean; data: BurnoutRisk }>(`/burnout/caregiver/${id}`).then(r => r.data.data),
  recordCheckin: (data: { moodRating: string; notes?: string; caregiverId?: number }) =>
    api.post<{ success: boolean; data: BurnoutRisk }>('/burnout/checkin', data).then(r => r.data.data),
  getHistory: (caregiverId?: number) =>
    api.get(`/burnout/checkin/history${caregiverId ? `?caregiverId=${caregiverId}` : ''}`).then(r => r.data.data),
};

export const taskApi = {
  getAll: (params?: { patientId?: number; caregiverId?: number }) =>
    api.get<{ success: boolean; data: CareTask[] }>('/tasks', { params }).then(r => r.data.data),
  create: (data: Partial<CareTask>) =>
    api.post<{ success: boolean; data: CareTask }>('/tasks', data).then(r => r.data.data),
  updateStatus: (id: number, status: string) =>
    api.put<{ success: boolean; data: CareTask }>(`/tasks/${id}/status?status=${status}`).then(r => r.data.data),
  reassign: (data: { taskId: number; newCaregiverId: number; reason?: string }) =>
    api.post<{ success: boolean; data: CareTask }>('/tasks/reassign', data).then(r => r.data.data),
  delete: (id: number) =>
    api.delete(`/tasks/${id}`).then(r => r.data),
};

export const familyApi = {
  getGroup: (patientId: number) => api.get(`/family/group/${patientId}`).then(r => r.data.data),
  getMembers: (patientId: number) => api.get(`/family/members/${patientId}`).then(r => r.data.data),
  getDiscussions: (patientId: number) => api.get<{ success: boolean; data: FamilyDiscussion[] }>(`/family/discussions/${patientId}`).then(r => r.data.data),
  postDiscussion: (data: { patientId: number; message: string; category?: string; parentMessageId?: number }) =>
    api.post<{ success: boolean; data: FamilyDiscussion }>('/family/discussions', data).then(r => r.data.data),
  getSummary: (patientId: number) => api.get<{ success: boolean; data: FamilySummary }>(`/family/summary/${patientId}`).then(r => r.data.data),
};

export const guidanceApi = {
  getScenarios: () => api.get<{ success: boolean; data: ClinicalScenario[] }>('/guidance/scenarios').then(r => r.data.data),
  query: (query: string) => api.post<{ success: boolean; data: GuidanceResponse }>('/guidance/query', { query }).then(r => r.data.data),
};

export const alertApi = {
  getAll: (params?: { unresolvedOnly?: boolean; patientId?: number }) =>
    api.get<{ success: boolean; data: AlertItem[] }>('/alerts', { params }).then(r => r.data.data),
  markRead: (id: number) => api.put<{ success: boolean; data: AlertItem }>(`/alerts/${id}/read`).then(r => r.data.data),
  resolve: (id: number) => api.put<{ success: boolean; data: AlertItem }>(`/alerts/${id}/resolve`).then(r => r.data.data),
};

export const dashboardApi = {
  getSummary: () => api.get<{ success: boolean; data: DashboardSummary }>('/dashboard').then(r => r.data.data),
};

export default api;