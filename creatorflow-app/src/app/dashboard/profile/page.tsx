'use client';

import React, { useState, useRef } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';

export default function ProfilePage() {
  const { user, isLoading, error, updating, updateError, updateUser } = useUserProfile();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setImage(user.image);
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    await updateUser({ name, bio, image });
    setSuccess(true);
  };

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error loading profile.</div>;

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block font-medium mb-1">Profile Picture</label>
          <div className="flex items-center gap-4 mb-2">
            {image ? (
              <img src={image} alt="Profile" className="h-16 w-16 rounded-full object-cover border" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
            )}
            <input
              type="file"
              accept="image/*"
              className="block"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Full Name</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 bg-gray-100"
            value={user.email || ''}
            disabled
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Bio</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            placeholder="Tell us about yourself..."
            rows={3}
            value={bio}
            onChange={e => setBio(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded"
          disabled={updating}
        >
          {updating ? 'Saving...' : 'Save'}
        </button>
        {updateError && <div className="text-red-500">{updateError}</div>}
        {success && !updateError && <div className="text-green-600">Profile updated!</div>}
      </form>
    </div>
  );
} 