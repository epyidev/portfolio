import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  const baseClass = 'spinner';
  const sizeClass = size !== 'md' ? `spinner-${size}` : '';
  
  const classes = [baseClass, sizeClass, className].filter(Boolean).join(' ');

  return (
    <div className="flex-center">
      <div className={classes} />
    </div>
  );
};

export default LoadingSpinner;
