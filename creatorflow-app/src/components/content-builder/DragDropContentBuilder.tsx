'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
  Grid,
  Paper,
  Divider,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Plus,
  Trash2,
  Edit3,
  Move,
  Image,
  Video,
  Type,
  Link,
  Hash,
  Smile,
  Calendar,
  Target,
  Eye,
  Save,
  Download,
  Share2,
  Copy,
  Undo,
  Redo,
  Settings,
  Palette,
  Layout,
  Layers,
} from 'lucide-react';
import { DndProvider, useDrag, useDrop, DragObjectWithType } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useMinimalTheme } from '@/contexts/MinimalThemeContext';

interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'video' | 'hashtag' | 'link' | 'emoji' | 'cta';
  content: string;
  props?: Record<string, any>;
  position: number;
}

interface DragItem extends DragObjectWithType {
  id: string;
  type: string;
  index: number;
}

const BLOCK_TYPES = [
  { type: 'text', label: 'Text', icon: Type, color: '#3b82f6' },
  { type: 'image', label: 'Image', icon: Image, color: '#10b981' },
  { type: 'video', label: 'Video', icon: Video, color: '#f59e0b' },
  { type: 'hashtag', label: 'Hashtag', icon: Hash, color: '#8b5cf6' },
  { type: 'link', label: 'Link', icon: Link, color: '#ef4444' },
  { type: 'emoji', label: 'Emoji', icon: Smile, color: '#f97316' },
  { type: 'cta', label: 'Call to Action', icon: Target, color: '#06b6d4' },
];

const TEMPLATES = [
  {
    id: 'story',
    name: 'Story Template',
    description: 'Perfect for Instagram Stories',
    blocks: [
      { type: 'text', content: 'Check this out! 👀', position: 0 },
      { type: 'image', content: '', position: 1 },
      { type: 'cta', content: 'Swipe up to learn more!', position: 2 },
    ],
  },
  {
    id: 'post',
    name: 'Post Template',
    description: 'Standard social media post',
    blocks: [
      { type: 'text', content: 'Excited to share this with you! 🎉', position: 0 },
      { type: 'image', content: '', position: 1 },
      { type: 'hashtag', content: '#excited #sharing #content', position: 2 },
    ],
  },
  {
    id: 'promo',
    name: 'Promotional Template',
    description: 'For product launches and promotions',
    blocks: [
      { type: 'text', content: '🚀 BIG ANNOUNCEMENT! 🚀', position: 0 },
      { type: 'text', content: 'We\'re launching something amazing...', position: 1 },
      { type: 'cta', content: 'Get early access now!', position: 2 },
      { type: 'link', content: 'https://example.com/early-access', position: 3 },
    ],
  },
];

function DraggableBlock({ block, index, onEdit, onDelete, onMove }: {
  block: ContentBlock;
  index: number;
  onEdit: (block: ContentBlock) => void;
  onDelete: (id: string) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const blockType = BLOCK_TYPES.find(t => t.type === block.type);
  const Icon = blockType?.icon || Type;

  const [{ isDragging }, drag] = useDrag({
    type: 'block',
    item: { id: block.id, type: 'block', index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'block',
    hover: (item: DragItem, monitor) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <Card
      ref={ref}
      sx={{
        mb: 2,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              bgcolor: blockType?.color + '20',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={16} color={blockType?.color} />
          </Box>
          <Typography variant="subtitle2" sx={{ flexGrow: 1, textTransform: 'capitalize' }}>
            {blockType?.label}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => onEdit(block)}>
                <Edit3 size={14} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" onClick={() => onDelete(block.id)} color="error">
                <Trash2 size={14} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Box sx={{ minHeight: 40, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
          {block.type === 'text' && (
            <Typography variant="body2">{block.content || 'Click to add text...'}</Typography>
          )}
          {block.type === 'image' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <Image size={16} />
              <Typography variant="body2">{block.content || 'Click to add image...'}</Typography>
            </Box>
          )}
          {block.type === 'video' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <Video size={16} />
              <Typography variant="body2">{block.content || 'Click to add video...'}</Typography>
            </Box>
          )}
          {block.type === 'hashtag' && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {block.content ? (
                block.content.split(' ').map((tag, i) => (
                  <Chip key={i} label={tag} size="small" variant="outlined" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">Click to add hashtags...</Typography>
              )}
            </Box>
          )}
          {block.type === 'link' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
              <Link size={16} />
              <Typography variant="body2">{block.content || 'Click to add link...'}</Typography>
            </Box>
          )}
          {block.type === 'emoji' && (
            <Typography variant="h4">{block.content || '😊'}</Typography>
          )}
          {block.type === 'cta' && (
            <Button variant="contained" size="small" disabled>
              {block.content || 'Click to add CTA...'}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

function BlockPalette({ onAddBlock }: { onAddBlock: (type: string) => void }) {
  return (
    <Paper sx={{ p: 2, height: 'fit-content' }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Layers size={20} />
        Content Blocks
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {BLOCK_TYPES.map((blockType) => {
          const Icon = blockType.icon;
          return (
            <Button
              key={blockType.type}
              variant="outlined"
              startIcon={<Icon size={16} color={blockType.color} />}
              onClick={() => onAddBlock(blockType.type)}
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                borderColor: blockType.color + '40',
                color: blockType.color,
                '&:hover': {
                  borderColor: blockType.color,
                  bgcolor: blockType.color + '10',
                },
              }}
            >
              {blockType.label}
            </Button>
          );
        })}
      </Box>
    </Paper>
  );
}

function TemplateLibrary({ onLoadTemplate }: { onLoadTemplate: (template: any) => void }) {
  return (
    <Paper sx={{ p: 2, height: 'fit-content' }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Layout size={20} />
        Templates
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {TEMPLATES.map((template) => (
          <Card
            key={template.id}
            sx={{
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: 2,
              },
            }}
            onClick={() => onLoadTemplate(template)}
          >
            <CardContent sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {template.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {template.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Paper>
  );
}

export function DragDropContentBuilder() {
  const { isDark } = useMinimalTheme();
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Load saved content on mount
  React.useEffect(() => {
    const savedData = localStorage.getItem('creatorflow-content-builder');
    if (savedData) {
      try {
        const contentData = JSON.parse(savedData);
        setBlocks(contentData.blocks || []);
      } catch (error) {
        console.error('Failed to load saved content:', error);
      }
    }
  }, []);

  const addBlock = useCallback((type: string) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type: type as any,
      content: '',
      position: blocks.length,
    };
    setBlocks(prev => [...prev, newBlock]);
  }, [blocks.length]);

  const moveBlock = useCallback((dragIndex: number, hoverIndex: number) => {
    setBlocks(prev => {
      const newBlocks = [...prev];
      const draggedBlock = newBlocks[dragIndex];
      newBlocks.splice(dragIndex, 1);
      newBlocks.splice(hoverIndex, 0, draggedBlock);
      return newBlocks.map((block, index) => ({ ...block, position: index }));
    });
  }, []);

  const editBlock = useCallback((block: ContentBlock) => {
    setEditingBlock(block);
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setBlocks(prev => prev.filter(block => block.id !== id));
  }, []);

  const updateBlock = useCallback((updatedBlock: ContentBlock) => {
    setBlocks(prev => prev.map(block => 
      block.id === updatedBlock.id ? updatedBlock : block
    ));
    setEditingBlock(null);
  }, []);

  const loadTemplate = useCallback((template: any) => {
    const templateBlocks = template.blocks.map((block: any, index: number) => ({
      ...block,
      id: Date.now().toString() + index,
      position: index,
    }));
    setBlocks(templateBlocks);
  }, []);

  const clearAll = useCallback(() => {
    setBlocks([]);
  }, []);

  const exportContent = useCallback(() => {
    const content = blocks.map(block => {
      switch (block.type) {
        case 'text':
          return block.content;
        case 'hashtag':
          return block.content;
        case 'link':
          return block.content;
        case 'cta':
          return `[${block.content}]`;
        case 'emoji':
          return block.content;
        default:
          return `[${block.type}: ${block.content}]`;
      }
    }).join('\n\n');
    
    navigator.clipboard.writeText(content);
    // You could also trigger a toast notification here
  }, [blocks]);

  const saveContent = useCallback(() => {
    const contentData = {
      blocks,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    localStorage.setItem('creatorflow-content-builder', JSON.stringify(contentData));
    // You could trigger a success toast here
  }, [blocks]);

  // Auto-save when blocks change
  React.useEffect(() => {
    if (blocks.length > 0) {
      const timeoutId = setTimeout(() => {
        saveContent();
      }, 2000); // Auto-save after 2 seconds of inactivity
      return () => clearTimeout(timeoutId);
    }
  }, [blocks, saveContent]);

  const loadContent = useCallback(() => {
    const savedData = localStorage.getItem('creatorflow-content-builder');
    if (savedData) {
      try {
        const contentData = JSON.parse(savedData);
        setBlocks(contentData.blocks || []);
        // You could trigger a success toast here
      } catch (error) {
        console.error('Failed to load saved content:', error);
      }
    }
  }, []);

  const exportAsJSON = useCallback(() => {
    const contentData = {
      blocks,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    const dataStr = JSON.stringify(contentData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `content-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [blocks]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Content Builder
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Eye size={16} />}
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<Copy size={16} />}
                onClick={exportContent}
              >
                Export
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download size={16} />}
                onClick={loadContent}
              >
                Load
              </Button>
              <Button
                variant="outlined"
                startIcon={<Share2 size={16} />}
                onClick={exportAsJSON}
              >
                Export JSON
              </Button>
              <Button
                variant="contained"
                startIcon={<Save size={16} />}
                onClick={saveContent}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Sidebar */}
          <Box sx={{ width: 300, p: 2, borderRight: 1, borderColor: 'divider', overflow: 'auto' }}>
            <BlockPalette onAddBlock={addBlock} />
            <Box sx={{ mt: 2 }}>
              <TemplateLibrary onLoadTemplate={loadTemplate} />
            </Box>
          </Box>

          {/* Canvas */}
          <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto', bgcolor: 'background.default' }}>
            <Paper sx={{ p: 3, minHeight: '100%' }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Layout size={20} />
                Content Canvas
              </Typography>
              
              {blocks.length === 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 400,
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 4,
                  }}
                >
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    Start building your content
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Drag blocks from the sidebar or choose a template to get started
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Plus size={16} />}
                    onClick={() => addBlock('text')}
                  >
                    Add First Block
                  </Button>
                </Box>
              ) : (
                <Box>
                  {blocks
                    .sort((a, b) => a.position - b.position)
                    .map((block, index) => (
                      <DraggableBlock
                        key={block.id}
                        block={block}
                        index={index}
                        onEdit={editBlock}
                        onDelete={deleteBlock}
                        onMove={moveBlock}
                      />
                    ))}
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Edit Block Dialog */}
      <Dialog
        open={!!editingBlock}
        onClose={() => setEditingBlock(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Block</DialogTitle>
        <DialogContent>
          {editingBlock && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Content"
                value={editingBlock.content}
                onChange={(e) => setEditingBlock({
                  ...editingBlock,
                  content: e.target.value
                })}
                multiline
                rows={4}
                sx={{ mb: 2 }}
              />
              {editingBlock.type === 'cta' && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Button Style</InputLabel>
                  <Select
                    value={editingBlock.props?.style || 'contained'}
                    onChange={(e) => setEditingBlock({
                      ...editingBlock,
                      props: { ...editingBlock.props, style: e.target.value }
                    })}
                  >
                    <MenuItem value="contained">Contained</MenuItem>
                    <MenuItem value="outlined">Outlined</MenuItem>
                    <MenuItem value="text">Text</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingBlock(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => editingBlock && updateBlock(editingBlock)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </DndProvider>
  );
}
