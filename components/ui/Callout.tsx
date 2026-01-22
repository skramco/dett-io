import { HTMLAttributes } from 'react';

interface CalloutProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning';
  title?: string;
}

export default function Callout({ 
  children, 
  variant = 'info', 
  title,
  className = '', 
  ...props 
}: CalloutProps) {
  const variants = {
    info: 'bg-accent-light border-accent/20 text-foreground',
    success: 'bg-success-light border-success/20 text-foreground',
    warning: 'bg-warning-light border-warning/20 text-foreground',
  };
  
  return (
    <div 
      className={`rounded-lg border p-4 ${variants[variant]} ${className}`}
      {...props}
    >
      {title && (
        <h4 className="font-semibold mb-2">{title}</h4>
      )}
      <div className="text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}
