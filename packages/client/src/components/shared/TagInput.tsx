import { useState } from 'react';

interface TagInputProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

export const TagInput = ({ label, tags, onChange, placeholder, maxTags }: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!maxTags || tags.length < maxTags) {
        if (!tags.includes(inputValue.trim())) {
          onChange([...tags, inputValue.trim()]);
        }
        setInputValue('');
      }
    }
  };

  const handleRemove = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', color: '#999' }}>
        {label}
      </label>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          padding: '6px',
          background: '#1a1a1a',
          borderRadius: '4px',
          border: '1px solid #444',
          minHeight: '32px',
        }}
      >
        {tags.map((tag, index) => (
          <span
            key={index}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              background: '#4A90E2',
              color: 'white',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '500',
            }}
          >
            {tag}
            <button
              onClick={() => handleRemove(index)}
              className="nodrag"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '0 2px',
                fontSize: '12px',
                lineHeight: '1',
              }}
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="nodrag"
          disabled={maxTags ? tags.length >= maxTags : false}
          style={{
            flex: 1,
            minWidth: '100px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#e0e0e0',
            fontSize: '11px',
            padding: '4px',
          }}
        />
      </div>
      <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
        Press Enter to add {maxTags && `(${tags.length}/${maxTags})`}
      </div>
    </div>
  );
};
