import React from 'react';

interface GradeDialProps {
  label: string;
  value?: string;
  borderClass?: string;
}

const GradeDialComponent: React.FC<GradeDialProps> = ({ label, value, borderClass }) => {
  return (
    <div className={`flex items-center py-3 ${borderClass} border-gray-100`}>
      {/* <span className="w-8 h-8 shrink-0 mr-4 rounded-full bg-blue-50 flex items-center justify-center"></span> */}
      <div className="space-y-3 flex-1">
        <div className="flex items-center">
          <h4 className="font-medium text-sm mr-auto text-gray-700 flex items-center">{label}</h4>
          <span className="px-2 py-1 rounded-lg bg-gray-50 text-blue-800 text-xs">{value}</span>
        </div>
        <div className="overflow-hidden bg-blue-50 h-1.5 rounded-full w-full">
          <span className="h-full bg-blue-500 w-full block rounded-full" style={{ width: '64%' }}></span>
        </div>
      </div>
    </div>
  );
};

export default GradeDialComponent;
