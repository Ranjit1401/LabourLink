import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';

export default function NotificationsPage() {
  const { notifications, markAllRead, unreadCount } = useApp();

  useEffect(() => {
    // mark all as read when user opens this page
    if (unreadCount > 0) {
      api.markNotificationsRead().catch(console.error);
      markAllRead();
    }
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'job': return 'work';
      case 'post': return 'dynamic_feed';
      default: return 'notifications';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'job': return 'text-primary';
      case 'post': return 'text-secondary';
      default: return 'text-outline';
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen pb-24">
      <main className="max-w-2xl mx-auto pt-6 px-4">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-on-surface">Notifications</h1>
            <p className="text-sm text-on-surface-variant mt-1">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => {
                api.markNotificationsRead().catch(console.error);
                markAllRead();
              }}
              className="text-sm font-bold text-primary hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-outline mb-4 block">
              notifications_off
            </span>
            <p className="font-bold text-on-surface-variant">No notifications yet.</p>
            <p className="text-sm text-outline mt-1">
              Apply to jobs or connect with others to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(n => (
              <div
                key={n.id}
                className={`flex gap-4 p-4 rounded-xl border transition-colors ${
                  !n.read
                    ? 'bg-primary/5 border-primary/20'
                    : 'bg-surface-container-lowest border-surface-container'
                }`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  !n.read ? 'bg-primary/10' : 'bg-surface-container'
                }`}>
                  <span className={`material-symbols-outlined text-xl ${getIconColor(n.type)}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}>
                    {getIcon(n.type)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-snug ${!n.read ? 'font-bold text-on-surface' : 'font-medium text-on-surface-variant'}`}>
                    {n.message}
                  </p>
                  <p className="text-xs text-outline mt-1">{n.time}</p>
                </div>

                {/* Unread dot */}
                {!n.read && (
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}