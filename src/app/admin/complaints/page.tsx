import { getComplaints } from '../actions';
import ComplaintsManager from './ComplaintsManager';

export const dynamic = 'force-dynamic';

export default async function AdminComplaintsPage() {
  const complaints = await getComplaints();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-headline font-black text-4xl uppercase text-white mb-2">Complaints & Queries</h1>
        <p className="text-on-surface-variant font-medium">Manage user issues, feature requests, and inquiries.</p>
      </div>

      <ComplaintsManager initialComplaints={complaints} />
    </div>
  );
}
