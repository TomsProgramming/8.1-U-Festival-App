import type { ReactNode } from 'react';

interface SectionProps {
  title: string;
  action?: string | null;
  onAction?: () => void;
  children: ReactNode;
}

export function Section({ title, action, onAction, children }: SectionProps) {
  return (
    <div className="section">
      <div className="section__header">
        <div className="section__title">{title}</div>
        {action && (
          <div className="section__action" onClick={onAction}>
            {action}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
