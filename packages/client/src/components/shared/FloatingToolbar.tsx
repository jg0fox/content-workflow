import { memo } from 'react';
import { BubbleMenu } from '@tiptap/react';
import type { Editor } from '@tiptap/react';

interface FloatingToolbarProps {
  editor: Editor | null;
}

export const FloatingToolbar = memo(({ editor }: FloatingToolbarProps) => {
  if (!editor) {
    return null;
  }

  const buttonStyle = (isActive: boolean) => ({
    padding: '8px 12px',
    background: isActive ? '#4A90E2' : 'transparent',
    border: 'none',
    borderRadius: '6px',
    color: isActive ? 'white' : '#e0e0e0',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '32px',
  });

  const separatorStyle = {
    width: '1px',
    height: '24px',
    background: 'rgba(255,255,255,0.15)',
    margin: '0 6px',
  };

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        duration: 150,
        maxWidth: 'none',
        placement: 'top',
        arrow: false,
      }}
      className="nodrag"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '6px 8px',
          background: 'rgba(26, 26, 26, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
        }}
      >
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          style={buttonStyle(editor.isActive('bold'))}
          title="Bold (Ctrl+B)"
          onMouseEnter={(e) => {
            if (!editor.isActive('bold')) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!editor.isActive('bold')) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          <span style={{ fontWeight: '700' }}>B</span>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          style={buttonStyle(editor.isActive('italic'))}
          title="Italic (Ctrl+I)"
          onMouseEnter={(e) => {
            if (!editor.isActive('italic')) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!editor.isActive('italic')) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          <span style={{ fontStyle: 'italic', fontFamily: 'serif' }}>I</span>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          style={buttonStyle(editor.isActive('strike'))}
          title="Strikethrough"
          onMouseEnter={(e) => {
            if (!editor.isActive('strike')) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!editor.isActive('strike')) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          <span style={{ textDecoration: 'line-through' }}>S</span>
        </button>

        <div style={separatorStyle} />

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          style={buttonStyle(editor.isActive('heading', { level: 2 }))}
          title="Heading"
          onMouseEnter={(e) => {
            if (!editor.isActive('heading', { level: 2 })) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!editor.isActive('heading', { level: 2 })) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          H
        </button>

        <div style={separatorStyle} />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          style={buttonStyle(editor.isActive('bulletList'))}
          title="Bullet List"
          onMouseEnter={(e) => {
            if (!editor.isActive('bulletList')) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!editor.isActive('bulletList')) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          •
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          style={buttonStyle(editor.isActive('orderedList'))}
          title="Numbered List"
          onMouseEnter={(e) => {
            if (!editor.isActive('orderedList')) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!editor.isActive('orderedList')) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          1.
        </button>

        <div style={separatorStyle} />

        <button
          onClick={() => {
            const url = window.prompt('Enter URL:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          style={buttonStyle(editor.isActive('link'))}
          title="Add Link"
          onMouseEnter={(e) => {
            if (!editor.isActive('link')) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!editor.isActive('link')) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          🔗
        </button>
      </div>
    </BubbleMenu>
  );
});

FloatingToolbar.displayName = 'FloatingToolbar';
