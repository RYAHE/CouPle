import { ApiResponse, AppError, AppConfig } from '../types';

class ApiService {
  private baseURL: string;
  private token: string | null = null;
  private config: AppConfig;

  constructor() {
    this.config = {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.couple-app.com',
      wsUrl: process.env.EXPO_PUBLIC_WS_URL || 'wss://ws.couple-app.com',
      environment: (process.env.EXPO_PUBLIC_ENVIRONMENT as any) || 'development',
      version: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
      buildNumber: process.env.EXPO_PUBLIC_BUILD_NUMBER || '1',
      features: {
        chat: true,
        calendar: true,
        tasks: true,
        memories: true,
        location: true,
        notifications: true,
      },
    };
    this.baseURL = this.config.apiUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-App-Version': this.config.version,
        'X-Build-Number': this.config.buildNumber,
        ...options.headers,
      };

      if (this.token) {
        (headers as any)['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    partnerEmail?: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async refreshToken() {
    return this.request('/auth/refresh', {
      method: 'POST',
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // User endpoints
  async getProfile() {
    return this.request('/user/profile');
  }

  async updateProfile(profileData: Partial<any>) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getCoupleInfo() {
    return this.request('/user/couple');
  }

  // Messages endpoints
  async getMessages(partnerId: string, page = 1, limit = 20) {
    return this.request(`/messages?partnerId=${partnerId}&page=${page}&limit=${limit}`);
  }

  async sendMessage(messageData: {
    receiverId: string;
    text: string;
    type?: 'text' | 'image' | 'voice' | 'location';
    metadata?: any;
  }) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async markMessageAsRead(messageId: string) {
    return this.request(`/messages/${messageId}/read`, {
      method: 'PUT',
    });
  }

  // Events endpoints
  async getEvents(month?: string, year?: string) {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    
    return this.request(`/events?${params.toString()}`);
  }

  async createEvent(eventData: Partial<any>) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(eventId: string, eventData: Partial<any>) {
    return this.request(`/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(eventId: string) {
    return this.request(`/events/${eventId}`, {
      method: 'DELETE',
    });
  }

  // Tasks endpoints
  async getTasks(filters?: {
    status?: 'all' | 'pending' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    assignedTo?: 'me' | 'partner' | 'both';
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    
    return this.request(`/tasks?${params.toString()}`);
  }

  async createTask(taskData: Partial<any>) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(taskId: string, taskData: Partial<any>) {
    return this.request(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(taskId: string) {
    return this.request(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  // Memories endpoints
  async getMemories(filters?: {
    type?: 'photo' | 'note' | 'moment' | 'video';
    tags?: string[];
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.append(key, value);
          }
        }
      });
    }
    
    return this.request(`/memories?${params.toString()}`);
  }

  async createMemory(memoryData: Partial<any>) {
    return this.request('/memories', {
      method: 'POST',
      body: JSON.stringify(memoryData),
    });
  }

  async updateMemory(memoryId: string, memoryData: Partial<any>) {
    return this.request(`/memories/${memoryId}`, {
      method: 'PUT',
      body: JSON.stringify(memoryData),
    });
  }

  async deleteMemory(memoryId: string) {
    return this.request(`/memories/${memoryId}`, {
      method: 'DELETE',
    });
  }

  // Upload endpoints
  async uploadImage(file: File | Blob, type: 'memory' | 'avatar' = 'memory') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request('/upload/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  }

  // Settings endpoints
  async getSettings() {
    return this.request('/settings');
  }

  async updateSettings(settings: Partial<any>) {
    return this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Notifications endpoints
  async getNotifications(page = 1, limit = 20) {
    return this.request(`/notifications?page=${page}&limit=${limit}`);
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PUT',
    });
  }

  // Analytics endpoints
  async trackEvent(eventData: {
    name: string;
    properties?: Record<string, any>;
  }) {
    return this.request('/analytics/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
export default apiService; 