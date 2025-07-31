import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button, Input } from './UI';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
}

const TagSelector: React.FC<TagSelectorProps> = ({ 
  selectedTags, 
  onTagsChange, 
  label = "Tags",
  placeholder = "Ajouter un tag..."
}) => {
  const [newTag, setNewTag] = useState('');

  // Tags prédéfinis populaires
  const popularTags = [
    'Web Design', 'UI/UX', 'React', 'TypeScript', 'JavaScript', 'Node.js',
    'Python', 'PHP', 'WordPress', 'E-commerce', 'Mobile', 'API',
    'Database', 'Frontend', 'Backend', 'Full Stack', 'Responsive',
    'Animation', 'Branding', 'Logo Design', 'Print Design', 'Photography'
  ];

  const availableTags = popularTags.filter(tag => !selectedTags.includes(tag));

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !selectedTags.includes(tag.trim())) {
      onTagsChange([...selectedTags, tag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(newTag);
    }
  };

  return (
    <div>
      <label style={{ 
        display: 'block', 
        marginBottom: 'var(--spacing-xs)', 
        fontSize: '0.875rem', 
        fontWeight: '500' 
      }}>
        {label}
      </label>

      {/* Tags sélectionnés */}
      {selectedTags.length > 0 && (
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 'var(--spacing-xs)', 
          marginBottom: 'var(--spacing-md)' 
        }}>
          {selectedTags.map((tag) => (
            <span
              key={tag}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                backgroundColor: 'var(--primary-100)',
                color: 'var(--primary-700)',
                borderRadius: 'var(--border-radius)',
                fontSize: '0.875rem'
              }}
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-600)'
                }}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Ajouter un nouveau tag */}
      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
        <div style={{ flex: 1 }}>
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          icon={Plus}
          onClick={() => handleAddTag(newTag)}
          disabled={!newTag.trim() || selectedTags.includes(newTag.trim())}
        >
          Ajouter
        </Button>
      </div>

      {/* Tags populaires */}
      {availableTags.length > 0 && (
        <div>
          <p style={{ 
            fontSize: '0.75rem', 
            color: 'var(--gray-600)', 
            marginBottom: 'var(--spacing-xs)' 
          }}>
            Tags populaires :
          </p>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 'var(--spacing-xs)' 
          }}>
            {availableTags.slice(0, 12).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddTag(tag)}
                style={{
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  backgroundColor: 'var(--gray-100)',
                  color: 'var(--gray-700)',
                  border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--border-radius)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--gray-200)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--gray-100)';
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSelector;
