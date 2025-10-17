interface ListEditorProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  icon?: string;
  itemColor?: string;
}

export const ListEditor = ({
  label,
  items,
  onChange,
  placeholder = 'Add item...',
  icon,
  itemColor = '#333',
}: ListEditorProps) => {
  const handleAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      onChange([...items, e.currentTarget.value.trim()]);
      e.currentTarget.value = '';
    }
  };

  const handleRemove = (indexToRemove: number) => {
    onChange(items.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: '#999' }}>
        {icon && <span style={{ marginRight: '4px' }}>{icon}</span>}
        {label}
      </label>

      <div style={{ marginBottom: '4px' }}>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '6px 8px',
              background: itemColor,
              borderRadius: '4px',
              marginBottom: '4px',
              fontSize: '11px',
              gap: '8px',
            }}
          >
            <span style={{ flex: 1, lineHeight: '1.4' }}>{item}</span>
            <button
              onClick={() => handleRemove(index)}
              className="nodrag"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                padding: '0 4px',
                fontSize: '14px',
                lineHeight: '1',
                flexShrink: 0,
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder={placeholder}
        className="nodrag"
        onKeyDown={handleAdd}
        style={{
          width: '100%',
          padding: '6px',
          background: '#1a1a1a',
          border: '1px solid #444',
          borderRadius: '4px',
          color: '#e0e0e0',
          fontSize: '11px',
        }}
      />
      <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
        Press Enter to add • {items.length} item{items.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};
