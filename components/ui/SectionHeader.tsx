
import { ReactNode } from 'react';

interface SectionHeaderProps {
  badge?: string;
  title?: string;
  description?: string;
  titleId?: string;
  children?: ReactNode;
  className?: string;
}

export function SectionHeader({
  badge,
  title,
  description,
  titleId,
  children,
  className = '',
}: SectionHeaderProps) {
  return (
    <header
      className={`text-center max-w-3xl mx-auto mb-12 px-4 ${className}`}
    >
      {badge && (
        <p className="
          text-sm font-medium
          text-gray-500 dark:text-gray-400
          mb-3 font-bengali
        ">
          {badge}
        </p>
      )}

      {title && (
        <h2
          id={titleId}
          className="
            text-2xl sm:text-3xl lg:text-4xl
            font-bold
            tracking-tight
            leading-snug
            text-gray-900 dark:text-white
            mb-4
            font-bengali
          "
        >
          {title}
        </h2>
      )}


      {children && (
        <div className="mt-6">
          {children}
        </div>
      )}
    </header>
  );
}
