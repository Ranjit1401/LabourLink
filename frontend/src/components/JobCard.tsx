import { useState } from 'react';
import type { Job } from '../types';

interface JobCardProps {
  job: Job;
  variant?: 'feed' | 'listing';
}

const JobCard = ({ job, variant = 'feed' }: JobCardProps) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(job.likes ?? 0);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  if (variant === 'listing') {
    return (
      <div className="group bg-surface-container-lowest p-6 rounded-xl shadow-[0_12px_32px_rgba(45,51,55,0.06)] hover:-translate-y-1 transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <span className="material-symbols-outlined text-primary text-3xl">
              {job.icon ?? 'work'}
            </span>
          </div>
          {job.type && (
            <span
              className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                job.type === 'immediate'
                  ? 'bg-secondary-container text-on-secondary-container'
                  : job.type === 'featured'
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              {job.type === 'immediate' ? 'Immediate Start' : job.type}
            </span>
          )}
        </div>

        <h3 className="font-headline font-bold text-xl group-hover:text-primary transition-colors">
          {job.title}
        </h3>
        <p className="text-on-surface-variant text-sm mt-2 line-clamp-2">{job.description}</p>

        <div className="mt-6 flex items-center justify-between border-t border-surface-container pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Wage</span>
            <span className="text-xl font-extrabold text-primary">
              {job.wage}
              <span className="text-xs font-medium">/{job.wageUnit}</span>
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Location</span>
            <span className="font-semibold text-on-surface flex items-center gap-1 justify-end">
              <span className="material-symbols-outlined text-sm">near_me</span>
              {job.location}
            </span>
          </div>
        </div>

        <button className="w-full mt-4 py-3 bg-surface-container text-on-surface font-bold rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
          View Details
        </button>
      </div>
    );
  }

  // Feed variant
  return (
    <article className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl">
                {job.icon ?? 'business'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-on-surface leading-tight">{job.company}</h3>
              <p className="text-xs text-on-surface-variant">
                Posted {job.postedAt} •{' '}
                <span className="text-secondary font-bold">Verified Employer</span>
              </p>
            </div>
          </div>
          <button className="text-outline hover:text-primary transition-colors">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 mb-6">
          <h2 className="text-lg font-extrabold text-on-surface tracking-tight">{job.title}</h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-bold text-on-surface-variant"
              >
                {skill}
              </span>
            ))}
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed">{job.description}</p>
        </div>

        {/* Wage & Location Grid */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-surface-container-low rounded-xl mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Wage</p>
              <p className="font-bold text-on-surface">
                {job.wage}{' '}
                <span className="text-xs font-normal">/ {job.wageUnit}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">location_on</span>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Location</p>
              <p className="font-bold text-on-surface">{job.location}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dim transition-colors">
            Apply Now
          </button>
          <button
            onClick={() => setBookmarked((b) => !b)}
            className={`px-4 py-3 rounded-xl font-bold transition-colors ${
              bookmarked
                ? 'bg-primary text-white'
                : 'bg-surface-container-highest text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={bookmarked ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              bookmark
            </span>
          </button>
        </div>
      </div>

      {/* Social Bar */}
      <div className="px-6 py-3 border-t border-surface-container flex items-center justify-between text-on-surface-variant">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
              liked ? 'text-primary' : 'hover:text-primary'
            }`}
          >
            <span
              className="material-symbols-outlined text-xl"
              style={liked ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              thumb_up
            </span>
            {likeCount}
          </button>
          <button className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-xl">comment</span>
            {job.comments} Comments
          </button>
        </div>
        <button className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-xl">share</span>
          Share
        </button>
      </div>
    </article>
  );
};

export default JobCard;
