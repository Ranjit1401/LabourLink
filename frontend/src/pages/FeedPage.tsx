import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import CreatePost from '../components/CreatePost';
import JobCard from '../components/JobCard';
import PostCard from '../components/PostCard';
import { MOCK_JOBS, MOCK_POSTS, NEWS_ITEMS } from '../utils/mockData';
import type { Post } from '../types';

const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

  const handleNewPost = (content: string, imageUrl?: string, location?: string) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: 'Arjun Sharma',
      authorTitle: 'Master Electrician',
      content,
      imageUrl,
      location,
      postedAt: 'Just now',
      likes: 0,
      comments: 0,
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div className="max-w-7xl mx-auto pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar */}
        <Sidebar showStats />

        {/* Main Feed */}
        <main className="lg:col-span-6 space-y-6">
          <CreatePost onPost={handleNewPost} />

          {/* Interleave posts and job cards */}
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {MOCK_JOBS.slice(0, 2).map((job) => (
            <JobCard key={job.id} job={job} variant="feed" />
          ))}
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          {/* News */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-surface-container">
            <h3 className="font-bold text-on-surface mb-4 font-headline">LabourLink News</h3>
            <ul className="space-y-4">
              {NEWS_ITEMS.map((item) => (
                <li key={item.id} className="group cursor-pointer">
                  <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {item.time} · {item.readers} readers
                  </p>
                </li>
              ))}
            </ul>
            <button className="mt-4 text-sm font-bold text-primary flex items-center gap-1">
              Show more{' '}
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
          </div>

          {/* Promo Card */}
          <div className="bg-surface-container rounded-xl p-6 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] uppercase font-bold text-secondary tracking-[0.2em] mb-2">
                Promoted
              </p>
              <h3 className="text-lg font-extrabold text-on-surface leading-tight mb-2 font-headline">
                Get Certified in Scaffolding
              </h3>
              <p className="text-sm text-on-surface-variant mb-4">
                Increase your daily wage by up to 40% with our weekend course.
              </p>
              <button className="w-full py-2 bg-on-surface text-surface-container-lowest rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
                Learn More
              </button>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary-container rounded-full opacity-30" />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FeedPage;
