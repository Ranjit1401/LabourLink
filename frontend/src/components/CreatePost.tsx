import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';

interface CreatePostProps {
  onPost?: (content: string, imageUrl?: string, location?: string) => void;
}

const CreatePost = ({ onPost }: CreatePostProps) => {
  const { language } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [location, setLocation] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);

  const handleSubmit = () => {
    if (!content.trim()) return;
    onPost?.(content, imageUrl || undefined, location || undefined);
    setContent('');
    setImageUrl('');
    setLocation('');
    setExpanded(false);
    setShowImageInput(false);
    setShowLocationInput(false);
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
          AS
        </div>
        {!expanded ? (
          <button
            onClick={() => setExpanded(true)}
            className="flex-1 text-left px-5 py-3 bg-surface-container rounded-full text-on-surface-variant text-sm hover:bg-surface-container-high transition-colors font-medium"
          >
            {t(language, 'createPostCollapsed')}
          </button>
        ) : (
          <div className="flex-1 space-y-3">
            <textarea
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t(language, 'createPostTextarea')}
              rows={3}
              className="w-full px-4 py-3 bg-surface-container rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />

            {showImageInput && (
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">image</span>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder={t(language, 'createPostImageUrl')}
                  className="flex-1 px-3 py-2 bg-surface-container rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}

            {showLocationInput && (
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">location_on</span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t(language, 'createPostLocation')}
                  className="flex-1 px-3 py-2 bg-surface-container rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}

            {imageUrl && (
              <div className="rounded-xl overflow-hidden max-h-48">
                <img src={imageUrl} alt="Preview" className="w-full object-cover" />
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-surface-container">
              <div className="flex gap-1">
                <button
                  onClick={() => setShowImageInput((p) => !p)}
                  className="flex items-center gap-2 text-on-surface-variant font-semibold text-sm hover:bg-surface-container p-2 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-primary">image</span>
                  {t(language, 'photo')}
                </button>
                <button
                  onClick={() => setShowLocationInput((p) => !p)}
                  className="flex items-center gap-2 text-on-surface-variant font-semibold text-sm hover:bg-surface-container p-2 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-secondary">location_on</span>
                  {t(language, 'location')}
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setExpanded(false)}
                  className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors"
                >
                  {t(language, 'cancel')}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!content.trim()}
                  className="px-5 py-2 text-sm font-bold bg-primary text-white rounded-xl disabled:opacity-50 hover:bg-primary-dim transition-colors"
                >
                  {t(language, 'post')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick action buttons when collapsed */}
      {!expanded && (
        <div className="flex justify-between mt-4 px-2">
          <button
            onClick={() => { setExpanded(true); setShowImageInput(true); }}
            className="flex items-center gap-2 text-on-surface-variant font-semibold text-sm hover:bg-surface-container p-2 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-primary">image</span> {t(language, 'photo')}
          </button>
          <button
            onClick={() => { setExpanded(true); setShowLocationInput(true); }}
            className="flex items-center gap-2 text-on-surface-variant font-semibold text-sm hover:bg-surface-container p-2 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-secondary">location_on</span> {t(language, 'location')}
          </button>
          <button
            onClick={() => setExpanded(true)}
            className="flex items-center gap-2 text-on-surface-variant font-semibold text-sm hover:bg-surface-container p-2 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-tertiary">event</span> {t(language, 'event')}
          </button>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
