
import React from 'react';
import { Calendar, Package, ArrowRight, Clock, FileText } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { RequestStatus } from '../types';

const HistoryPage: React.FC = () => {
  const { requests, language } = useApp();

  const getStatusColor = (status: RequestStatus) => {
    switch(status) {
      case RequestStatus.PENDING: return 'bg-amber-50 text-amber-600 border-amber-100';
      case RequestStatus.APPROVED: return 'bg-sky-50 text-sky-600 border-sky-100';
      case RequestStatus.COMPLETED: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case RequestStatus.REJECTED: return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Exchanges</h1>

      {requests.length === 0 ? (
        <div className="text-center py-20 space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                <Clock size={40} />
            </div>
            <div className="space-y-1">
                <p className="font-bold text-gray-400">No requests yet</p>
                <p className="text-sm text-gray-300">Start exchanging to see your history here.</p>
            </div>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <Calendar size={12} />
                        {new Date(req.date).toLocaleDateString()}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(req.status)}`}>
                        {req.status}
                    </span>
                </div>

                <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={req.imageUrl} alt="Request" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-800">{req.clothesWeight} KG Clothes</span>
                            <ArrowRight size={12} className="text-gray-300" />
                            <span className="text-xs font-bold text-emerald-600">{req.productName}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                    <FileText size={10} /> Description
                  </p>
                  <p className="text-xs text-gray-600 italic">"{req.notes || 'No description provided'}"</p>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
