'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Video, 
  File, 
  Trash2, 
  Eye,
  Download,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  uploadedUrl?: string;
  thumbnailUrl?: string;
  publicId?: string;
  tags: string[];
  description: string;
  error?: string;
}

interface UploadMediaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: (files: MediaFile[]) => void;
}

const ACCEPTED_TYPES = {
  'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
  'video/*': ['.mp4', '.mov', '.avi', '.webm', '.mkv'],
};

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_FILES = 10;

export function UploadMediaModal({ open, onOpenChange, onUploadComplete }: UploadMediaModalProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than ${formatFileSize(MAX_FILE_SIZE)}`;
    }
    
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      return 'Only image and video files are supported';
    }
    
    return null;
  };

  const createFilePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.onloadedmetadata = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 200;
          canvas.height = 150;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(video, 0, 0, 200, 150);
          resolve(canvas.toDataURL());
        };
        video.src = URL.createObjectURL(file);
      }
    });
  };

  const addFiles = useCallback(async (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    
    if (files.length + fileArray.length > MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} files allowed`);
      return;
    }

    const newMediaFiles: MediaFile[] = [];

    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        toast.error(`${file.name}: ${error}`);
        continue;
      }

      const preview = await createFilePreview(file);
      const mediaFile: MediaFile = {
        id: generateId(),
        file,
        preview,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: 'uploading',
        tags: [],
        description: '',
      };

      newMediaFiles.push(mediaFile);
    }

    setFiles(prev => [...prev, ...newMediaFiles]);
  }, [files]);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (selectedFile?.id === id) {
      setSelectedFile(null);
    }
  };

  const updateFileMetadata = (id: string, updates: Partial<MediaFile>) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    if (selectedFile?.id === id) {
      setSelectedFile(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      addFiles(e.dataTransfer.files);
    }
  }, [addFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      addFiles(e.target.files);
    }
  };

  const uploadFile = async (file: MediaFile): Promise<any> => {
    const formData = new FormData();
    formData.append('files', file.file);
    
    const metadata = {
      tags: file.tags,
      description: file.description
    };
    formData.append('metadata', JSON.stringify(metadata));

    const response = await fetch('/api/media/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    const result = await response.json();
    return result.files[0]; // Return the uploaded file data
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const uploadPromises = files.map(async (file) => {
      try {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          const currentFile = files.find(f => f.id === file.id);
          if (currentFile) {
            updateFileMetadata(file.id, { 
              progress: Math.min(currentFile.progress + Math.random() * 20, 90)
            });
          }
        }, 200);

        const result = await uploadFile(file);
        
        clearInterval(progressInterval);
        
        updateFileMetadata(file.id, { 
          status: 'success', 
          progress: 100, 
          uploadedUrl: result.url,
          thumbnailUrl: result.thumbnailUrl,
          publicId: result.publicId
        });
        
        return { ...file, ...result };
      } catch (error) {
        updateFileMetadata(file.id, { 
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed'
        });
        toast.error(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter(Boolean) as MediaFile[];
    
    setUploading(false);
    
    if (successfulUploads.length > 0) {
      toast.success(`Successfully uploaded ${successfulUploads.length} files`);
      onUploadComplete(successfulUploads);
      handleClose();
    }
  };

  const handleClose = () => {
    setFiles([]);
    setSelectedFile(null);
    setUploading(false);
    onOpenChange(false);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Media
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 h-[600px]">
          {/* File List */}
          <div className="w-2/3 flex flex-col">
            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 mb-4 transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">
                  Drop files here or click to browse
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports images and videos up to 100MB
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  Choose Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={Object.keys(ACCEPTED_TYPES).join(',')}
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* File Grid */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={`relative group border rounded-lg overflow-hidden cursor-pointer transition-all ${
                      selectedFile?.id === file.id 
                        ? 'ring-2 ring-primary' 
                        : 'hover:ring-2 hover:ring-gray-300'
                    }`}
                    onClick={() => setSelectedFile(file)}
                  >
                    {/* Preview */}
                    <div className="aspect-square bg-gray-100 relative">
                      {file.type.startsWith('image/') ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Status Overlay */}
                      {file.status === 'uploading' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                            <p className="text-sm">{file.progress}%</p>
                          </div>
                        </div>
                      )}
                      
                      {file.status === 'success' && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <Check className="h-3 w-3 mr-1" />
                            Uploaded
                          </Badge>
                        </div>
                      )}
                      
                      {file.status === 'error' && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Error
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="p-3">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      {file.error && (
                        <p className="text-xs text-red-500 mt-1">{file.error}</p>
                      )}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
                      className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* File Details */}
          <div className="w-1/3 border-l pl-4">
            {selectedFile ? (
              <div className="space-y-4">
                <div>
                  <Label>File Name</Label>
                  <Input
                    value={selectedFile.name}
                    onChange={(e) => updateFileMetadata(selectedFile.id, { name: e.target.value })}
                    disabled={uploading}
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={selectedFile.description}
                    onChange={(e) => updateFileMetadata(selectedFile.id, { description: e.target.value })}
                    placeholder="Add a description..."
                    disabled={uploading}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Tags</Label>
                  <Input
                    value={selectedFile.tags.join(', ')}
                    onChange={(e) => updateFileMetadata(selectedFile.id, { 
                      tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                    })}
                    placeholder="tag1, tag2, tag3"
                    disabled={uploading}
                  />
                </div>

                <div className="space-y-2">
                  <Label>File Info</Label>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Type:</span> {selectedFile.type}</p>
                    <p><span className="font-medium">Size:</span> {formatFileSize(selectedFile.size)}</p>
                    {selectedFile.uploadedUrl && (
                      <p><span className="font-medium">Status:</span> Uploaded</p>
                    )}
                  </div>
                </div>

                {selectedFile.uploadedUrl && (
                  <div className="space-y-2">
                    <Label>Upload URL</Label>
                    <div className="flex gap-2">
                      <Input value={selectedFile.uploadedUrl} readOnly />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyUrl(selectedFile.uploadedUrl!)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {selectedFile.status === 'uploading' && (
                  <div className="space-y-2">
                    <Label>Upload Progress</Label>
                    <Progress value={selectedFile.progress} />
                    <p className="text-sm text-gray-500">{selectedFile.progress}% complete</p>
                  </div>
                )}

                {selectedFile.error && (
                  <div className="space-y-2">
                    <Label className="text-red-600">Error</Label>
                    <p className="text-sm text-red-500 bg-red-50 p-2 rounded">
                      {selectedFile.error}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-8">
                <File className="h-12 w-12 mx-auto mb-4" />
                <p>Select a file to view details</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          <Button 
            onClick={uploadFiles} 
            disabled={uploading || files.length === 0}
            className="min-w-[120px]"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 