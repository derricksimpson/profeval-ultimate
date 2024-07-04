import React from 'react';

interface GradeDialProps {
  label: string;
  percentage: number;
  textValue?: string;
  value?: number;
  invert?: boolean;
  borderClass?: string;
}

const UltimateDialComponent: React.FC<GradeDialProps> = ({
  label,
  textValue,
  value,
  percentage,
  invert,
  borderClass,
}) => {
  // Determine the color class based on the percentage
  let colorClass;
  let lightColorClass;

  let calcPercentage = percentage;
  if (invert) {
    calcPercentage = 100 - percentage;
  }
  if (calcPercentage >= 66) {
    colorClass = 'bg-green-500';
    lightColorClass = 'bg-green-100';
  } else if (calcPercentage >= 33) {
    colorClass = 'bg-orange-500';
    lightColorClass = 'bg-orange-100';
  } else {
    colorClass = 'bg-red-500';
    lightColorClass = 'bg-red-100';
  }
  let hasData = true;

  if (value <= 0) {
    textValue = 'No Data';
    percentage = 0;
    hasData = false;
    lightColorClass = 'bg-gray-100';
  } else {
    percentage = Math.max(2, percentage);
  }

  return (
    <div className={`flex items-center py-3 ${borderClass} border-gray-100`}>
      {/* <span className="w-8 h-8 shrink-0 mr-4 rounded-full bg-blue-50 flex items-center justify-center"></span> */}
      <div className="space-y-3 flex-1">
        <div className="flex items-center">
          <h4 className="font-medium text-sm mr-auto text-gray-700 flex items-center">{label}</h4>
          <span className="px-2 py-1 rounded-lg bg-gray-50  font-medium text-sm">{textValue}</span>
        </div>

        <div style={{ width: `${percentage}%` }} className={`text-right h-0 rounded-full w-full relative`}>
          <div title={`${value?.toFixed(2)}`} className="relative h-2" style={{ left: '2px', top: '-9px' }}>
            {hasData && 'v'}
          </div>
        </div>
        <div className={`overflow-hidden ${lightColorClass} h-1.5 rounded-full w-full `}>
          <span className={`h-full ${colorClass} w-full block rounded-full`} style={{ width: `${percentage}%` }}></span>
        </div>
      </div>
    </div>
  );
};

export default UltimateDialComponent;
