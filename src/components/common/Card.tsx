import * as React from 'react';
import { cn } from '../../lib/utils';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const Card = ({ children, className }: CardProps) => {
  return (
    <div className={cn('bg-white rounded-lg shadow-md overflow-hidden', className)}>
      {children}
    </div>
  );
};

type CardHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

const CardHeader = ({ children, className }: CardHeaderProps) => {
  return (
    <div className={cn('p-4 border-b border-gray-200', className)}>
      {children}
    </div>
  );
};

type CardContentProps = {
  children: React.ReactNode;
  className?: string;
};

const CardContent = ({ children, className }: CardContentProps) => {
  return (
    <div className={cn('p-4', className)}>
      {children}
    </div>
  );
};

type CardFooterProps = {
  children: React.ReactNode;
  className?: string;
};

const CardFooter = ({ children, className }: CardFooterProps) => {
  return (
    <div className={cn('p-4 border-t border-gray-200', className)}>
      {children}
    </div>
  );
};

type CardTitleProps = {
  children: React.ReactNode;
  className?: string;
};

const CardTitle = ({ children, className }: CardTitleProps) => {
  return (
    <h3 className={cn('text-xl font-semibold text-gray-900', className)}>
      {children}
    </h3>
  );
};

type CardDescriptionProps = {
  children: React.ReactNode;
  className?: string;
};

const CardDescription = ({ children, className }: CardDescriptionProps) => {
  return (
    <p className={cn('text-sm text-gray-500 mt-1', className)}>
      {children}
    </p>
  );
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Description = CardDescription;

export default Card;