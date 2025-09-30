'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';

interface OfflineData {
  [key: string]: any;
}

interface PendingAction {
  id: string;
  type: 'create' | 'update' | 'delete';
  endpoint: string;
  data: any;
  timestamp: number;
  retries: number;
}

export function useOfflineSupport() {
  const [isOnline, setIsOnline] = useState(true);
  const [offlineData, setOfflineData] = useState<OfflineData>({});
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      enqueueSnackbar('You are back online!', { variant: 'success' });
      syncPendingActions();
    };

    const handleOffline = () => {
      setIsOnline(false);
      enqueueSnackbar('You are offline. Changes will be saved locally.', { variant: 'warning' });
    };

    // Check initial status
    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [enqueueSnackbar]);

  // Store data offline
  const storeOffline = useCallback((key: string, data: any) => {
    const offlineKey = `offline_${key}`;
    const storedData = {
      ...data,
      _offline: true,
      _timestamp: Date.now(),
    };
    
    setOfflineData(prev => ({
      ...prev,
      [offlineKey]: storedData,
    }));

    // Store in localStorage as backup
    try {
      localStorage.setItem(offlineKey, JSON.stringify(storedData));
    } catch (error) {
      console.error('Failed to store offline data:', error);
    }
  }, []);

  // Retrieve offline data
  const getOffline = useCallback((key: string) => {
    const offlineKey = `offline_${key}`;
    return offlineData[offlineKey] || null;
  }, [offlineData]);

  // Queue action for later sync
  const queueAction = useCallback((
    type: 'create' | 'update' | 'delete',
    endpoint: string,
    data: any
  ) => {
    const action: PendingAction = {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      endpoint,
      data,
      timestamp: Date.now(),
      retries: 0,
    };

    setPendingActions(prev => [...prev, action]);

    // Store in localStorage as backup
    try {
      const stored = JSON.parse(localStorage.getItem('pending_actions') || '[]');
      stored.push(action);
      localStorage.setItem('pending_actions', JSON.stringify(stored));
    } catch (error) {
      console.error('Failed to store pending action:', error);
    }

    enqueueSnackbar('Action queued for when you\'re back online', { variant: 'info' });
  }, [enqueueSnackbar]);

  // Sync pending actions when back online
  const syncPendingActions = useCallback(async () => {
    if (!isOnline || pendingActions.length === 0) return;

    enqueueSnackbar(`Syncing ${pendingActions.length} pending actions...`, { variant: 'info' });

    const successfulActions: string[] = [];
    const failedActions: PendingAction[] = [];

    for (const action of pendingActions) {
      try {
        const response = await fetch(action.endpoint, {
          method: action.type === 'create' ? 'POST' : action.type === 'update' ? 'PUT' : 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(action.data),
        });

        if (response.ok) {
          successfulActions.push(action.id);
        } else {
          failedActions.push({ ...action, retries: action.retries + 1 });
        }
      } catch (error) {
        console.error('Failed to sync action:', action, error);
        failedActions.push({ ...action, retries: action.retries + 1 });
      }
    }

    // Remove successful actions
    setPendingActions(failedActions);

    // Update localStorage
    try {
      localStorage.setItem('pending_actions', JSON.stringify(failedActions));
    } catch (error) {
      console.error('Failed to update pending actions:', error);
    }

    if (successfulActions.length > 0) {
      enqueueSnackbar(`Successfully synced ${successfulActions.length} actions`, { variant: 'success' });
    }

    if (failedActions.length > 0) {
      enqueueSnackbar(`${failedActions.length} actions failed to sync`, { variant: 'error' });
    }
  }, [isOnline, pendingActions, enqueueSnackbar]);

  // Load pending actions from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pending_actions');
      if (stored) {
        const actions = JSON.parse(stored);
        setPendingActions(actions);
      }
    } catch (error) {
      console.error('Failed to load pending actions:', error);
    }
  }, []);

  // Clear offline data
  const clearOffline = useCallback((key?: string) => {
    if (key) {
      const offlineKey = `offline_${key}`;
      setOfflineData(prev => {
        const newData = { ...prev };
        delete newData[offlineKey];
        return newData;
      });
      
      try {
        localStorage.removeItem(offlineKey);
      } catch (error) {
        console.error('Failed to clear offline data:', error);
      }
    } else {
      setOfflineData({});
      try {
        // Clear all offline data
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('offline_')) {
            localStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.error('Failed to clear all offline data:', error);
      }
    }
  }, []);

  // Get offline status info
  const getOfflineInfo = useCallback(() => ({
    isOnline,
    pendingActionsCount: pendingActions.length,
    offlineDataCount: Object.keys(offlineData).length,
    lastSync: pendingActions.length > 0 ? Math.min(...pendingActions.map(a => a.timestamp)) : null,
  }), [isOnline, pendingActions, offlineData]);

  return {
    isOnline,
    storeOffline,
    getOffline,
    queueAction,
    clearOffline,
    syncPendingActions,
    getOfflineInfo,
    pendingActions,
  };
}
