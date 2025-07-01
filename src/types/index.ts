// Types pour l'application CouPle

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date;
}

export interface Couple {
  id: string;
  partner1: User;
  partner2: User;
  relationshipStart: Date;
  status: 'active' | 'pending' | 'blocked';
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'image' | 'voice' | 'location';
  metadata?: any;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time?: string;
  location?: string;
  type: 'date' | 'anniversary' | 'meeting' | 'birthday' | 'other';
  createdBy: string;
  isRecurring: boolean;
  recurrence?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  participants: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdBy: string;
  assignedTo: 'me' | 'partner' | 'both';
  dueDate?: Date;
  createdAt: Date;
  completedAt?: Date;
  category?: string;
}

export interface Memory {
  id: string;
  type: 'photo' | 'note' | 'moment' | 'video';
  title: string;
  content: string;
  date: Date;
  createdBy: string;
  imageUrl?: string;
  videoUrl?: string;
  tags: string[];
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  isPrivate: boolean;
}

export interface Notification {
  id: string;
  type: 'message' | 'event' | 'task' | 'memory' | 'system';
  title: string;
  body: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
  userId: string;
}

export interface AppSettings {
  notifications: {
    messages: boolean;
    events: boolean;
    tasks: boolean;
    memories: boolean;
  };
  privacy: {
    locationSharing: boolean;
    profileVisibility: 'public' | 'private' | 'couple';
  };
  theme: 'light' | 'dark' | 'auto';
  language: 'fr' | 'en' | 'es';
  autoBackup: boolean;
  dataRetention: number; // jours
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Types pour les erreurs
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Types pour les analytics
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: Date;
  userId: string;
}

// Types pour les permissions
export interface Permission {
  id: string;
  name: string;
  description: string;
  granted: boolean;
  required: boolean;
}

// Types pour les configurations
export interface AppConfig {
  apiUrl: string;
  wsUrl: string;
  environment: 'development' | 'staging' | 'production';
  version: string;
  buildNumber: string;
  features: {
    chat: boolean;
    calendar: boolean;
    tasks: boolean;
    memories: boolean;
    location: boolean;
    notifications: boolean;
  };
} 