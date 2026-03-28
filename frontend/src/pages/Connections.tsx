import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';

interface PendingRequest {
  _id: string;
  sender: {
    name: string;
    role: string;
    location: string;
  };
}

export default function Connections() {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const { showToast } = useApp();
  
  // Assuming your login user ID is stored in localStorage or Context
  const currentUserId = localStorage.getItem('user_id'); 

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/connections/pending/${currentUserId}`);
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching connections", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatus = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      await axios.patch(`http://localhost:5000/api/connections/update`, {
        request_id: requestId,
        status: status
      });
      showToast(`Request ${status}`, 'success');
      setRequests(prev => prev.filter(r => r._id !== requestId));
    } catch (err) {
      showToast("Failed to update", "error");
    }
  };
  
// Pehle ek state banao suggestions ke liye (top par)
const [suggestions, setSuggestions] = useState([]);

// useEffect mein ek naya API call add karo (Backend route jo main niche bataunga)
useEffect(() => {
  const fetchSuggestions = async () => {
    const res = await axios.get('http://localhost:8000/api/users/suggestions');
    setSuggestions(res.data);
  };
  fetchSuggestions();
}, []);

// Ab JSX mein ye code add karo (Pending Requests ke baad)
<div className="mt-12">
  <h2 className="text-lg font-bold text-on-surface mb-4 px-2">People you may know</h2>
  
  {/* Horizontal Scroll Wrapper (Instagram Style) */}
  <div className="flex gap-4 overflow-x-auto pb-6 px-2 scrollbar-hide select-none">
    {suggestions.map((person: any) => (
      <div key={person._id} className="min-w-[180px] bg-white border border-surface-container rounded-3xl p-5 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
        {/* Profile Circle */}
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary mb-3">
          {person.name[0].toUpperCase()}
        </div>
        
        <h3 className="font-bold text-sm text-on-surface truncate w-full text-center">{person.name}</h3>
        <p className="text-[11px] text-on-surface-variant mb-4">{person.role || 'Worker'}</p>
        
        {/* Connect Button */}
        <button 
          onClick={() => handleConnect(person._id)}
          className="w-full py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dim active:scale-95 transition-all"
        >
          Connect
        </button>
      </div>
    ))}
  </div>
</div>
   
  return (
    <div className="min-h-screen bg-surface-container-lowest p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <span className="material-symbols-outlined text-primary text-3xl">group</span>
          <h1 className="text-2xl font-bold text-on-surface font-headline">Network Connections</h1>
        </div>

        <section className="bg-white rounded-2xl border border-surface-container overflow-hidden shadow-sm">
          <div className="p-4 border-b border-surface-container bg-surface-container-low">
            <h2 className="font-bold text-primary">Pending Requests ({requests.length})</h2>
          </div>

          <div className="divide-y divide-surface-container">
            {requests.map((req) => (
              <div key={req._id} className="p-4 flex items-center justify-between hover:bg-surface-container-lowest transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                    {req.sender.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface">{req.sender.name}</h3>
                    <p className="text-xs text-on-surface-variant">{req.sender.role} • {req.sender.location}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleStatus(req._id, 'accepted')}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary-dim shadow-sm"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => handleStatus(req._id, 'rejected')}
                    className="border border-error text-error px-4 py-2 rounded-lg text-xs font-bold hover:bg-error/5"
                  >
                    Ignore
                  </button>
                </div>
              </div>
            ))}

            {requests.length === 0 && (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-surface-container-high text-5xl">person_add</span>
                <p className="mt-2 text-on-surface-variant">No pending connection requests</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}