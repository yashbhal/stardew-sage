import { useCallback, useEffect, useRef, useState } from 'react';
import type { SavedTip } from '../types/tips';

const STORAGE_KEY = 'stardew-sage-saved-tips';

export const useSavedTips = () => {
  const [savedTips, setSavedTips] = useState<SavedTip[]>([]);
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setSavedTips(parsed);
      }
    } catch (error) {
      console.error('Failed to load saved tips from storage', error);
    } finally {
      isInitialLoadRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (isInitialLoadRef.current) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTips));
    } catch (error) {
      console.error('Failed to persist saved tips', error);
    }
  }, [savedTips]);

  const isTipSaved = useCallback(
    (content: string) => savedTips.some((tip) => tip.content === content.trim()),
    [savedTips],
  );

  const saveTip = useCallback((tip: SavedTip) => {
    setSavedTips((prev) => [tip, ...prev.filter((existing) => existing.id !== tip.id)]);
  }, []);

  const removeTip = useCallback((tipId: string) => {
    setSavedTips((prev) => prev.filter((tip) => tip.id !== tipId));
  }, []);

  const removeTipByContent = useCallback((content: string) => {
    setSavedTips((prev) => prev.filter((tip) => tip.content !== content));
  }, []);

  const clearTips = useCallback(() => {
    setSavedTips([]);
  }, []);

  return {
    savedTips,
    isTipSaved,
    saveTip,
    removeTip,
    removeTipByContent,
    clearTips,
  } as const;
};
