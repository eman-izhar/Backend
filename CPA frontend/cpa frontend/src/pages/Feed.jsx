import React, { useState, useEffect, useRef } from 'react';
import axios from "axios"
import {
  Heart,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  ImagePlus,
  Check,
} from 'lucide-react';

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
  note: '#FFF6DC',
};

const AVATAR_PALETTE = ['#2F6F6B', '#FF6B4D', '#3D5A80', '#8A9A5B'];

const MOCK_POSTS = [
  {
    id: 1,
    name: 'Aria Chen',
    initials: 'AC',
    time: '2h',
    caption: 'Golden hour at the pier again \u2014 I never get tired of this light.',
    image: 'https://picsum.photos/seed/aria-pier/700/700',
    likes: 38,
    comments: 5,
  },
  {
    id: 2,
    name: 'Milo Reyes',
    initials: 'MR',
    time: '4h',
    caption: 'Some days the best plan is no plan. Coffee, a notebook, and the whole afternoon ahead.',
    image: null,
    likes: 14,
    comments: 2,
  },
  {
    id: 3,
    name: 'Sana Iyer',
    initials: 'SI',
    time: 'Yesterday',
    caption: 'Finally finished the mural! Three weekends well spent.',
    image: 'https://picsum.photos/seed/sana-mural/700/860',
    likes: 76,
    comments: 11,
  },
  {
    id: 4,
    name: 'Theo Brandt',
    initials: 'TB',
    time: '2d',
    caption: 'Rainy commute, warm thoughts.',
    image: 'https://picsum.photos/seed/theo-rain/700/560',
    likes: 9,
    comments: 0,
  },
];

// Backend sometimes won't send every field (name, initials, time, likes, comments).
// This fills in safe defaults so the UI never breaks on missing data,
// and maps Mongo's "_id" to the "id" the rest of the component relies on.
const normalizePost = (p, idx) => ({
  id: p.id ?? p._id ?? idx,
  name: p.name || 'Unknown',
  initials: p.initials || (p.name ? p.name.slice(0, 2).toUpperCase() : 'U'),
  time: p.time || 'now',
  caption: p.caption || '',
  image: p.image || null,
  likes: typeof p.likes === 'number' ? p.likes : 0,
  comments: typeof p.comments === 'number' ? p.comments : 0,
});

const Feed = ({ onCompose = () => {} }) => {
  const [loaded, setLoaded] = useState(false);
  const [mockPosts, setMockPosts] = useState(MOCK_POSTS);
  const [posts, setPosts] = useState(
    mockPosts.map((p) => ({ ...p, liked: false, saved: false, likeCount: p.likes, burst: false }))
  );
  const [openMenuId, setOpenMenuId] = useState(null);
  const burstTimers = useRef({});

  useEffect(() => {
    axios
      .get("http://localhost:3000/get-posts")
      .then((res) => {
        console.log("API response:", res.data);
        // Backend sends { message, posts }, NOT { mockPosts } — fixed key below.
        if (res?.data?.posts) {
          const normalized = res.data.posts.map((p, idx) => normalizePost(p, idx));
          setMockPosts(normalized);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch feed posts:", err);
      });
  }, []);

  useEffect(() => {
    setPosts(
      mockPosts.map((p) => ({ ...p, liked: false, saved: false, likeCount: p.likes, burst: false }))
    );
  }, [mockPosts]);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 650);
    return () => clearTimeout(t);
  }, []);

  const toggleLike = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likeCount: p.liked ? p.likeCount - 1 : p.likeCount + 1 }
          : p
      )
    );
  };

  const triggerBurst = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: true, likeCount: p.liked ? p.likeCount : p.likeCount + 1, burst: true } : p
      )
    );
    clearTimeout(burstTimers.current[id]);
    burstTimers.current[id] = setTimeout(() => {
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, burst: false } : p)));
    }, 700);
  };

  const toggleSave = (id) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p)));
    setOpenMenuId(null);
  };

  const hidePost = (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setOpenMenuId(null);
  };

  return (
    <div
      className="min-h-screen w-full flex justify-center p-4 sm:p-8"
      style={{ background: COLORS.bg, fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,700;1,9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Caveat:wght@600;700&display=swap');

        @keyframes burst {
          0%   { transform: scale(0.4); opacity: 0; }
          35%  { transform: scale(1.25); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .heart-burst { animation: burst 700ms ease-out; }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 420ms ease-out both; }

        @keyframes pulse-soft {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 0.9; }
        }
        .skeleton-pulse { animation: pulse-soft 1.4s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .heart-burst, .fade-up, .skeleton-pulse { animation: none !important; }
        }
      `}</style>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6 px-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: COLORS.coral }} />
            <span
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: COLORS.teal, fontFamily: "'JetBrains Mono', monospace" }}
            >
              Latest
            </span>
          </div>
          <h1
            className="text-3xl leading-tight"
            style={{ color: COLORS.ink, fontFamily: "'Fraunces', serif", fontWeight: 600 }}
          >
            Moments from your <span style={{ fontStyle: 'italic', color: COLORS.teal }}>circle</span>
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: COLORS.muted }}>
            Catch up on what everyone's been up to.
          </p>
        </div>

        {/* Composer bar */}
        <button
          onClick={onCompose}
          className="w-full mb-6 flex items-center gap-3 rounded-2xl px-4 py-3 text-left focus:outline-none focus-visible:ring-2"
          style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.borderSoft}`,
            boxShadow: '0 1px 2px rgba(26,35,50,0.04)',
            ringColor: COLORS.teal,
          }}
        >
          <span
            className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
            style={{ background: COLORS.teal, color: '#fff' }}
          >
            Y
          </span>
          <span className="flex-1 text-sm" style={{ color: COLORS.muted }}>
            Share a moment&hellip;
          </span>
          <span
            className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: '#F6F8FA', color: COLORS.teal }}
          >
            <ImagePlus className="h-4 w-4" strokeWidth={1.8} />
          </span>
        </button>

        {/* Feed list */}
        {!loaded && (
          <div className="space-y-5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="skeleton-pulse rounded-2xl p-4"
                style={{ background: COLORS.surface, border: `1px solid ${COLORS.borderSoft}` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-9 w-9 rounded-full" style={{ background: '#E7ECF1' }} />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2.5 w-24 rounded" style={{ background: '#E7ECF1' }} />
                    <div className="h-2 w-14 rounded" style={{ background: '#EDF1F4' }} />
                  </div>
                </div>
                <div className="w-full aspect-square rounded-xl" style={{ background: '#EDF1F4' }} />
              </div>
            ))}
          </div>
        )}

        {loaded && (
          <div className="space-y-5">
            {posts.map((post, idx) => {
              const avatarColor = AVATAR_PALETTE[idx % AVATAR_PALETTE.length];
              const tilt = idx % 2 === 0 ? -2 : 2;
              return (
                <div
                  key={post.id}
                  className="fade-up rounded-2xl p-4 relative"
                  style={{
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.borderSoft}`,
                    boxShadow: '0 1px 2px rgba(26,35,50,0.04), 0 12px 24px -16px rgba(26,35,50,0.12)',
                    animationDelay: `${idx * 70}ms`,
                  }}
                >
                  {/* Header row */}
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
                      style={{ background: avatarColor }}
                    >
                      {post.initials}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: COLORS.ink }}>
                        {post.name}
                      </p>
                      <p
                        className="text-[11px]"
                        style={{ color: COLORS.muted, fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {post.time}
                      </p>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === post.id ? null : post.id)}
                        className="h-7 w-7 rounded-full flex items-center justify-center focus:outline-none"
                        style={{ color: COLORS.muted }}
                        aria-label="Post options"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>

                      {openMenuId === post.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div
                            className="absolute right-0 top-8 z-20 w-36 rounded-xl overflow-hidden"
                            style={{
                              background: COLORS.surface,
                              border: `1px solid ${COLORS.borderSoft}`,
                              boxShadow: '0 12px 24px -8px rgba(26,35,50,0.2)',
                            }}
                          >
                            <button
                              onClick={() => toggleSave(post.id)}
                              className="w-full text-left px-3.5 py-2.5 text-sm hover:bg-opacity-50"
                              style={{ color: COLORS.ink }}
                            >
                              {post.saved ? 'Remove save' : 'Save post'}
                            </button>
                            <button
                              onClick={() => hidePost(post.id)}
                              className="w-full text-left px-3.5 py-2.5 text-sm border-t"
                              style={{ color: COLORS.coral, borderColor: COLORS.borderSoft }}
                            >
                              Hide post
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  {post.image ? (
                    <div
                      className="relative rounded-xl overflow-hidden select-none"
                      onDoubleClick={() => triggerBurst(post.id)}
                    >
                      <img
                        src={post.image}
                        alt={post.caption}
                        className="w-full object-cover"
                        style={{ aspectRatio: '4 / 4', maxHeight: '420px' }}
                        draggable={false}
                      />

                      {post.burst && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <Heart
                            className="h-20 w-20 heart-burst"
                            style={{ color: '#fff', fill: COLORS.coral, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.25))' }}
                          />
                        </div>
                      )}

                      {/* sticky-note caption */}
                      <div
                        className="absolute bottom-3 left-3 max-w-[78%] px-3 py-2 rounded-sm"
                        style={{
                          background: COLORS.note,
                          transform: `rotate(${tilt}deg)`,
                          boxShadow: '0 6px 14px -6px rgba(26,35,50,0.35)',
                        }}
                      >
                        <span
                          aria-hidden="true"
                          className="absolute -top-1.5 left-3 h-3 w-3 rounded-full"
                          style={{ background: COLORS.coral }}
                        />
                        <p
                          className="leading-snug"
                          style={{ color: COLORS.ink, fontFamily: "'Caveat', cursive", fontSize: '1.15rem' }}
                        >
                          {post.caption}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="rounded-xl px-4 py-5"
                      style={{
                        backgroundImage: `repeating-linear-gradient(${COLORS.surface} 0px, ${COLORS.surface} 27px, ${COLORS.borderSoft} 28px)`,
                        border: `1px solid ${COLORS.borderSoft}`,
                      }}
                    >
                      <p
                        className="leading-relaxed"
                        style={{ color: COLORS.ink, fontFamily: "'Caveat', cursive", fontSize: '1.35rem' }}
                      >
                        {post.caption}
                      </p>
                    </div>
                  )}

                  {/* Engagement row */}
                  <div className="flex items-center gap-5 mt-3.5 pt-1">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className="flex items-center gap-1.5 focus:outline-none"
                      aria-label={post.liked ? 'Unlike' : 'Like'}
                    >
                      <Heart
                        className="h-[18px] w-[18px] transition-transform"
                        style={{
                          color: post.liked ? COLORS.coral : COLORS.muted,
                          fill: post.liked ? COLORS.coral : 'none',
                          transform: post.liked ? 'scale(1.08)' : 'scale(1)',
                        }}
                        strokeWidth={1.8}
                      />
                      <span
                        className="text-xs"
                        style={{ color: COLORS.muted, fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {post.likeCount}
                      </span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="h-[18px] w-[18px]" style={{ color: COLORS.muted }} strokeWidth={1.8} />
                      <span
                        className="text-xs"
                        style={{ color: COLORS.muted, fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {post.comments}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleSave(post.id)}
                      className="ml-auto focus:outline-none"
                      aria-label={post.saved ? 'Remove from saved' : 'Save'}
                    >
                      <Bookmark
                        className="h-[18px] w-[18px]"
                        style={{ color: post.saved ? COLORS.teal : COLORS.muted, fill: post.saved ? COLORS.teal : 'none' }}
                        strokeWidth={1.8}
                      />
                    </button>
                  </div>
                </div>
              );
            })}

            {posts.length > 0 && (
              <div className="flex items-center justify-center gap-2 pt-2 pb-6">
                <Check className="h-3.5 w-3.5" style={{ color: COLORS.muted }} />
                <span
                  className="text-xs"
                  style={{ color: COLORS.muted, fontFamily: "'JetBrains Mono', monospace" }}
                >
                  You're all caught up
                </span>
              </div>
            )}

            {posts.length === 0 && (
              <div className="text-center py-10">
                <p className="text-sm" style={{ color: COLORS.muted }}>
                  Nothing left here. Hidden posts stay hidden for this session.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
