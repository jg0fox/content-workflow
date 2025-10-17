import { useState } from 'react';

interface CollapsibleSectionProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const CollapsibleSection = ({
  title,
  icon,
  children,
  defaultExpanded = false,
}: CollapsibleSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div
      style={{
        border: '1px solid #444',
        borderRadius: '6px',
        marginBottom: '8px',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="nodrag"
        style={{
          width: '100%',
          padding: '8px 12px',
          background: '#333',
          border: 'none',
          color: '#e0e0e0',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'left',
        }}
      >
        <span>
          {icon && <span style={{ marginRight: '6px' }}>{icon}</span>}
          {title}
        </span>
        <span style={{ fontSize: '10px' }}>{isExpanded ? '▼' : '▶'}</span>
      </button>

      {isExpanded && (
        <div
          style={{
            padding: '12px',
            background: '#2a2a2a',
            fontSize: '12px',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
