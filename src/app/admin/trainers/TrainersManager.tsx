'use client';

import { useState, useTransition } from 'react';
import { updateTrainerQueryStatus, deleteTrainerQuery } from '../actions';

interface TrainerQuery {
  _id: string;
  userEmail: string;
  userName: string;
  trainerName: string;
  experience: string;
  message: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected' | 'contacted';
  adminNotes: string;
  createdAt: string;
}

export default function TrainersManager({ initialQueries }: { initialQueries: TrainerQuery[] }) {
  const [isPending, startTransition] = useTransition();

  function handleStatusUpdate(id: string, newStatus: string, currentNotes: string) {
    const notes = prompt('Add or update admin notes:', currentNotes);
    if (notes === null) return; // User cancelled

    startTransition(async () => {
      await updateTrainerQueryStatus(id, newStatus, notes);
    });
  }

  function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this record?')) return;
    
    startTransition(async () => {
      await deleteTrainerQuery(id);
    });
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-tertiary text-black';
      case 'approved': return 'bg-green-500 text-white';
      case 'rejected': return 'bg-error text-white';
      case 'contacted': return 'bg-blue-500 text-white';
      default: return 'bg-surface-container-low text-white';
    }
  };

  if (!initialQueries || initialQueries.length === 0) {
    return (
      <div className="bg-surface-container-low rounded-2xl border border-white/5 p-10 text-center">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">sports</span>
        <h3 className="font-headline font-bold text-xl uppercase tracking-widest text-white mb-2">No Applications</h3>
        <p className="text-on-surface-variant">There are currently no pending trainer partnership applications.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {initialQueries.map((q) => (
        <div key={q._id} className="bg-surface-container-low rounded-2xl border border-white/5 p-6 space-y-6">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-headline font-bold text-white text-lg">{q.trainerName}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${getStatusColor(q.status)}`}>
                  {q.status}
                </span>
              </div>
              <p className="text-sm text-on-surface-variant mb-1">
                Account: <strong className="text-white">{q.userEmail}</strong> {q.userName && `(${q.userName})`}
              </p>
              <div className="flex gap-4 text-xs text-on-surface-variant">
                <span>Exp: <strong className="text-white">{q.experience}</strong></span>
                {q.phone && <span>Phone: <strong className="text-white">{q.phone}</strong></span>}
                <span>Date: {new Date(q.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 items-start shrink-0">
              <select
                value={q.status}
                onChange={(e) => handleStatusUpdate(q._id, e.target.value, q.adminNotes)}
                disabled={isPending}
                className="bg-surface-container text-white text-xs font-bold uppercase tracking-widest px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[#CCFF00]/50"
              >
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                onClick={() => handleStatusUpdate(q._id, q.status, q.adminNotes)}
                disabled={isPending}
                className="bg-surface-container text-white text-xs font-bold uppercase tracking-widest px-3 py-2 rounded-lg border border-white/10 hover:bg-surface-container-high flex items-center gap-1"
                title="Update Notes"
              >
                <span className="material-symbols-outlined text-sm">edit_note</span> Notes
              </button>
              <button
                onClick={() => handleDelete(q._id)}
                disabled={isPending}
                className="bg-error/10 text-error hover:bg-error/20 text-xs font-bold uppercase tracking-widest px-3 py-2 rounded-lg border border-error/20 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          </div>

          {/* Message Body */}
          <div className="bg-surface-container-lowest rounded-xl p-4">
            <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{q.message}</p>
          </div>

          {/* Admin Notes */}
          {q.adminNotes && (
            <div className="bg-tertiary/5 border border-tertiary/20 rounded-xl p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-tertiary mb-2">Admin Notes</p>
              <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{q.adminNotes}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
