'use client';

import { useState, useTransition } from 'react';
import { updateComplaintStatus, deleteComplaint } from '../actions';

interface Complaint {
  _id: string;
  userEmail: string;
  userName: string;
  subject: string;
  message: string;
  type: 'complaint' | 'query';
  status: 'pending' | 'in-review' | 'resolved' | 'rejected';
  adminNotes: string;
  createdAt: string;
}

export default function ComplaintsManager({ initialComplaints }: { initialComplaints: Complaint[] }) {
  const [isPending, startTransition] = useTransition();

  function handleStatusUpdate(id: string, newStatus: string, currentNotes: string) {
    const notes = prompt('Add or update admin notes:', currentNotes);
    if (notes === null) return; // User cancelled

    startTransition(async () => {
      await updateComplaintStatus(id, newStatus, notes);
    });
  }

  function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this record?')) return;
    
    startTransition(async () => {
      await deleteComplaint(id);
    });
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-tertiary text-black';
      case 'in-review': return 'bg-blue-500 text-white';
      case 'resolved': return 'bg-green-500 text-white';
      case 'rejected': return 'bg-error text-white';
      default: return 'bg-surface-container-low text-white';
    }
  };

  if (!initialComplaints || initialComplaints.length === 0) {
    return (
      <div className="bg-surface-container-low rounded-2xl border border-white/5 p-10 text-center">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">check_circle</span>
        <h3 className="font-headline font-bold text-xl uppercase tracking-widest text-white mb-2">All Clear</h3>
        <p className="text-on-surface-variant">No active complaints or queries to manage.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {initialComplaints.map((c) => (
        <div key={c._id} className="bg-surface-container-low rounded-2xl border border-white/5 p-6 space-y-6">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-headline font-bold text-white text-lg">{c.subject}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${getStatusColor(c.status)}`}>
                  {c.status}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-surface-container text-on-surface-variant border border-white/10">
                  {c.type}
                </span>
              </div>
              <p className="text-sm text-on-surface-variant">
                From: <strong className="text-white">{c.userEmail}</strong> {c.userName && `(${c.userName})`}
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                {new Date(c.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 items-start shrink-0">
              <select
                value={c.status}
                onChange={(e) => handleStatusUpdate(c._id, e.target.value, c.adminNotes)}
                disabled={isPending}
                className="bg-surface-container text-white text-xs font-bold uppercase tracking-widest px-3 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-[#CCFF00]/50"
              >
                <option value="pending">Pending</option>
                <option value="in-review">In Review</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                onClick={() => handleStatusUpdate(c._id, c.status, c.adminNotes)}
                disabled={isPending}
                className="bg-surface-container text-white text-xs font-bold uppercase tracking-widest px-3 py-2 rounded-lg border border-white/10 hover:bg-surface-container-high flex items-center gap-1"
                title="Update Notes"
              >
                <span className="material-symbols-outlined text-sm">edit_note</span> Notes
              </button>
              <button
                onClick={() => handleDelete(c._id)}
                disabled={isPending}
                className="bg-error/10 text-error hover:bg-error/20 text-xs font-bold uppercase tracking-widest px-3 py-2 rounded-lg border border-error/20 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          </div>

          {/* Message Body */}
          <div className="bg-surface-container-lowest rounded-xl p-4">
            <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{c.message}</p>
          </div>

          {/* Admin Notes */}
          {c.adminNotes && (
            <div className="bg-tertiary/5 border border-tertiary/20 rounded-xl p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-tertiary mb-2">Admin Notes</p>
              <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{c.adminNotes}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
