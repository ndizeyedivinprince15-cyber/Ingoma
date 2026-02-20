import { ReactNode } from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Alert({
  type,
  title,
  children,
  className = '',
}: AlertProps) {
  const styles = {
    success: {
      container: 'bg-green-50 border-green-200',
      icon: '✓',
      iconBg: 'bg-green-100 text-green-600',
      title: 'text-green-800',
      text: 'text-green-700',
    },
    error: {
      container: 'bg-red-50 border-red-200',
      icon: '✕',
      iconBg: 'bg-red-100 text-red-600',
      title: 'text-red-800',
      text: 'text-red-700',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200',
      icon: '⚠',
      iconBg: 'bg-yellow-100 text-yellow-600',
      title: 'text-yellow-800',
      text: 'text-yellow-700',
    },
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: 'ℹ',
      iconBg: 'bg-blue-100 text-blue-600',
      title: 'text-blue-800',
      text: 'text-blue-700',
    },
  };

  const s = styles[type];

  return (
    <div
      className={`rounded-lg border p-4 ${s.container} ${className}`}
      role="alert"
    >
      <div className="flex">
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${s.iconBg}`}
        >
          {s.icon}
        </div>
        <div className="ml-3">
          {title && (
            <h3 className={`text-sm font-medium ${s.title}`}>{title}</h3>
          )}
          <div className={`text-sm ${s.text} ${title ? 'mt-1' : ''}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
