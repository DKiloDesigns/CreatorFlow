'use client';

import React, { useState, useRef } from 'react';
import { Box, Typography, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { 
  FaInstagram, 
  FaTiktok, 
  FaYoutube, 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaPinterest, 
  FaSnapchat, 
  FaReddit, 
  FaDiscord, 
  FaTwitch, 
  FaGithub, 
  FaSlack, 
  FaMedium, 
  FaVimeo, 
  FaWhatsapp, 
  FaTelegram, 
  FaBehance, 
  FaDribbble, 
  FaProductHunt,
  FaMailchimp,
  FaSms,
  FaWeixin
} from 'react-icons/fa';
import { 
  SiThreads, 
  SiMastodon, 
  SiSubstack
} from 'react-icons/si';
import { 
  MdBusiness 
} from 'react-icons/md';

interface Platform {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
  isConnected: boolean;
  isConnecting?: boolean;
  requiresInstance?: boolean;
}

interface InstagramStoriesPlatformsProps {
  platforms: Platform[];
  onPlatformClick: (platformId: string) => void;
  onConnect?: (platformId: string) => void;
  onDisconnect?: (platformId: string) => void;
  searchTerm?: string;
}

export default function InstagramStoriesPlatforms({ 
  platforms, 
  onPlatformClick, 
  onConnect,
  onDisconnect,
  searchTerm = '' 
}: InstagramStoriesPlatformsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter platforms based on search term
  const filteredPlatforms = platforms.filter(platform =>
    platform.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlatformClick = (platformId: string, isConnected: boolean) => {
    if (isConnected && onDisconnect) {
      onDisconnect(platformId);
    } else if (!isConnected && onConnect) {
      onConnect(platformId);
    } else {
      onPlatformClick(platformId);
    }
  };

  return (
    <Box sx={{ 
      width: '100%',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Horizontal Scroll Container */}
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollBehavior: 'smooth',
          padding: '80px 16px',
          '&::-webkit-scrollbar': {
            height: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '2px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '2px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#a8a8a8',
          },
        }}
      >
        {filteredPlatforms.map((platform) => (
          <Box
            key={platform.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '90px',
              height: '90px',
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out',
              padding: '0',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
            onClick={() => handlePlatformClick(platform.id, platform.isConnected)}
          >
            {/* Platform Circle */}
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                border: '2px solid',
                borderColor: platform.isConnected ? platform.color : '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: platform.isConnected 
                  ? `${platform.color}15` 
                  : '#f5f5f5',
                position: 'relative',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: platform.color,
                  background: `${platform.color}20`,
                },
              }}
            >
              {platform.isConnecting ? (
                <CircularProgress size={24} sx={{ color: platform.color }} />
              ) : (
                <platform.icon 
                  size={24} 
                  color={platform.isConnected ? platform.color : '#666'} 
                />
              )}
              
              {/* Connection Status Indicator */}
              {platform.isConnected && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -1,
                    right: -1,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#4CAF50',
                    border: '2px solid white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: 'white',
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* Platform Name */}
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                textAlign: 'center',
                fontSize: '0.7rem',
                fontWeight: platform.isConnected ? 600 : 400,
                color: platform.isConnected ? platform.color : '#666',
                maxWidth: '80px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {platform.name}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Empty State */}
      {filteredPlatforms.length === 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
            color: 'text.secondary',
          }}
        >
          <Typography variant="body2">
            No platforms found for "{searchTerm}"
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// Helper function to create platform objects with real icons
export const createPlatformWithIcon = (
  id: string,
  name: string,
  color: string,
  isConnected: boolean = false,
  isConnecting: boolean = false,
  requiresInstance: boolean = false
): Platform => {
  const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
    instagram: FaInstagram,
    tiktok: FaTiktok,
    youtube: FaYoutube,
    facebook: FaFacebook,
    twitter: FaTwitter,
    linkedin: FaLinkedin,
    pinterest: FaPinterest,
    threads: SiThreads,
    whatsapp: FaWhatsapp,
    messenger: FaFacebook, // Messenger uses Facebook icon
    wechat: FaWeixin,
    telegram: FaTelegram,
    reddit: FaReddit,
    snapchat: FaSnapchat,
    gmb: MdBusiness,
    mastodon: SiMastodon,
    github: FaGithub,
    discord: FaDiscord,
    slack: FaSlack,
    medium: FaMedium,
    substack: SiSubstack,
    twitch: FaTwitch,
    vimeo: FaVimeo,
    producthunt: FaProductHunt,
    notion: FaMailchimp, // Using Mailchimp icon as substitute for Notion
    mailchimp: FaMailchimp,
    klaviyo: FaMailchimp, // Using Mailchimp icon as substitute for Klaviyo
    sms: FaSms,
    behance: FaBehance,
    dribbble: FaDribbble,
  };

  return {
    id,
    name,
    icon: iconMap[id] || FaInstagram, // Fallback to Instagram icon
    color,
    isConnected,
    isConnecting,
    requiresInstance,
  };
};
