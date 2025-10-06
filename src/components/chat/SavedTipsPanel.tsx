import type { SavedTip } from '../../types/tips';

interface SavedTipsPanelProps {
  isOpen: boolean;
  savedTips: SavedTip[];
  onToggle: () => void;
  onClear: () => void;
  onRemove: (tipId: string) => void;
}

export const SavedTipsPanel = ({
  isOpen,
  savedTips,
  onToggle,
  onClear,
  onRemove,
}: SavedTipsPanelProps) => (
  <section className="mb-4 sm:mb-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
      <div className="flex items-center gap-2">
        {savedTips.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs sm:text-sm font-pixel tracking-pixel text-stardew-red-500 hover:text-stardew-red-600 focus:outline-none focus:ring-2 focus:ring-stardew-red-300 focus:ring-offset-1 focus:ring-offset-menu-paper"
          >
            Clear all
          </button>
        )}
        <button
          type="button"
          onClick={onToggle}
          className={`inline-flex items-center justify-center gap-1 rounded-stardew-lg border-2 border-menu-border px-3 py-1.5 font-pixel text-xs sm:text-sm transition-colors ${isOpen ? 'bg-stardew-green-100 text-stardew-green-700' : 'bg-menu-paper hover:bg-stardew-green-50 text-stardew-brown-700'}`}
          aria-expanded={isOpen}
          aria-controls="saved-tips-panel"
        >
          {isOpen ? 'Hide saved tips' : 'Show saved tips'}
          <span className="text-[10px] sm:text-xs font-body text-stardew-brown-500">({savedTips.length})</span>
        </button>
      </div>
    </div>

    {isOpen && (
      <div
        id="saved-tips-panel"
        className="mt-3 rounded-stardew-lg border-2 border-menu-border bg-menu-paper p-3 sm:p-4 shadow-stardew-sm"
        role="region"
        aria-label="Saved tips list"
      >
        {savedTips.length === 0 ? (
          <p className="text-sm font-body text-stardew-brown-500">
            No tips saved yet. Tap the star icon on helpful responses to bookmark them.
          </p>
        ) : (
          <ul className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {savedTips.map((tip) => (
              <li key={tip.id} className="rounded-stardew border border-menu-border bg-white/90 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm font-body text-stardew-brown-700 whitespace-pre-wrap">{tip.content}</div>
                  <button
                    type="button"
                    onClick={() => onRemove(tip.id)}
                    className="shrink-0 rounded-stardew border-2 border-stardew-brown-200 bg-stardew-brown-50 px-3 py-1.5 text-[11px] sm:text-xs font-pixel uppercase tracking-pixel text-stardew-brown-600 hover:bg-stardew-brown-100 focus:outline-none focus:ring-2 focus:ring-stardew-blue-400 focus:ring-offset-1 focus:ring-offset-white"
                    aria-label="Remove saved tip"
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-2 text-[11px] font-body text-stardew-brown-400">
                  Saved {formatSavedTimestamp(tip.savedAt)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    )}
  </section>
);

const formatSavedTimestamp = (iso?: string | null) => {
  if (!iso) return '';
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
