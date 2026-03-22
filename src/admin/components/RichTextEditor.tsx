import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Link as LinkIcon, ImageIcon, Undo, Redo } from 'lucide-react';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = 'Почніть писати...' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      ImageExtension,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const ToolBtn = ({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${active ? 'bg-teal-100 text-teal-700' : 'text-gray-500 hover:bg-gray-100'}`}
    >
      {children}
    </button>
  );

  const addLink = () => {
    const url = window.prompt('URL посилання:');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('URL зображення:');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500">
      <div className="flex flex-wrap gap-0.5 p-1.5 border-b border-gray-200 bg-gray-50">
        <ToolBtn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} />
        </ToolBtn>
        <ToolBtn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} />
        </ToolBtn>
        <ToolBtn active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={16} />
        </ToolBtn>
        <ToolBtn active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 size={16} />
        </ToolBtn>
        <ToolBtn active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} />
        </ToolBtn>
        <ToolBtn active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={16} />
        </ToolBtn>
        <ToolBtn onClick={addLink}><LinkIcon size={16} /></ToolBtn>
        <ToolBtn onClick={addImage}><ImageIcon size={16} /></ToolBtn>
        <div className="flex-1" />
        <ToolBtn onClick={() => editor.chain().focus().undo().run()}><Undo size={16} /></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()}><Redo size={16} /></ToolBtn>
      </div>
      <EditorContent editor={editor} className="prose prose-sm max-w-none p-3 min-h-[120px] [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none" />
    </div>
  );
}
