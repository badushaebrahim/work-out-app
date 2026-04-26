import { getTrainerQueries } from '../actions';
import TrainersManager from './TrainersManager';

export const dynamic = 'force-dynamic';

export default async function AdminTrainersPage() {
  const queries = await getTrainerQueries();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-headline font-black text-4xl uppercase text-white mb-2">Trainer Partnerships</h1>
        <p className="text-on-surface-variant font-medium">Review and manage gym trainer applications.</p>
      </div>

      <TrainersManager initialQueries={queries} />
    </div>
  );
}
