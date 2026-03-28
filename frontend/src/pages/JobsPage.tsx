import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import JobCard from '../components/JobCard';
import { MOCK_JOBS } from '../utils/mockData';

const SKILLS = ['Carpentry', 'Plumbing', 'Electrical', 'HVAC', 'Masonry', 'Painting'];

const JobsPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [minWage, setMinWage] = useState(0);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter((job) => {
      const matchesSearch =
        !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation =
        !locationFilter ||
        job.location.toLowerCase().includes(locationFilter.toLowerCase());

      const matchesSkills =
        selectedSkills.length === 0 ||
        selectedSkills.some((s) =>
          job.skills.some((js) => js.toLowerCase().includes(s.toLowerCase()))
        );

      return matchesSearch && matchesLocation && matchesSkills;
    });
  }, [searchQuery, locationFilter, selectedSkills, minWage]);

  return (
    <div className="max-w-7xl mx-auto pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24 h-fit">
          {/* Filters */}
          <div className="bg-surface-container-low p-6 rounded-xl space-y-6">
            <h2 className="font-headline font-bold text-lg">Refine Search</h2>

            {/* Skill Filter */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Skillset
              </label>
              <div className="space-y-2">
                {SKILLS.map((skill) => (
                  <label key={skill} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedSkills.includes(skill)}
                      onChange={() => toggleSkill(skill)}
                      className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4 accent-primary"
                    />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">
                      {skill}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Location
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary text-sm">
                  location_on
                </span>
                <input
                  type="text"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  placeholder="City or State"
                  className="w-full pl-10 pr-4 py-2 bg-surface-container-highest border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Wage Slider */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Min. Wage
              </label>
              <input
                type="range"
                min={0}
                max={5000}
                step={100}
                value={minWage}
                onChange={(e) => setMinWage(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-xs font-bold text-on-surface-variant">
                <span>₹0</span>
                <span className="text-primary">₹{minWage}+</span>
                <span>₹5,000</span>
              </div>
            </div>

            <button
              onClick={() => { setSelectedSkills([]); setLocationFilter(''); setMinWage(0); }}
              className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all active:scale-95"
            >
              Clear Filters
            </button>
          </div>

          {/* Worker Portal Mini Nav */}
          <Sidebar />
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-6">
          {/* Header + Search */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="font-headline font-extrabold text-3xl md:text-4xl tracking-tight text-on-surface">
                  Available Jobs
                </h1>
                <p className="text-on-surface-variant mt-1">
                  {filteredJobs.length} roles found in your area.
                </p>
              </div>

              <div className="relative w-full md:w-96">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by job title or company..."
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-highest border-none rounded-xl focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Verification Banner */}
            <div className="bg-secondary-fixed text-on-secondary-fixed p-3 rounded-lg flex items-center gap-3 shadow-sm">
              <span className="material-symbols-outlined text-secondary">verified</span>
              <p className="text-xs font-bold uppercase tracking-wider">
                Your profile is verified. You have access to Premium listings.
              </p>
            </div>
          </div>

          {/* Job Cards Grid */}
          {filteredJobs.length === 0 ? (
            <div className="text-center py-16 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl mb-4 block">search_off</span>
              <p className="font-bold text-lg">No jobs match your filters.</p>
              <p className="text-sm mt-1">Try adjusting your search or clearing filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs.map((job, idx) => (
                <JobCard key={job.id} job={job} variant="listing" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
