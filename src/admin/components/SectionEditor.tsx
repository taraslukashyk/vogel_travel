import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import ImageUploader from './ImageUploader';
import FormField, { inputClass } from './FormField';
import type { DBSection } from '../../lib/types';

interface SectionEditorProps {
  sections: DBSection[];
  onChange: (sections: DBSection[]) => void;
}

function SortableSection({ section, index, onUpdate, onRemove }: {
  section: DBSection & { _id: string };
  index: number;
  onUpdate: (index: number, section: DBSection) => void;
  onRemove: (index: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section._id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <button type="button" {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600">
          <GripVertical size={18} />
        </button>
        <select
          value={section.type}
          onChange={(e) => {
            const type = e.target.value as DBSection['type'];
            const updated: DBSection = type === 'list'
              ? { type, title: section.title, content: [] }
              : type === 'image'
                ? { type, content: '', image: '' }
                : { type, title: section.title, content: '' };
            onUpdate(index, updated);
          }}
          className="px-2 py-1 border border-gray-300 rounded text-sm"
        >
          <option value="text">Текст</option>
          <option value="image">Зображення</option>
          <option value="list">Список</option>
        </select>
        <span className="text-xs text-gray-400">#{index + 1}</span>
        <div className="flex-1" />
        <button type="button" onClick={() => onRemove(index)} className="text-red-400 hover:text-red-600">
          <Trash2 size={16} />
        </button>
      </div>

      {(section.type === 'text' || section.type === 'list') && (
        <input
          type="text"
          value={section.title || ''}
          onChange={(e) => onUpdate(index, { ...section, title: e.target.value })}
          placeholder="Заголовок секції (необов'язково)"
          className={inputClass}
        />
      )}

      {section.type === 'text' && (
        <RichTextEditor
          value={typeof section.content === 'string' ? section.content : ''}
          onChange={(val) => onUpdate(index, { ...section, content: val })}
          placeholder="Вміст секції..."
        />
      )}

      {section.type === 'image' && (
        <>
          <ImageUploader
            value={section.image || ''}
            onChange={(url) => onUpdate(index, { ...section, image: url })}
            folder="sections"
          />
          <FormField label="Підпис до зображення" tooltip="Текст під картинкою (не обов'язково)">
            <input
              type="text"
              value={typeof section.content === 'string' ? section.content : ''}
              onChange={(e) => onUpdate(index, { ...section, content: e.target.value })}
              placeholder="Введіть підпис..."
              className={inputClass}
            />
          </FormField>
          <FormField label="Alt текст" tooltip="Опис зображення для SEO та людей з порушенням зору.">
            <input
              type="text"
              value={section.alt || ''}
              onChange={(e) => onUpdate(index, { ...section, alt: e.target.value })}
              placeholder="Що зображено на фото?"
              className={inputClass + ' text-xs'}
            />
          </FormField>
        </>
      )}

      {section.type === 'list' && (
        <div className="space-y-2">
          {(Array.isArray(section.content) ? section.content : []).map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const newContent = [...(section.content as string[])];
                  newContent[i] = e.target.value;
                  onUpdate(index, { ...section, content: newContent });
                }}
                className={inputClass}
                placeholder={`Пункт ${i + 1}`}
              />
              <button
                type="button"
                onClick={() => {
                  const newContent = (section.content as string[]).filter((_, j) => j !== i);
                  onUpdate(index, { ...section, content: newContent });
                }}
                className="text-red-400 hover:text-red-600 shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newContent = [...(Array.isArray(section.content) ? section.content : []), ''];
              onUpdate(index, { ...section, content: newContent });
            }}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            + Додати пункт
          </button>
        </div>
      )}
    </div>
  );
}

export default function SectionEditor({ sections, onChange }: SectionEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const sectionsWithIds = sections.map((s, i) => ({ ...s, _id: `section-${i}` }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sectionsWithIds.findIndex(s => s._id === active.id);
      const newIndex = sectionsWithIds.findIndex(s => s._id === over.id);
      const reordered = arrayMove(sections, oldIndex, newIndex);
      onChange(reordered);
    }
  };

  const handleUpdate = (index: number, section: DBSection) => {
    const updated = [...sections];
    updated[index] = section;
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    onChange(sections.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    onChange([...sections, { type: 'text', content: '' }]);
  };

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sectionsWithIds.map(s => s._id)} strategy={verticalListSortingStrategy}>
          {sectionsWithIds.map((section, index) => (
            <SortableSection
              key={section._id}
              section={section}
              index={index}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
            />
          ))}
        </SortableContext>
      </DndContext>
      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-teal-500 hover:text-teal-600 w-full justify-center transition-colors"
      >
        <Plus size={16} />
        Додати секцію
      </button>
    </div>
  );
}
