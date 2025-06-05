import React from 'react';

interface TableColumn {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
}

interface LocationTableProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  columns: TableColumn[];
  data: Record<string, any>[];
  variant?: 'default' | 'compact' | 'feature' | 'dark';
  className?: string;
  responsive?: boolean;
}

export default function LocationTable({
  title,
  subtitle,
  icon,
  columns,
  data,
  variant = 'default',
  className = '',
  responsive = true
}: LocationTableProps) {
  const baseClasses = "w-full";
  
  const variantClasses = {
    default: "bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden",
    compact: "bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden",
    feature: "bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl shadow-xl border border-primary/20 overflow-hidden",
    dark: "bg-gray-900 rounded-xl shadow-2xl border border-gray-700 overflow-hidden"
  };

  const headerClasses = {
    default: "bg-gray-50 border-b border-gray-200",
    compact: "bg-gray-100 border-b border-gray-300",
    feature: "bg-gradient-to-r from-primary to-primary-dark text-white",
    dark: "bg-gray-800 border-b border-gray-600"
  };

  const rowClasses = {
    default: "border-b border-gray-100 hover:bg-gray-50 transition-colors",
    compact: "border-b border-gray-200 hover:bg-gray-50 transition-colors",
    feature: "border-b border-primary/10 hover:bg-primary/5 transition-colors",
    dark: "border-b border-gray-700 hover:bg-gray-800 transition-colors text-gray-100"
  };

  const cellClasses = {
    default: "px-6 py-4 text-sm text-gray-900",
    compact: "px-4 py-3 text-sm text-gray-900",
    feature: "px-6 py-4 text-sm text-gray-900",
    dark: "px-6 py-4 text-sm text-gray-100"
  };

  const headerCellClasses = {
    default: "px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider",
    compact: "px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider",
    feature: "px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider",
    dark: "px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {/* Table Header */}
      {(title || subtitle) && (
        <div className={`p-6 ${variant === 'feature' ? 'bg-gradient-to-r from-primary to-primary-dark text-white' : variant === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'}`}>
          <div className="flex items-center space-x-3">
            {icon && (
              <div className={`flex-shrink-0 ${variant === 'feature' || variant === 'dark' ? 'text-white' : 'text-primary'}`}>
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className={`text-xl font-bold ${variant === 'feature' || variant === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className={`text-sm ${variant === 'feature' || variant === 'dark' ? 'text-white/80' : 'text-gray-600'} mt-1`}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table Content */}
      <div className={responsive ? "overflow-x-auto" : ""}>
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Head */}
          <thead className={headerClasses[variant]}>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`${headerCellClasses[variant]} ${column.width ? column.width : ''} ${
                    column.align === 'center' ? 'text-center' : 
                    column.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowClasses[variant]}>
                {columns.map((column, colIndex) => {
                  const cellValue = row[column.key];
                  const renderedValue = column.render ? column.render(cellValue, row) : cellValue;
                  
                  return (
                    <td
                      key={column.key}
                      className={`${cellClasses[variant]} ${
                        column.align === 'center' ? 'text-center' : 
                        column.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {renderedValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer (if needed for notes/disclaimers) */}
      {variant === 'feature' && (
        <div className="px-6 py-3 bg-primary/5 border-t border-primary/20">
          <p className="text-xs text-gray-600 text-center">
            Data updated in real-time • Contact film liaison for current rates
          </p>
        </div>
      )}
    </div>
  );
}

// Preset configurations for common table types
export const FilmographyTable = ({ data, ...props }: Omit<LocationTableProps, 'columns'>) => (
  <LocationTable
    icon={
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
      </svg>
    }
    columns={[
      { key: 'year', header: 'Year', width: 'w-20', align: 'center' },
      { 
        key: 'production', 
        header: 'Production', 
        render: (value) => <span className="font-semibold text-primary">{value}</span>
      },
      { key: 'location', header: 'Key Larne Spot' }
    ]}
    data={data}
    variant="feature"
    {...props}
  />
);

export const TechnicalTable = ({ data, ...props }: Omit<LocationTableProps, 'columns'>) => (
  <LocationTable
    icon={
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    }
    columns={[
      { 
        key: 'zone', 
        header: 'Zone', 
        render: (value) => <span className="font-bold text-gray-900">{value}</span>
      },
      { key: 'power', header: 'Mains Access' },
      { key: 'connectivity', header: '4G/5G' },
      { key: 'parking', header: 'Parking for Trucks' }
    ]}
    data={data}
    variant="default"
    {...props}
  />
);

export const BudgetTable = ({ data, ...props }: Omit<LocationTableProps, 'columns'>) => (
  <LocationTable
    icon={
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    }
    columns={[
      { 
        key: 'service', 
        header: 'Service',
        render: (value) => <span className="font-semibold text-gray-900">{value}</span>
      },
      { 
        key: 'rate', 
        header: 'Day Rate', 
        align: 'right',
        render: (value) => <span className="font-bold text-primary">{value}</span>
      },
      { key: 'notes', header: 'Notes' }
    ]}
    data={data}
    variant="compact"
    {...props}
  />
);

export const WeatherTable = ({ data, ...props }: Omit<LocationTableProps, 'columns'>) => (
  <LocationTable
    icon={
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    }
    columns={[
      { 
        key: 'month', 
        header: 'Month',
        render: (value) => <span className="font-bold text-gray-900">{value}</span>
      },
      { key: 'rainDays', header: 'Avg Rain Days', align: 'center' },
      { key: 'goldenHour', header: 'Golden Hour', align: 'center' },
      { key: 'sunrise', header: 'Sunrise', align: 'center' },
      { key: 'sunset', header: 'Sunset', align: 'center' }
    ]}
    data={data}
    variant="default"
    {...props}
  />
); 