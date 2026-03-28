import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StarRating from '../components/StarRating';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';
const STRENGTHS = ['Punctual', 'Clean Workspace', 'Expert Knowledge', 'Communication', 'Professional', 'Safety-Conscious'];

export default function RatingPage() {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const location = useLocation();
  const workerEmail = location.state?.email || '';
  const workerName = location.state?.name || 'Marcus Chen';
  const [rating, setRating] = useState(0);
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleStrength = (s: string) => {
    setSelectedStrengths(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      showToast('Please select a star rating', 'error');
      return;
    }
    if (comment.length < 20) {
      showToast('Please write at least 20 characters in your review', 'error');
      return;
    }
  
    try {
      await api.rateUser(workerEmail, rating);
      setSubmitted(true);
      showToast('Rating submitted successfully!', 'success');
      setTimeout(() => navigate(-1), 2000);
    } catch (error: any) {
      showToast(error.message || 'Failed to submit rating. Try again.', 'error');
    }
  };

  return (
    <div className="bg-background font-body text-on-background min-h-screen pb-24">
      <main className="pt-4 pb-20 px-4 max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight mb-3">Rate Your Experience</h1>
          <p className="text-on-surface-variant text-lg max-w-xl">Your feedback ensures the quality and reliability of the LabourLink community. Dignity and respect are our core values.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left: Profile Summary */}
          <div className="md:col-span-4">
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/10 sticky top-28">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden mx-auto shadow-lg">
                  <img
                    alt="Marcus Chen"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1DvjZeNz9HIknJxK08UBRWqzs0syn0FWIE-6llk3m39ncSAnq9aZ6kv3fpe4Dq1XxOIiUCujioWwV9r7-Z0xhOV-_iyHqkMK05_g_L_OjbdaRefjybHTnyllDXjARYJRtpoZNWNwMea-TBnBMuXOYKuTKicgD-jhvWCQcJchy24j_H79jbnS9trNBmq-FiIobgLFHD9DIzqbCiCQjNE2c3PZjfBGEbRwJEjt98MBRV20cWfBVpAgnv7hRI87jzR6V15yJ_-8bQeSU"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  Verified
                </div>
              </div>
              <div className="text-center">
              <h2 className="font-headline text-xl font-bold text-on-surface">{workerName}</h2>
                <p className="text-on-surface-variant font-medium text-sm mb-4">Master Electrician</p>
                <div className="bg-surface-container rounded-lg p-3 text-left">
                  <div className="flex justify-between text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-1">
                    <span>Project</span>
                    <span className="text-primary">#4920</span>
                  </div>
                  <p className="text-on-surface text-sm font-semibold">Industrial Rewiring Phase 1</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Rating Form */}
          <div className="md:col-span-8">
            {submitted ? (
              <div className="bg-surface-container rounded-xl p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-secondary/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <h2 className="font-headline text-3xl font-bold text-on-surface mb-4">Thank You!</h2>
                <p className="text-on-surface-variant text-lg">Your rating has been submitted successfully. Redirecting...</p>
              </div>
            ) : (
              <div className="bg-surface-container rounded-xl p-8 space-y-8">
                {/* Star Rating */}
                <div className="space-y-4">
                  <label className="font-headline text-lg font-bold text-on-surface block">Overall Rating</label>
                  <p className="text-on-surface-variant text-sm font-medium">How would you rate the quality and professionalism of the work?</p>
                  <StarRating initialRating={0} onChange={setRating} size="lg" />
                </div>

                {/* Strength Tags */}
                <div className="space-y-3">
                  <label className="font-headline text-sm font-bold text-on-surface block uppercase tracking-wider">Highlight Strengths</label>
                  <div className="flex flex-wrap gap-2">
                    {STRENGTHS.map(s => (
                      <button
                        key={s}
                        onClick={() => toggleStrength(s)}
                        className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                          selectedStrengths.includes(s)
                            ? 'bg-secondary-container text-on-secondary-container border-secondary/10'
                            : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/20 hover:bg-secondary-container hover:text-on-secondary-container'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div className="space-y-3">
                  <label className="font-headline text-lg font-bold text-on-surface block" htmlFor="review-text">Review Comments</label>
                  <div className="relative">
                    <textarea
                      className="w-full rounded-xl bg-surface-container-highest border-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest text-on-surface p-4 placeholder:text-on-surface-variant/50 transition-all"
                      id="review-text"
                      placeholder={`Share your experience working with ${workerName.split(' ')[0]}...`}
                      rows={5}
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                    />
                    <div className="absolute bottom-4 right-4 text-xs font-bold text-on-surface-variant/40">
                      {comment.length}/20 min
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-primary to-primary-dim text-white font-headline font-bold text-lg py-4 px-8 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    Submit Review
                    <span className="material-symbols-outlined">send</span>
                  </button>
                  <button
                    onClick={() => navigate(-1)}
                    className="sm:w-1/3 bg-surface-container-lowest text-on-surface font-headline font-bold text-lg py-4 px-8 rounded-xl border border-outline-variant/20 active:scale-95 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
