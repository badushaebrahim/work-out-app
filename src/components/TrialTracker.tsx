"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TrialTracker() {
  const router = useRouter();

  useEffect(() => {
    try {
      // Check if user is logged in natively via our HttpOnly cookie? 
      // We can't read httpOnly cookie here. We assume this component is only for unauthenticated/basic tracking 
      // But we can check localStorage solely to lock them out of the frontend if their device is expired.
      
      const TRIAL_DAYS = 7;
      let deviceId = localStorage.getItem('buddy_device_id');
      let firstVisit = localStorage.getItem('buddy_first_visit');

      if (!deviceId) {
        deviceId = 'dev_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('buddy_device_id', deviceId);
      }

      if (!firstVisit) {
        firstVisit = new Date().toISOString();
        localStorage.setItem('buddy_first_visit', firstVisit);
      }

      const visitDate = new Date(firstVisit);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate.getTime() - visitDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > TRIAL_DAYS) {
        // Trial has expired
        router.push('/expired');
      }
    } catch (error) {
      console.error("Failed to track trial status", error);
    }
  }, [router]);

  return null; // Invisible tracker
}
