import React, { useState, useRef, useCallback } from 'react';
import { ImagePlus, X, Loader2, Check, ArrowRight } from 'lucide-react';

const COLORS = {
  bg: '#EEF2F6',
  surface: '#FFFFFF',
  ink: '#1A2332',
  muted: '#6B7785',
  teal: '#2F6F6B',
  tealDark: '#234F4C',
  coral: '#FF6B4D',
  border: '#DCE3EA',
  borderSoft: '#E7ECF1',
};

const MAX_CAPTION = 280;

const CreatePost = () => {
  const [image, setImage] = useState(null); // { url, name }
  const [caption, setCaption] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | posting | posted
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('That file isn\u2019t an image \u2014 try a JPG or PNG.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('That image is over 8MB \u2014 try a smaller one.');
      return;
    }
    setError('');
    const url = URL.createObjectURL(file);
    setImage({ url, name: file.name });
  }, []);

  const onInputChange = (e) => {
    handleFile(e.target.files?.[0]);
    e.target.value = '';
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setImage(null);
  };

  const canPost = Boolean((image || caption.trim()) && status === 'idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canPost) return;
    setStatus('posting');
    setTimeout(() => {
      setStatus('posted');
      setTimeout(() => {
        setStatus('idle');
        setImage(null);
        setCaption('');
      }, 1700);
    }, 1100);
  };

  const remaining = MAX_CAPTION - caption.length;

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8"
      style={{ background: COLORS.bg, fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,700;1,9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        @keyframes develop {
          0%   { filter: blur(12px) brightness(0.5) contrast(1.15); opacity: 0; transform: scale(0.94); }
          55%  { filter: blur(3px) brightness(0.85); opacity: 1; }
          100% { filter: blur(0) brightness(1); opacity: 1; transform: scale(1); }
        }
        .develop-in { animation: develop 850ms ease-out; }

        @keyframes posted-pop {
          0% { transform: scale(0.6); opacity: 0; }
          60% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .posted-pop { animation: posted-pop 420ms cubic-bezier(0.34, 1.56, 0.64, 1); }

        @media (prefers-reduced-motion: reduce) {
          .develop-in, .posted-pop { animation: none !important; }
        }

        .caption-area::placeholder { color: #9AA5B1; }
        .caption-area:focus { outline: none; }
      `}</style>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl p-6 sm:p-8"
        style={{
          background: COLORS.surface,
          border: `1px solid ${COLORS.borderSoft}`,
          boxShadow: '0 1px 2px rgba(26,35,50,0.04), 0 24px 48px -24px rgba(26,35,50,0.18)',
        }}
      >
        {/* Eyebrow + headline */}
        <div className="mb-7">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: COLORS.coral }} />
            <span
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: COLORS.teal, fontFamily: "'JetBrains Mono', monospace" }}
            >
              New entry
            </span>
          </div>
          <h1
            className="text-3xl leading-tight"
            style={{ color: COLORS.ink, fontFamily: "'Fraunces', serif", fontWeight: 600 }}
          >
            Share a <span style={{ fontStyle: 'italic', color: COLORS.teal }}>moment</span>
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: COLORS.muted }}>
            A photo and a few words. That's all it takes.
          </p>
        </div>

        {/* Photo dropzone styled as an instant photo */}
        <div className="mb-6 flex justify-center">
          <div
            className="relative"
            style={{
              transform: isDragging ? 'rotate(0deg) scale(1.02)' : 'rotate(-1.5deg)',
              transition: 'transform 280ms ease',
            }}
          >
            {/* washi tape accent */}
            <div
              aria-hidden="true"
              className="absolute -top-3 left-7 h-5 w-14 rounded-sm"
              style={{
                background: COLORS.coral,
                opacity: 0.55,
                transform: 'rotate(-7deg)',
                boxShadow: '0 1px 1px rgba(0,0,0,0.06)',
                zIndex: 2,
              }}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className="relative block w-64 p-3 pb-4 rounded-md focus:outline-none focus-visible:ring-2"
              style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                boxShadow: '0 14px 28px -16px rgba(26,35,50,0.25)',
                ringColor: COLORS.teal,
              }}
              aria-label={image ? 'Change photo' : 'Choose a photo to upload'}
            >
              <div
                className="w-full aspect-square rounded-sm overflow-hidden flex items-center justify-center"
                style={{
                  background: image ? COLORS.ink : '#F6F8FA',
                  border: image ? 'none' : `1.5px dashed ${COLORS.border}`,
                }}
              >
                {image ? (
                  <img
                    key={image.url}
                    src={image.url}
                    alt="Selected upload preview"
                    className="develop-in w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 px-4 text-center">
                    <ImagePlus className="h-7 w-7" style={{ color: COLORS.teal }} strokeWidth={1.6} />
                    <span className="text-sm font-medium" style={{ color: COLORS.ink }}>
                      Click or drop a photo
                    </span>
                    <span
                      className="text-[11px]"
                      style={{ color: COLORS.muted, fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      JPG or PNG, up to 8MB
                    </span>
                  </div>
                )}
              </div>

              {/* polaroid caption strip */}
              <div
                className="mt-2.5 truncate text-center text-[11px]"
                style={{ color: COLORS.muted, fontFamily: "'JetBrains Mono', monospace" }}
              >
                {image ? image.name : 'no photo yet'}
              </div>
            </button>

            {image && (
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2.5 -right-2.5 h-7 w-7 rounded-full flex items-center justify-center focus:outline-none focus-visible:ring-2"
                style={{ background: COLORS.ink, color: '#fff', ringColor: COLORS.coral }}
                aria-label="Remove photo"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onInputChange}
          className="hidden"
        />

        {error && (
          <p className="mb-4 text-sm text-center" style={{ color: COLORS.coral }}>
            {error}
          </p>
        )}

        {/* Caption */}
        <div className="mb-7">
          <label
            htmlFor="caption"
            className="block mb-1.5 text-xs font-medium uppercase tracking-widest"
            style={{ color: COLORS.muted, fontFamily: "'JetBrains Mono', monospace" }}
          >
            Caption
          </label>
          <textarea
            id="caption"
            rows={3}
            maxLength={MAX_CAPTION}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="What's this moment about?"
            className="caption-area w-full resize-none text-[15px] leading-relaxed bg-transparent pb-2"
            style={{
              color: COLORS.ink,
              borderBottom: `2px solid ${COLORS.border}`,
              fontFamily: "'Inter', sans-serif",
            }}
            onFocus={(e) => (e.target.style.borderBottomColor = COLORS.teal)}
            onBlur={(e) => (e.target.style.borderBottomColor = COLORS.border)}
          />
          <div className="mt-1.5 text-right">
            <span
              className="text-[11px]"
              style={{
                color: remaining <= 20 ? COLORS.coral : COLORS.muted,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {remaining}
            </span>
          </div>
        </div>

        {/* Submit row */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs" style={{ color: COLORS.muted }}>
            {status === 'posted' ? 'Saved to your feed.' : 'Visible to your followers.'}
          </span>

          <button
            type="submit"
            disabled={!canPost}
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-opacity focus:outline-none focus-visible:ring-2"
            style={{
              background: status === 'posted' ? COLORS.tealDark : COLORS.teal,
              color: '#fff',
              opacity: canPost || status !== 'idle' ? 1 : 0.45,
              cursor: canPost ? 'pointer' : 'not-allowed',
              ringColor: COLORS.coral,
            }}
          >
            {status === 'idle' && (
              <>
                Post it
                <ArrowRight className="h-4 w-4" />
              </>
            )}
            {status === 'posting' && (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Posting&hellip;
              </>
            )}
            {status === 'posted' && (
              <span className="flex items-center gap-2 posted-pop">
                <Check className="h-4 w-4" />
                Posted!
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
