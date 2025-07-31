import React, { useState, useEffect } from 'react';
import { Save, Upload, X } from 'lucide-react';
import { Button, Input, Textarea } from './UI';
import TagSelector from './TagSelector';
import projectService from '../services/projectService';
import { getImageUrl } from '../services/api';
import type { Project } from '../types';

interface ProjectFormProps {
  project?: Project;
  onSave: () => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    shortDescription: project?.shortDescription || '',
    longDescription: project?.longDescription || '',
    category: project?.category || '',
    tags: project?.tags || [],
    visibility: project?.visibility || 'public',
    order: project?.order?.toString() || '0'
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project?.thumbnail) {
      setThumbnailPreview(getImageUrl(project.thumbnail));
    }
  }, [project]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Ajouter les champs simples
      formDataToSend.append('title', formData.title);
      formDataToSend.append('shortDescription', formData.shortDescription);
      formDataToSend.append('longDescription', formData.longDescription);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('visibility', formData.visibility);
      formDataToSend.append('order', formData.order);
      
      // Convertir les tags en JSON string
      formDataToSend.append('tags', JSON.stringify(formData.tags));

      if (thumbnail) {
        formDataToSend.append('thumbnail', thumbnail);
      }

      if (project) {
        await projectService.updateProject(project.id, formDataToSend);
      } else {
        await projectService.createProject(formDataToSend);
      }

      onSave();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du projet');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Titre */}
      <Input
        label="Titre du projet"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        required
        placeholder="Mon super projet"
      />

      {/* Description courte */}
      <Textarea
        label="Description courte"
        name="shortDescription"
        value={formData.shortDescription}
        onChange={handleInputChange}
        required
        rows={3}
        placeholder="Une description concise du projet..."
      />

      {/* Description longue */}
      <Textarea
        label="Description détaillée"
        name="longDescription"
        value={formData.longDescription}
        onChange={handleInputChange}
        required
        rows={6}
        placeholder="Description complète du projet, technologies utilisées, fonctionnalités..."
      />

      {/* Catégorie */}
      <Input
        label="Catégorie"
        name="category"
        value={formData.category}
        onChange={handleInputChange}
        required
        placeholder="Web Design, Développement, UI/UX, Branding..."
      />

      {/* Tags */}
      <TagSelector
        selectedTags={formData.tags}
        onTagsChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
        label="Tags"
        placeholder="Ajouter un tag pour catégoriser le projet..."
      />

      {/* Visibilité et ordre */}
      <div className="grid grid-2 gap-lg">
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: 'var(--spacing-xs)', 
            fontSize: '0.875rem', 
            fontWeight: '500' 
          }}>
            Visibilité
          </label>
          <select
            name="visibility"
            value={formData.visibility}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: 'var(--spacing-sm)',
              border: '1px solid var(--gray-300)',
              borderRadius: 'var(--border-radius)',
              fontSize: '1rem'
            }}
          >
            <option value="public">Public</option>
            <option value="unlisted">Non répertorié</option>
            <option value="private">Privé</option>
          </select>
        </div>
        <Input
          label="Ordre d'affichage"
          name="order"
          type="number"
          value={formData.order}
          onChange={handleInputChange}
          placeholder="0"
        />
      </div>

      {/* Image thumbnail */}
      <div>
        <label style={{ 
          display: 'block', 
          marginBottom: 'var(--spacing-xs)', 
          fontSize: '0.875rem', 
          fontWeight: '500' 
        }}>
          Image de présentation
        </label>
        
        {thumbnailPreview && (
          <div style={{ 
            marginBottom: 'var(--spacing-md)',
            position: 'relative',
            display: 'inline-block'
          }}>
            <img
              src={thumbnailPreview}
              alt="Aperçu"
              style={{
                width: '200px',
                height: '120px',
                objectFit: 'cover',
                borderRadius: 'var(--border-radius)',
                border: '1px solid var(--gray-300)'
              }}
            />
            <button
              type="button"
              onClick={() => {
                setThumbnail(null);
                setThumbnailPreview('');
              }}
              style={{
                position: 'absolute',
                top: 'var(--spacing-xs)',
                right: 'var(--spacing-xs)',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={12} />
            </button>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
          style={{ display: 'none' }}
          id="thumbnail-upload"
        />
        <label
          htmlFor="thumbnail-upload"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            border: '1px solid var(--gray-300)',
            borderRadius: 'var(--border-radius)',
            cursor: 'pointer',
            backgroundColor: 'var(--gray-50)',
            fontSize: '0.875rem'
          }}
        >
          <Upload size={16} />
          {thumbnailPreview ? 'Changer l\'image' : 'Choisir une image'}
        </label>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end', marginTop: 'var(--spacing-lg)' }}>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" variant="primary" icon={Save} isLoading={isSubmitting}>
          {isSubmitting ? 'Sauvegarde...' : project ? 'Mettre à jour' : 'Créer le projet'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
