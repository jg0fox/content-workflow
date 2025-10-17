import { memo, useEffect, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import type { Node } from '@xyflow/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import type { ContentNodeData } from '../../types/nodes';
import { FloatingToolbar } from '../shared/FloatingToolbar';

export const ContentNode = memo(({ data, id }: Node<ContentNodeData>) => {
  const { setNodes } = useReactFlow();
  const [isFocused, setIsFocused] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
    ],
    content: data.content || '<p></p>',
    editorProps: {
      attributes: {
        class: 'nodrag',
        style: 'outline: none; min-height: 200px;',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length);
      setCharCount(text.length);

      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, content: html } as ContentNodeData }
            : node
        )
      );
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  });

  // Update editor content when data changes externally (e.g., from LLM output)
  useEffect(() => {
    if (editor && data.content !== editor.getHTML()) {
      editor.commands.setContent(data.content || '<p></p>');
      const text = editor.getText();
      setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length);
      setCharCount(text.length);
    }
  }, [data.content, editor]);

  return (
    <div
      style={{
        padding: '12px',
        borderRadius: '12px',
        border: `2px solid ${isFocused ? '#27AE60' : '#444'}`,
        background: '#2a2a2a',
        minWidth: '400px',
        maxWidth: '600px',
        color: '#e0e0e0',
        transition: 'border-color 0.2s ease',
      }}
    >
      <Handle type="target" position={Position.Left} id="content-in" style={{ background: '#27AE60' }} />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <div style={{ fontWeight: 'bold', color: '#27AE60', fontSize: '14px' }}>
          📄 Content Editor
        </div>
        {(wordCount > 0 || charCount > 0) && (
          <div style={{ fontSize: '10px', color: '#666', display: 'flex', gap: '12px' }}>
            <span>{wordCount} words</span>
            <span>{charCount} chars</span>
          </div>
        )}
      </div>

      {/* Visible Toolbar */}
      {editor && (
        <div
          className="nodrag"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '8px',
            background: '#2a2a2a',
            borderRadius: '6px',
            marginBottom: '8px',
            border: '1px solid #333',
          }}
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            style={{
              padding: '6px 10px',
              background: editor.isActive('bold') ? '#27AE60' : 'transparent',
              border: 'none',
              borderRadius: '4px',
              color: editor.isActive('bold') ? 'white' : '#e0e0e0',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '700',
            }}
            title="Bold"
          >
            B
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            style={{
              padding: '6px 10px',
              background: editor.isActive('italic') ? '#27AE60' : 'transparent',
              border: 'none',
              borderRadius: '4px',
              color: editor.isActive('italic') ? 'white' : '#e0e0e0',
              cursor: 'pointer',
              fontSize: '14px',
              fontStyle: 'italic',
            }}
            title="Italic"
          >
            I
          </button>

          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            style={{
              padding: '6px 10px',
              background: editor.isActive('strike') ? '#27AE60' : 'transparent',
              border: 'none',
              borderRadius: '4px',
              color: editor.isActive('strike') ? 'white' : '#e0e0e0',
              cursor: 'pointer',
              fontSize: '14px',
              textDecoration: 'line-through',
            }}
            title="Strikethrough"
          >
            S
          </button>

          <div style={{ width: '1px', height: '20px', background: '#444', margin: '0 4px' }} />

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            style={{
              padding: '6px 10px',
              background: editor.isActive('bulletList') ? '#27AE60' : 'transparent',
              border: 'none',
              borderRadius: '4px',
              color: editor.isActive('bulletList') ? 'white' : '#e0e0e0',
              cursor: 'pointer',
              fontSize: '14px',
            }}
            title="Bullet List"
          >
            •
          </button>

          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            style={{
              padding: '6px 10px',
              background: editor.isActive('orderedList') ? '#27AE60' : 'transparent',
              border: 'none',
              borderRadius: '4px',
              color: editor.isActive('orderedList') ? 'white' : '#e0e0e0',
              cursor: 'pointer',
              fontSize: '14px',
            }}
            title="Numbered List"
          >
            1.
          </button>

          <div style={{ width: '1px', height: '20px', background: '#444', margin: '0 4px' }} />

          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            style={{
              padding: '6px 10px',
              background: editor.isActive('heading', { level: 2 }) ? '#27AE60' : 'transparent',
              border: 'none',
              borderRadius: '4px',
              color: editor.isActive('heading', { level: 2 }) ? 'white' : '#e0e0e0',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
            }}
            title="Heading"
          >
            H
          </button>

          <button
            onClick={() => {
              const url = window.prompt('Enter URL:');
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            style={{
              padding: '6px 10px',
              background: editor.isActive('link') ? '#27AE60' : 'transparent',
              border: 'none',
              borderRadius: '4px',
              color: editor.isActive('link') ? 'white' : '#e0e0e0',
              cursor: 'pointer',
              fontSize: '14px',
            }}
            title="Link"
          >
            🔗
          </button>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              style={{
                padding: '6px 10px',
                background: 'transparent',
                border: 'none',
                borderRadius: '4px',
                color: editor.can().chain().focus().undo().run() ? '#e0e0e0' : '#555',
                cursor: editor.can().chain().focus().undo().run() ? 'pointer' : 'not-allowed',
                fontSize: '14px',
              }}
              title="Undo"
            >
              ↶
            </button>

            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              style={{
                padding: '6px 10px',
                background: 'transparent',
                border: 'none',
                borderRadius: '4px',
                color: editor.can().chain().focus().redo().run() ? '#e0e0e0' : '#555',
                cursor: editor.can().chain().focus().redo().run() ? 'pointer' : 'not-allowed',
                fontSize: '14px',
              }}
              title="Redo"
            >
              ↷
            </button>
          </div>
        </div>
      )}

      <FloatingToolbar editor={editor} />

      <div
        className="nodrag nowheel"
        style={{
          background: '#1a1a1a',
          borderRadius: '8px',
          padding: '16px',
          minHeight: '240px',
          maxHeight: '500px',
          overflow: 'auto',
          overflowY: 'scroll',
          fontSize: '15px',
          lineHeight: '1.7',
          border: `2px solid ${isFocused ? '#27AE60' : '#333'}`,
          transition: 'border-color 0.2s ease',
          position: 'relative',
          WebkitOverflowScrolling: 'touch',
        }}
        onWheel={(e) => {
          e.stopPropagation();
        }}
        onTouchMove={(e) => {
          e.stopPropagation();
        }}
      >
        <EditorContent editor={editor} />
        {!isFocused && (!data.content || data.content === '<p></p>') && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              color: '#666',
              fontSize: '15px',
              fontStyle: 'italic',
              pointerEvents: 'none',
            }}
          >
            Start typing...
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} id="content-out" style={{ background: '#27AE60' }} />
    </div>
  );
});

ContentNode.displayName = 'ContentNode';
