/**
 * Global Undo/Redo System Hook
 * Provides undo/redo functionality across the application
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface UndoableAction {
  id: string;
  type: string;
  description: string;
  timestamp: number;
  undo: () => void;
  redo: () => void;
  data?: any;
}

interface UndoRedoState {
  history: UndoableAction[];
  currentIndex: number;
  maxHistorySize: number;
}

export function useUndoRedo(maxHistorySize: number = 50) {
  const [state, setState] = useState<UndoRedoState>({
    history: [],
    currentIndex: -1,
    maxHistorySize,
  });

  const actionIdRef = useRef(0);

  const canUndo = state.currentIndex >= 0;
  const canRedo = state.currentIndex < state.history.length - 1;

  const addAction = useCallback((
    type: string,
    description: string,
    undo: () => void,
    redo: () => void,
    data?: any
  ) => {
    const action: UndoableAction = {
      id: `action_${++actionIdRef.current}`,
      type,
      description,
      timestamp: Date.now(),
      undo,
      redo,
      data,
    };

    setState(prevState => {
      // Remove any actions after current index (when branching)
      const newHistory = prevState.history.slice(0, prevState.currentIndex + 1);
      
      // Add new action
      newHistory.push(action);
      
      // Limit history size
      const limitedHistory = newHistory.slice(-maxHistorySize);
      
      return {
        history: limitedHistory,
        currentIndex: limitedHistory.length - 1,
        maxHistorySize: prevState.maxHistorySize,
      };
    });
  }, [maxHistorySize]);

  const undo = useCallback(() => {
    if (!canUndo) return;

    const action = state.history[state.currentIndex];
    action.undo();

    setState(prevState => ({
      ...prevState,
      currentIndex: prevState.currentIndex - 1,
    }));
  }, [canUndo, state.history, state.currentIndex]);

  const redo = useCallback(() => {
    if (!canRedo) return;

    const nextIndex = state.currentIndex + 1;
    const action = state.history[nextIndex];
    action.redo();

    setState(prevState => ({
      ...prevState,
      currentIndex: nextIndex,
    }));
  }, [canRedo, state.history, state.currentIndex]);

  const clearHistory = useCallback(() => {
    setState({
      history: [],
      currentIndex: -1,
      maxHistorySize: state.maxHistorySize,
    });
  }, [state.maxHistorySize]);

  const getHistory = useCallback(() => {
    return state.history.map((action, index) => ({
      ...action,
      isCurrent: index === state.currentIndex,
      isUndoable: index <= state.currentIndex,
      isRedoable: index > state.currentIndex,
    }));
  }, [state.history, state.currentIndex]);

  const getCurrentAction = useCallback(() => {
    if (state.currentIndex >= 0 && state.currentIndex < state.history.length) {
      return state.history[state.currentIndex];
    }
    return null;
  }, [state.history, state.currentIndex]);

  const jumpToAction = useCallback((actionId: string) => {
    const targetIndex = state.history.findIndex(action => action.id === actionId);
    if (targetIndex === -1) return;

    const currentIndex = state.currentIndex;
    const targetAction = state.history[targetIndex];

    if (targetIndex < currentIndex) {
      // Need to undo actions
      for (let i = currentIndex; i > targetIndex; i--) {
        state.history[i].undo();
      }
    } else if (targetIndex > currentIndex) {
      // Need to redo actions
      for (let i = currentIndex + 1; i <= targetIndex; i++) {
        state.history[i].redo();
      }
    }

    setState(prevState => ({
      ...prevState,
      currentIndex: targetIndex,
    }));
  }, [state.history, state.currentIndex]);

  return {
    canUndo,
    canRedo,
    addAction,
    undo,
    redo,
    clearHistory,
    getHistory,
    getCurrentAction,
    jumpToAction,
    historySize: state.history.length,
    currentIndex: state.currentIndex,
  };
}

// Global undo/redo context
import { createContext, useContext, ReactNode } from 'react';

interface UndoRedoContextType {
  canUndo: boolean;
  canRedo: boolean;
  addAction: (
    type: string,
    description: string,
    undo: () => void,
    redo: () => void,
    data?: any
  ) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  getHistory: () => (UndoableAction & {
    isCurrent: boolean;
    isUndoable: boolean;
    isRedoable: boolean;
  })[];
  getCurrentAction: () => UndoableAction | null;
  jumpToAction: (actionId: string) => void;
  historySize: number;
  currentIndex: number;
}

const UndoRedoContext = createContext<UndoRedoContextType | null>(null);

export function UndoRedoProvider({ children, maxHistorySize = 50 }: { 
  children: ReactNode; 
  maxHistorySize?: number;
}) {
  const undoRedo = useUndoRedo(maxHistorySize);

  return (
    <UndoRedoContext.Provider value={undoRedo}>
      {children}
    </UndoRedoContext.Provider>
  );
}

export function useGlobalUndoRedo() {
  const context = useContext(UndoRedoContext);
  if (!context) {
    throw new Error('useGlobalUndoRedo must be used within an UndoRedoProvider');
  }
  return context;
}

// Keyboard shortcuts hook
export function useUndoRedoKeyboardShortcuts() {
  const { undo, redo, canUndo, canRedo } = useGlobalUndoRedo();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd+Z (Mac) or Ctrl+Z (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        if (canUndo) {
          undo();
        }
      }
      
      // Check for Cmd+Shift+Z (Mac) or Ctrl+Y (Windows/Linux)
      if (
        ((event.metaKey && event.shiftKey) || event.ctrlKey) && 
        (event.key === 'Z' || event.key === 'y')
      ) {
        event.preventDefault();
        if (canRedo) {
          redo();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);
}

export default useUndoRedo;
