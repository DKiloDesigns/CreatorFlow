'use client'; // Need this for useState

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
// Placeholders for date/time picker components
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon, Loader2, UploadCloud, X, Image as ImageIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useDropzone, FileWithPath } from 'react-dropzone';
import Image from 'next/image';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import TemplateManager from './template-manager';
import { PostStatus } from '@prisma/client';

// Generate time options (e.g., 00:00, 00:30, ..., 23:30)
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) { // 30-min intervals
      const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      options.push({ value: time, label: time });
    }
  }
  return options;
};
const TIME_OPTIONS = generateTimeOptions();

// Define the full list of supported platforms
const ALL_PLATFORMS = [
  { id: 'facebook', name: 'Facebook', icon: '📘', color: '#1877F3' },
  { id: 'instagram', name: 'Instagram', icon: '📸', color: '#E1306C' },
  { id: 'twitter', name: 'X', icon: '🐦', color: '#000000' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0077B5' },
  { id: 'youtube', name: 'YouTube', icon: '▶️', color: '#FF0000' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#010101' },
  { id: 'pinterest', name: 'Pinterest', icon: '📌', color: '#E60023' },
  { id: 'threads', name: 'Threads', icon: '🧵', color: '#000000' },
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬', color: '#25D366' },
  { id: 'messenger', name: 'Messenger', icon: '💭', color: '#0084FF' },
  { id: 'wechat', name: 'WeChat', icon: '🟩', color: '#09B83E' },
  { id: 'telegram', name: 'Telegram', icon: '✈️', color: '#229ED9' },
  { id: 'reddit', name: 'Reddit', icon: '👽', color: '#FF4500' },
  { id: 'snapchat', name: 'Snapchat', icon: '👻', color: '#FFFC00' },
  { id: 'gmb', name: 'Google My Business', icon: '🏢', color: '#4285F4' },
];

export default function PostComposer({ platforms: propPlatforms }: { platforms?: { id: string, name: string }[] }) {
  const [connectedPlatforms, setConnectedPlatforms] = useState<{ id: string, platform: string, username: string, status: string }[]>([]);
  useEffect(() => {
    if (!propPlatforms) {
      fetch('/api/accounts', { credentials: 'include' })
        .then(res => res.ok ? res.json() : [])
        .then(data => setConnectedPlatforms(data))
        .catch(() => setConnectedPlatforms([]));
    }
  }, [propPlatforms]);
  // Use connected platforms if available, otherwise show all
  const platforms = propPlatforms
    ? ALL_PLATFORMS.filter(p => propPlatforms.some(pp => pp.id === p.id))
    : (connectedPlatforms.length > 0
        ? ALL_PLATFORMS.filter(p => connectedPlatforms.some(acc => acc.platform === p.id))
        : ALL_PLATFORMS
      );
  const [contentText, setContentText] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined); // Format HH:MM
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false); // Added loading state
  const [uploadedMediaUrls, setUploadedMediaUrls] = useState<string[]>([]); // Store Cloudinary URLs
  const [filesToUpload, setFilesToUpload] = useState<FileWithPath[]>([]); // Files selected via dropzone
  const [ariaMessage, setAriaMessage] = useState('');

  // Combine date and time when either changes
  useEffect(() => {
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const combinedDateTime = new Date(selectedDate);
      combinedDateTime.setHours(hours, minutes, 0, 0); // Set hours and minutes
      setScheduledAt(combinedDateTime);
    } else {
      setScheduledAt(undefined); // Reset if date or time is missing
    }
  }, [selectedDate, selectedTime]);

  const handlePlatformChange = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const resetForm = () => {
    setContentText('');
    setSelectedPlatforms([]);
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setScheduledAt(undefined);
    setFilesToUpload([]); // Clear selected files
    setUploadedMediaUrls([]); // Clear uploaded URLs
  };

  // --- Dropzone Logic Start ---
  // Step 5: Actual Upload Function
  const handleUploadFiles = async (files: File[]) => {
    if (!files || files.length === 0) return;
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
        toast.error("Cloudinary configuration is missing. Cannot upload files.");
        console.error("Error: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set.");
        return;
    }
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

    // Upload files one by one
    for (const file of files) {
        const toastId = toast.loading(`Uploading ${file.name}...`);
        try {
            // 1. Get signature from our backend
            const timestamp = Math.round((new Date).getTime()/1000); // Current timestamp in seconds
            const paramsToSign = {
                timestamp: timestamp,
                // Add other parameters if needed for signing (e.g., folder, tags)
                // folder: 'creatorflow-posts' // Example: Upload to a specific folder
            };

            const signResponse = await fetch('/api/upload/sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paramsToSign }),
            });

            if (!signResponse.ok) {
                const errorData = await signResponse.json().catch(() => ({}));
                throw new Error(errorData.error || `Failed to get upload signature (HTTP ${signResponse.status})`);
            }
            const signData = await signResponse.json();
            const { signature, apiKey } = signData;

            if (!signature || !apiKey) {
                throw new Error('Invalid signature data received from server.');
            }

            // 2. Prepare FormData for Cloudinary upload
            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', apiKey);
            formData.append('timestamp', timestamp.toString());
            formData.append('signature', signature);
            // Add the same extra parameters here if they were included in signing
            // if (paramsToSign.folder) {
            //     formData.append('folder', paramsToSign.folder);
            // }

            // 3. Upload directly to Cloudinary
            const uploadResponse = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json().catch(() => ({}));
                 throw new Error(errorData?.error?.message || `Cloudinary upload failed (HTTP ${uploadResponse.status})`);
            }

            const uploadedData = await uploadResponse.json();
            const secureUrl = uploadedData.secure_url;

            if (!secureUrl) {
                 throw new Error('Cloudinary response did not include a secure URL.');
            }

            // 4. Update state and show success
            setUploadedMediaUrls((prev) => [...prev, secureUrl]);
            toast.success(`${file.name} uploaded successfully!`, { id: toastId });
            setAriaMessage(`${file.name} uploaded successfully!`);
            // Remove the successfully uploaded file from the preview list
            removeFileToUpload(file as FileWithPath); 

        } catch (error) {
            console.error(`Error uploading ${file.name}:`, error);
            toast.error(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: toastId });
            setAriaMessage(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            // Optionally remove the file from preview on error too, or leave it for retry?
            // removeFileToUpload(file);
        }
    }
  };

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    handleUploadFiles(acceptedFiles);
  }, [handleUploadFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: { // Example: Accept images and videos
      'image/*': ['.jpeg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov']
    },
    maxFiles: 5, // Example limit
    // Add maxSize limit if needed
  });

  const removeFileToUpload = (file: FileWithPath) => {
    setFilesToUpload(prev => prev.filter(f => f !== file));
  };
  // --- Dropzone Logic End ---

  // Clean up Object URLs on unmount or when files change
  useEffect(() => {
    return () => filesToUpload.forEach(file => URL.revokeObjectURL(URL.createObjectURL(file)));
  }, [filesToUpload]);

  const handleSaveDraft = async () => {
    if (!contentText && !selectedPlatforms.length && uploadedMediaUrls.length === 0) {
      toast.error("Cannot save empty draft.");
      return;
    }
    setIsSubmitting(true);
    const payload = {
      contentText,
      platforms: selectedPlatforms,
      status: PostStatus.DRAFT,
      mediaUrls: uploadedMediaUrls, // Include uploaded URLs
    };

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Try to parse error
        throw new Error(errorData.error || `Failed to save draft (HTTP ${response.status})`);
      }

      const newPost = await response.json();
      toast.success("Draft saved successfully!");
      console.log('Draft saved:', newPost);
      setAriaMessage("Draft saved successfully!");
      resetForm(); // Clear form on success

    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error(`Error saving draft: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setAriaMessage(`Error saving draft: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSchedule = async () => {
    if (!scheduledAt || selectedPlatforms.length === 0 || (!contentText && uploadedMediaUrls.length === 0)) return;

    setIsSubmitting(true);
    const payload = {
      contentText,
      platforms: selectedPlatforms,
      scheduledAt: scheduledAt.toISOString(),
      status: PostStatus.SCHEDULED,
      mediaUrls: uploadedMediaUrls, // Include uploaded URLs
    };

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Try to parse error
        throw new Error(errorData.error || `Failed to schedule post (HTTP ${response.status})`);
      }

      const newPost = await response.json();
      toast.success("Post scheduled successfully!");
      console.log('Post scheduled:', newPost);
      setAriaMessage("Post scheduled successfully!");
      resetForm(); // Clear form on success

    } catch (error) {
      console.error('Error scheduling post:', error);
      toast.error(`Error scheduling post: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setAriaMessage(`Error scheduling post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add handler to insert template text
  const handleInsertTemplate = (text: string) => {
    setContentText((prev) => prev ? prev + '\n' + text : text);
    // Optionally focus the textarea after insert
    setTimeout(() => {
      const textarea = document.getElementById('content-text');
      if (textarea) (textarea as HTMLTextAreaElement).focus();
    }, 100);
  };

  return (
    <TooltipProvider>
      <TemplateManager onInsert={handleInsertTemplate} />
      <Card>
        <CardHeader>
          <CardTitle>Create Post</CardTitle>
          <CardDescription>Draft your content and schedule it for your connected platforms.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <h2 className="sr-only" id="post-composer-heading">Compose a new post</h2>
          {/* Platform Selector */}
          <div className="space-y-2">
            <Label>Platforms</Label>
            <div className="flex flex-row flex-wrap gap-2 sm:gap-4" aria-label="Platform selector">
              {platforms.map((platform) => (
                <Tooltip key={platform.id}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2 px-2 py-1 rounded-lg" style={{ background: platform.color + '22' }}>
                      <Checkbox
                        id={`platform-${platform.id}`}
                        checked={selectedPlatforms.includes(platform.id)}
                        onCheckedChange={() => handlePlatformChange(platform.id)}
                        disabled={isSubmitting}
                        aria-label={`Select ${platform.name}`}
                        className="focus-visible:ring-2 focus-visible:ring-primary transition-shadow"
                      />
                      <span className="text-xl" aria-label={platform.name}>{platform.icon}</span>
                      <Label htmlFor={`platform-${platform.id}`} className={cn("font-normal cursor-pointer transition-colors", isSubmitting && "text-muted-foreground")}>{platform.name}</Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Select to post on {platform.name}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Content Text Area */}
          <div className="space-y-2">
            <Label htmlFor="content-text">Content</Label>
            <Textarea
              id="content-text"
              placeholder="What's on your mind? Write your caption here..."
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              rows={6}
              disabled={isSubmitting}
              aria-required="true"
              aria-label="Post content"
              className="focus-visible:ring-2 focus-visible:ring-primary transition-shadow"
            />
          </div>

          {/* Media Upload Dropzone */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                {...getRootProps()}
                className={cn(
                  "flex flex-col items-center justify-center p-6 rounded-md border-2 border-dashed cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none",
                  isDragActive ? "border-primary bg-primary bg-opacity-10" : "border-border hover:border-primary hover:border-opacity-50",
                  isSubmitting ? "cursor-not-allowed opacity-50 bg-muted bg-opacity-50" : ""
                )}
                tabIndex={0}
                aria-label="Upload media files"
              >
                <input {...getInputProps()} disabled={isSubmitting} aria-label="Select media files to upload" />
                <UploadCloud className={cn("h-8 w-8 mb-2 transition-colors", isDragActive ? "text-primary" : "text-muted-foreground")} />
                {isDragActive ? (
                  <p className="text-primary">Drop the files here ...</p>
                ) : (
                  <p className="text-muted-foreground text-sm text-center">Drag 'n' drop some files here, or click to select files</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">(Max 5 files, images or videos)</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>Upload images or videos (max 5)</TooltipContent>
          </Tooltip>

          {/* File Previews & Upload Status */}
          {filesToUpload.length > 0 && (
            <div className="mt-2 space-y-2">
              <p className="text-sm font-medium">Files to upload:</p>
              {filesToUpload.map((file, index) => {
                const objectUrl = URL.createObjectURL(file); // Create URL here
                return (
                  <div key={`${file.name}-${index}`} className="flex items-center justify-between p-2 border rounded-md bg-muted bg-opacity-50">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      {file.type.startsWith('image/') ? (
                        <Image 
                          src={objectUrl} // Use the created URL
                          alt={`Preview ${file.name}`} 
                          width={32} 
                          height={32} 
                          className="h-8 w-8 object-cover rounded-sm"
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="text-sm truncate">{file.name}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => removeFileToUpload(file)} 
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Schedule Picker */}
          <div className="space-y-2">
            <Label>Schedule (Optional)</Label>
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={"outline"}
                    disabled={isSubmitting}
                    className={cn(
                      "w-[200px] justify-start text-left font-normal transition-shadow focus-visible:ring-2 focus-visible:ring-primary",
                      !selectedDate && "text-muted-foreground",
                      isSubmitting && "disabled:opacity-50"
                    )}
                    aria-label="Pick a date"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Select a date to schedule your post</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Select value={selectedTime} onValueChange={setSelectedTime} disabled={isSubmitting}>
                    <SelectTrigger className={cn("w-[120px] transition-shadow focus-visible:ring-2 focus-visible:ring-primary", isSubmitting && "disabled:opacity-50")}> 
                      <SelectValue placeholder="Pick time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TooltipTrigger>
                <TooltipContent>Select a time to schedule your post</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* ARIA live region for toasts */}
          <div aria-live="polite" className="sr-only" id="post-composer-aria-live">{ariaMessage}</div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={handleSaveDraft} 
                disabled={isSubmitting || (!contentText && uploadedMediaUrls.length === 0)}
                className="transition-colors focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Save as draft"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
                Save Draft
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save this post as a draft</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button 
                  onClick={handleSchedule} 
                  disabled={isSubmitting || !scheduledAt || selectedPlatforms.length === 0 || (!contentText && uploadedMediaUrls.length === 0)}
                  className="transition-colors focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Schedule post"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
                  Schedule Post
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>{!scheduledAt ? 'Pick a date and time to enable scheduling' : 'Schedule this post for later'}</TooltipContent>
          </Tooltip>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
} 