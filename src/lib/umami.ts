type UmamiCallback = (event: string, data?: Record<string, unknown>) => void;

export type UmamiTracker = UmamiCallback | { track?: UmamiCallback };

const isCallbackTracker = (tracker: UmamiTracker): tracker is UmamiCallback =>
  typeof tracker === 'function';

const isObjectTracker = (tracker: UmamiTracker): tracker is { track?: UmamiCallback } =>
  typeof tracker === 'object' && tracker !== null;

export const trackUmamiEvent = (event: string, data?: Record<string, unknown>) => {
  if (typeof window === 'undefined') return;
  const tracker = window.umami;
  if (!tracker) return;

  if (isCallbackTracker(tracker)) {
    tracker(event, data);
    return;
  }

  if (isObjectTracker(tracker)) {
    tracker.track?.(event, data);
  }
};

declare global {
  interface Window {
    umami?: UmamiTracker;
  }
}
