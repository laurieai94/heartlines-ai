import React from 'react';
import { format, isToday, isYesterday, isThisYear } from 'date-fns';

interface DateSeparatorProps {
  date: Date;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => {
  const formatDate = (date: Date): string => {
    if (isToday(date)) {
      return 'Today';
    }
    if (isYesterday(date)) {
      return 'Yesterday';
    }
    if (isThisYear(date)) {
      return format(date, 'MMMM d'); // "January 23"
    }
    return format(date, 'MMMM d, yyyy'); // "January 23, 2024"
  };

  return (
    <div className="flex items-center justify-center my-4 md:my-6 px-4">
      <div className="flex items-center gap-3 text-white/40 text-xs md:text-sm font-light">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent max-w-[80px]"></div>
        <time dateTime={date.toISOString()} className="whitespace-nowrap">
          {formatDate(date)}
        </time>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent max-w-[80px]"></div>
      </div>
    </div>
  );
};

export default DateSeparator;
