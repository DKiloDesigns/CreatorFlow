'use client';

import React, { useState, useRef } from 'react';
import { 
  Button,
  Select,
  MenuItem
} from '@mui/material';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Play, 
  Pause, 
  Square, 
  Scissors, 
  Type, 
  Image as ImageIcon, 
  Video as VideoIcon,
  Download,
  Settings,
  Trash2,
  Plus,
  Move,
  RotateCw,
  Volume2,
  VolumeX
} from 'lucide-react';

interface VideoClip {
  id: string;
  type: 'video' | 'image';
  url: string;
  duration: number;
  startTime: number;
  endTime: number;
  volume: number;
  effects: {
    brightness: number;
    contrast: number;
    saturation: number;
  };
}

interface TextOverlay {
  id: string;
  text: string;
  position: { x: number; y: number };
  fontSize: number;
  color: string;
  fontFamily: string;
  startTime: number;
  endTime: number;
  animation: 'fade' | 'slide' | 'bounce' | 'none';
}

interface CreateVideoModalProps {
  open: boolean;
  onClose: () => void;
  onVideoCreated?: (videoData: any) => void;
}

export function CreateVideoModal({ open, onClose, onVideoCreated }: CreateVideoModalProps) {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [duration, setDuration] = useState(30);
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [selectedOverlay, setSelectedOverlay] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sample media items (in real app, this would come from media library)
  const sampleMedia = [
    { id: '1', name: 'Sample Video 1', url: '/api/media/sample1.mp4', type: 'video', duration: 10 },
    { id: '2', name: 'Sample Image 1', url: '/api/media/sample1.jpg', type: 'image', duration: 5 },
    { id: '3', name: 'Sample Video 2', url: '/api/media/sample2.mp4', type: 'video', duration: 15 },
  ];

  const handleAddClip = (mediaItem: any) => {
    const newClip: VideoClip = {
      id: `clip-${Date.now()}`,
      type: mediaItem.type,
      url: mediaItem.url,
      duration: mediaItem.duration || 5,
      startTime: 0,
      endTime: mediaItem.duration || 5,
      volume: 1,
      effects: {
        brightness: 0,
        contrast: 0,
        saturation: 0,
      }
    };
    
    setClips(prev => [...prev, newClip]);
    setShowMediaSelector(false);
    toast.success('Media added to timeline');
  };

  const handleAddTextOverlay = () => {
    const newOverlay: TextOverlay = {
      id: `overlay-${Date.now()}`,
      text: 'Add your text here',
      position: { x: 50, y: 50 },
      fontSize: 24,
      color: '#ffffff',
      fontFamily: 'Arial',
      startTime: 0,
      endTime: 5,
      animation: 'fade'
    };
    
    setTextOverlays(prev => [...prev, newOverlay]);
    setSelectedOverlay(newOverlay.id);
    toast.success('Text overlay added');
  };

  const handleUpdateClip = (clipId: string, updates: Partial<VideoClip>) => {
    setClips(prev => prev.map(clip => 
      clip.id === clipId ? { ...clip, ...updates } : clip
    ));
  };

  const handleUpdateOverlay = (overlayId: string, updates: Partial<TextOverlay>) => {
    setTextOverlays(prev => prev.map(overlay => 
      overlay.id === overlayId ? { ...overlay, ...updates } : overlay
    ));
  };

  const handleDeleteClip = (clipId: string) => {
    setClips(prev => prev.filter(clip => clip.id !== clipId));
    if (selectedClip === clipId) setSelectedClip(null);
    toast.success('Clip removed from timeline');
  };

  const handleDeleteOverlay = (overlayId: string) => {
    setTextOverlays(prev => prev.filter(overlay => overlay.id !== overlayId));
    if (selectedOverlay === overlayId) setSelectedOverlay(null);
    toast.success('Text overlay removed');
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleExport = async () => {
    if (clips.length === 0) {
      toast.error('Add at least one clip to export');
      return;
    }

    setIsExporting(true);
    try {
      // Simulate video export process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const videoData = {
        title: videoTitle,
        description: videoDescription,
        aspectRatio,
        duration,
        clips,
        textOverlays,
        exportedAt: new Date().toISOString()
      };
      
      onVideoCreated?.(videoData);
      toast.success('Video exported successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to export video');
    } finally {
      setIsExporting(false);
    }
  };

  const totalDuration = clips.reduce((total, clip) => total + clip.duration, 0);

  return (
            <Dialog open={open} onClose={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Create Video</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col lg:flex-row gap-6 h-[80vh]">
          {/* Preview Area */}
          <div className="flex-1 flex flex-col">
            <div className="bg-black rounded-lg aspect-video relative overflow-hidden mb-4">
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onEnded={() => setIsPlaying(false)}
              >
                {clips.length > 0 && (
                  <source src={clips[0].url} type="video/mp4" />
                )}
              </video>
              
              {/* Text Overlays Preview */}
              {textOverlays.map(overlay => (
                <div
                  key={overlay.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${overlay.position.x}%`,
                    top: `${overlay.position.y}%`,
                    fontSize: `${overlay.fontSize}px`,
                    color: overlay.color,
                    fontFamily: overlay.fontFamily,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {overlay.text}
                </div>
              ))}
            </div>
            
            {/* Video Controls */}
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="outlined"
                size="small"
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <div className="flex-1">
                {/* Slider component was removed, so this will be a placeholder */}
                <input
                  type="range"
                  min="0"
                  max={totalDuration}
                  value={currentTime}
                  onChange={(e) => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = parseFloat(e.target.value);
                      setCurrentTime(parseFloat(e.target.value));
                    }
                  }}
                  className="w-full"
                />
              </div>
              
              <span className="text-sm text-muted-foreground">
                {Math.floor(currentTime)}s / {Math.floor(totalDuration)}s
              </span>
            </div>
            
            {/* Video Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                {/* Label component was removed, so this will be a placeholder */}
                <label htmlFor="title" className="text-sm font-medium">Video Title</label>
                <input
                  id="title"
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Enter video title"
                  className="w-full p-2 border rounded-md text-sm"
                />
              </div>
              
              <div>
                {/* Label component was removed, so this will be a placeholder */}
                <label htmlFor="aspectRatio" className="text-sm font-medium">Aspect Ratio</label>
                <Select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full"
                >
                  <MenuItem value="16:9">16:9 (Landscape)</MenuItem>
                  <MenuItem value="9:16">9:16 (Portrait)</MenuItem>
                  <MenuItem value="1:1">1:1 (Square)</MenuItem>
                  <MenuItem value="4:3">4:3 (Classic)</MenuItem>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Timeline and Controls */}
          <div className="w-full lg:w-96 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b mb-4">
              <Button
                variant="text"
                size="small"
                className="flex-1"
                onClick={() => setShowMediaSelector(false)}
              >
                Timeline
              </Button>
              <Button
                variant="text"
                size="small"
                className="flex-1"
                onClick={() => setShowMediaSelector(true)}
              >
                Media
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {showMediaSelector ? (
                /* Media Selector */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Add Media</h3>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setShowMediaSelector(false)}
                    >
                      Back to Timeline
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {sampleMedia.map(media => (
                      <div
                        key={media.id}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleAddClip(media)}
                      >
                        {media.type === 'video' ? (
                          <VideoIcon className="h-8 w-8 text-blue-500" />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-green-500" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{media.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {media.type} • {media.duration}s
                          </p>
                        </div>
                        <Plus className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Timeline */
                <div className="space-y-4">
                  {/* Clips Timeline */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Timeline</h3>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleAddTextOverlay}
                      >
                        <Type className="h-4 w-4 mr-2" />
                        Add Text
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {clips.map((clip, index) => (
                        <div
                          key={clip.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedClip === clip.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedClip(clip.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {clip.type === 'video' ? (
                                <VideoIcon className="h-4 w-4 text-blue-500" />
                              ) : (
                                <ImageIcon className="h-4 w-4 text-green-500" />
                              )}
                              <span className="text-sm font-medium">Clip {index + 1}</span>
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">{clip.duration}s</span>
                            </div>
                            <Button
                              variant="text"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClip(clip.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          {selectedClip === clip.id && (
                            <div className="space-y-2 mt-2">
                              <div>
                                {/* Label component was removed, so this will be a placeholder */}
                                <label className="text-xs">Duration</label>
                                <input
                                  type="range"
                                  min="1"
                                  max="30"
                                  step="0.5"
                                  value={clip.duration}
                                  onChange={(e) => 
                                    handleUpdateClip(clip.id, { duration: parseFloat(e.target.value) })
                                  }
                                  className="w-full"
                                />
                              </div>
                              
                              <div>
                                {/* Label component was removed, so this will be a placeholder */}
                                <label className="text-xs">Volume</label>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={clip.volume * 100}
                                  onChange={(e) => 
                                    handleUpdateClip(clip.id, { volume: parseFloat(e.target.value) / 100 })
                                  }
                                  className="w-full"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t my-4" />
                  
                  {/* Text Overlays */}
                  <div>
                    <h3 className="font-medium mb-2">Text Overlays</h3>
                    <div className="space-y-2">
                      {textOverlays.map(overlay => (
                        <div
                          key={overlay.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedOverlay === overlay.id ? 'border-purple-500 bg-purple-50' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedOverlay(overlay.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Type className="h-4 w-4 text-purple-500" />
                              <span className="text-sm font-medium">Text Overlay</span>
                            </div>
                            <Button
                              variant="text"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteOverlay(overlay.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          {selectedOverlay === overlay.id && (
                            <div className="space-y-2 mt-2">
                              <div>
                                {/* Label component was removed, so this will be a placeholder */}
                                <label className="text-xs">Text</label>
                                <textarea
                                  value={overlay.text}
                                  onChange={(e) => handleUpdateOverlay(overlay.id, { text: e.target.value })}
                                  className="w-full p-2 border rounded-md text-xs"
                                  rows={2}
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  {/* Label component was removed, so this will be a placeholder */}
                                  <label className="text-xs">Font Size</label>
                                  <input
                                    type="range"
                                    min="12"
                                    max="72"
                                    value={overlay.fontSize}
                                    onChange={(e) => 
                                      handleUpdateOverlay(overlay.id, { fontSize: parseFloat(e.target.value) })
                                    }
                                    className="w-full"
                                  />
                                </div>
                                
                                <div>
                                  {/* Label component was removed, so this will be a placeholder */}
                                  <label className="text-xs">Color</label>
                                  <input
                                    type="color"
                                    value={overlay.color}
                                    onChange={(e) => handleUpdateOverlay(overlay.id, { color: e.target.value })}
                                    className="h-8 w-full"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                {/* Label component was removed, so this will be a placeholder */}
                                <label className="text-xs">Animation</label>
                                <Select
                                  value={overlay.animation}
                                  onChange={(e) => 
                                    handleUpdateOverlay(overlay.id, { animation: e.target.value as "none" | "fade" | "slide" | "bounce" })
                                  }
                                  className="w-full text-xs"
                                >
                                  <MenuItem value="none">None</MenuItem>
                                  <MenuItem value="fade">Fade</MenuItem>
                                  <MenuItem value="slide">Slide</MenuItem>
                                  <MenuItem value="bounce">Bounce</MenuItem>
                                </Select>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Export Button */}
            <div className="pt-4 border-t">
              <Button
                onClick={handleExport}
                disabled={isExporting || clips.length === 0}
                className="w-full"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export Video
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 