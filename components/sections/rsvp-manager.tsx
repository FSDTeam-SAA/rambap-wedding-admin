'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';

import { Loader2, Search } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const RSVP_ENDPOINT = `${API_BASE}/rsvp`;

type Rsvp = {
  _id: string;
  guestName: string;
  attendance: boolean; // true = attending, false = not attending
  guestNumber?: number;
  mealPreference?: string;
  message?: string;
  createdAt?: string;
  updatedAt?: string;
};

export function RsvpManager() {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5N2UwMjRmZmU2Mzg5ZmUxN2ZlOGY3NCIsImVtYWlsIjoiZmFyYWJpc3Vubnk1QGdtYWlsLmNvbSIsImlhdCI6MTc3MTMzNDU5NywiZXhwIjoxNzcxOTM5Mzk3fQ.mAD9YpgWT3X0IktWFaT4sgKSvhKlOEDqTsMgI5qKyfE';

  // ── Fetch all RSVPs ──────────────────────────────────────────
  const { data: rsvps = [], isLoading, isError, error } = useQuery<Rsvp[]>({
    queryKey: ['rsvps'],
    queryFn: async () => {
      const res = await fetch(RSVP_ENDPOINT, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ← add when auth is ready
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to load RSVPs');
      }

      const json = await res.json();
      return json.data || []; // adjust if your response shape is different
    },
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Filter RSVPs by search
  const filteredRsvps = rsvps.filter((r) =>
    r.guestName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const attending = rsvps.filter((r) => r.attendance === true).length;
  const notAttending = rsvps.filter((r) => r.attendance === false).length;




  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-destructive">
        Failed to load RSVPs
        <p className="text-sm mt-2">{(error as Error)?.message}</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">RSVP Management</h2>
          <p className="text-muted-foreground">View and update guest responses</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="border rounded-xl p-6 bg-green-50/50 dark:bg-green-950/30">
          <p className="text-sm text-green-700 dark:text-green-300">Attending</p>
          <p className="text-3xl font-bold mt-2">{attending}</p>
        </div>
        <div className="border rounded-xl p-6 bg-red-50/50 dark:bg-red-950/30">
          <p className="text-sm text-red-700 dark:text-red-300">Not Attending</p>
          <p className="text-3xl font-bold mt-2">{notAttending}</p>
        </div>
        {/* <div className="border rounded-xl p-6 bg-yellow-50/50 dark:bg-yellow-950/30">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">Pending</p>
          <p className="text-3xl font-bold mt-2">{pending}</p>
        </div> */}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search guests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* RSVP List */}
      <div className="space-y-4">
        {filteredRsvps.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl">
            {searchTerm ? 'No matching RSVPs found' : 'No RSVPs received yet'}
          </div>
        ) : (
          filteredRsvps.map((rsvp) => (
            <div
              key={rsvp._id}
              className="border rounded-xl p-5 bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{rsvp.guestName}</h3>
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${rsvp.attendance === true
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                          : rsvp.attendance === false
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
                        }`}
                    >
                      {rsvp.attendance === true
                        ? 'Attending'
                        : rsvp.attendance === false
                          ? 'Not Attending'
                          : 'Pending'}
                    </span>
                  </div>

                  <div className="text-sm text-muted-foreground flex flex-wrap gap-x-6 gap-y-1">
                    <div>Guests: <strong>{rsvp.guestNumber ?? 1}</strong></div>
                    {rsvp.mealPreference && (
                      <div>Meal: <strong>{rsvp.mealPreference}</strong></div>
                    )}
                    {rsvp.createdAt && (
                      <div>
                        Submitted:{' '}
                        {new Date(rsvp.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    )}
                  </div>

                  {rsvp.message && (
                    <p className="text-sm italic text-muted-foreground mt-2 border-l-2 pl-3">
                      "{rsvp.message}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}