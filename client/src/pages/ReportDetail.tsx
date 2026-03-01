import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getReport } from '../lib/api';
import ReportView from './ReportView';
import { ArrowLeft } from 'lucide-react';

export default function ReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    loadReport(id);
  }, [id]);

  const loadReport = async (reportId: string) => {
    try {
      const data = await getReport(reportId);
      setReport(data.report?.result || data.report);
    } catch {
      setError('Report not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors font-medium px-4 py-2 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {loading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
             <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
             <p className="text-gray-400">Loading analysis...</p>
          </div>
        )}
        
        {error && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-2">
               <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-white">Analysis Not Found</h2>
            <p className="text-gray-400 max-w-sm">{error}</p>
            <Link to="/analyze" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">
              Create a new analysis
            </Link>
          </div>
        )}

        {report && <ReportView report={report} />}
      </div>
    </div>
  );
}
