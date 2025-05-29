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
// import { PostStatus } from '@prisma/client';

// Assuming local enum exists if prisma client isn't fully available everywhere yet
// import { PostStatus } from '@/generated/prisma';
enum PostStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  PUBLISHING = "PUBLISHING",
  PUBLISHED = "PUBLISHED",
  FAILED = "FAILED",
}

// Mock connected platforms (replace with actual data later)
const MOCK_PLATFORMS = [
  { id: 'instagram', name: 'Instagram' },
  { id: 'tiktok', name: 'TikTok' },
  { id: 'twitter', name: 'X / Twitter' },
  { id: 'youtube', name: 'YouTube' },
];

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

export default function PostComposer() {
  const [contentText, setContentText] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined); // Format HH:MM
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false); // Added loading state
  const [uploadedMediaUrls, setUploadedMediaUrls] = useState<string[]>([]); // Store Cloudinary URLs
  const [filesToUpload, setFilesToUpload] = useState<FileWithPath[]>([]); // Files selected via dropzone
  // TODO: Add upload progress state if desired

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
            // Remove the successfully uploaded file from the preview list
            removeFileToUpload(file as FileWithPath); 

        } catch (error) {
            console.error(`Error uploading ${file.name}:`, error);
            toast.error(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: toastId });
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
      resetForm(); // Clear form on success

    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error(`Error saving draft: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      resetForm(); // Clear form on success

    } catch (error) {
      console.error('Error scheduling post:', error);
      toast.error(`Error scheduling post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Post</CardTitle>
        <CardDescription>Draft your content and schedule it for your connected platforms.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Platform Selector */}
        <div className="space-y-2">
          <Label>Platforms</Label>
          <div className="flex flex-wrap gap-4">
            {MOCK_PLATFORMS.map((platform) => (
              <div key={platform.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`platform-${platform.id}`}
                  checked={selectedPlatforms.includes(platform.id)}
                  onCheckedChange={() => handlePlatformChange(platform.id)}
                  disabled={isSubmitting} // Disable during submit
                />
                <Label htmlFor={`platform-${platform.id}`} className={cn("font-normal", isSubmitting && "text-muted-foreground")}>
                  {platform.name}
                </Label>
              </div>
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
            disabled={isSubmitting} // Disable during submit
          />
        </div>

        {/* Media Upload Dropzone */}
        <div className="space-y-2">
          <Label>Media</Label>
          <div
            {...getRootProps()}
            className={cn(
              "flex flex-col items-center justify-center p-6 rounded-md border-2 border-dashed",
              "cursor-pointer transition-colors",
              isDragActive ? "border-primary bg-primary bg-opacity-10" : "border-border hover:border-primary hover:border-opacity-50",
              isSubmitting ? "cursor-not-allowed opacity-50 bg-muted bg-opacity-50" : ""
            )}
          >
            <input {...getInputProps()} disabled={isSubmitting} />
            <UploadCloud className={cn("h-8 w-8 mb-2", isDragActive ? "text-primary" : "text-muted-foreground")} />
            {isDragActive ? (
              <p className="text-primary">Drop the files here ...</p>
            ) : (
              <p className="text-muted-foreground text-sm text-center">Drag 'n' drop some files here, or click to select files</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">(Max 5 files, images or videos)</p>
          </div>

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
        </div>

        {/* Scheduling Options */}
        <div className="space-y-2">
          <Label>Schedule (Optional)</Label>
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  disabled={isSubmitting} // Disable during submit
                  className={cn(
                    "w-[200px] justify-start text-left font-normal", // Adjusted width
                    !selectedDate && "text-muted-foreground",
                    isSubmitting && "disabled:opacity-50"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate} // Use setSelectedDate
                  initialFocus
                  disabled={isSubmitting} // Disable during submit
                />
              </PopoverContent>
            </Popover>
            <Select value={selectedTime} onValueChange={setSelectedTime} disabled={isSubmitting}>
              <SelectTrigger className={cn("w-[120px]", isSubmitting && "disabled:opacity-50")}> // Adjusted width
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
          </div>
        </div>

      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleSaveDraft} disabled={isSubmitting || (!contentText && uploadedMediaUrls.length === 0)}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
          Save Draft
        </Button>
        <Button onClick={handleSchedule} disabled={isSubmitting || !scheduledAt || selectedPlatforms.length === 0 || (!contentText && uploadedMediaUrls.length === 0)}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
          Schedule Post
        </Button>
      </CardFooter>
    </Card>
  );
} 