import type { DBSection } from '../../lib/types';

/**
 * Synchronizes the structure of the target section array to match the source array.
 * This keeps the types and order in sync while preserving existing localized content.
 */
export function syncSections(source: DBSection[] | null | undefined, target: DBSection[] | null | undefined): DBSection[] {
  const src = Array.isArray(source) ? source : [];
  const tgt = Array.isArray(target) ? target : [];

  // We want to return a new target array that has the same length and types as source
  return src.map((sourceSection, index) => {
    const targetSection = tgt[index];

    // If a section exists at this index with the same type, keep its content
    if (targetSection && targetSection.type === sourceSection.type) {
      // For image type, we want to always sync the image link itself
      if (sourceSection.type === 'image') {
        return { ...targetSection, image: sourceSection.image };
      }
      return targetSection;
    }

    // Otherwise, create a new empty section of the same type
    switch (sourceSection.type) {
      case 'text':
        return { type: 'text', title: '', content: '' };
      case 'image':
        return { type: 'image', content: '', image: sourceSection.image || '', alt: '' };
      case 'list':
        return { type: 'list', title: '', content: [] };
      default:
        // Try to keep as much as possible if type matches partially or return default
        return { 
          type: sourceSection.type, 
          title: '', 
          content: Array.isArray(sourceSection.content) ? [] : '',
          image: (sourceSection as any).image 
        } as DBSection;
    }
  });
}
