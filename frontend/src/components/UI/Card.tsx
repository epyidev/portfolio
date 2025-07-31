import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
}) => {
  const baseClass = 'card';
  const hoverClass = hover ? 'card-hover' : '';
  
  const classes = [baseClass, hoverClass, className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Card;
