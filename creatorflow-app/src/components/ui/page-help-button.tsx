'use client';

import React, { useState } from 'react';
import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Chip,
  useTheme
} from '@mui/material';
import {
  HelpCircle,
  BookOpen,
  Play,
  Video,
  Lightbulb,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PageHelpButtonProps {
  pageId: string;
  pageName: string;
  availableTutorials?: string[];
  availableVideos?: string[];
  contextualTips?: string[];
  className?: string;
}

export function PageHelpButton({
  pageId,
  pageName,
  availableTutorials = [],
  availableVideos = [],
  contextualTips = [],
  className
}: PageHelpButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const theme = useTheme();
  
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTutorialClick = (tutorialId: string) => {
    router.push(`/tutorials?tutorial=${tutorialId}`);
    handleClose();
  };

  const handleVideoClick = (videoId: string) => {
    router.push(`/tutorials?video=${videoId}`);
    handleClose();
  };

  const handleHelpCenterClick = () => {
    router.push('/support');
    handleClose();
  };

  const handleTutorialsClick = () => {
    router.push('/tutorials');
    handleClose();
  };

  const handleTipClick = (tipId: string) => {
    // This would trigger the contextual tip
    console.log(`Show tip: ${tipId}`);
    handleClose();
  };

  return (
    <>
      <Tooltip title={`Get help with ${pageName}`}>
        <IconButton
          onClick={handleClick}
          className={className}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              color: 'primary.main',
              backgroundColor: 'primary.50'
            }
          }}
        >
          <HelpCircle size={20} />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            minWidth: 280,
            maxWidth: 400,
            mt: 1
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Help for {pageName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Get tutorials, tips, and guidance for this page
          </Typography>
        </Box>

        <Divider />

        {/* Quick Actions */}
        <MenuItem onClick={handleHelpCenterClick}>
          <ListItemIcon>
            <BookOpen size={18} />
          </ListItemIcon>
          <ListItemText 
            primary="Help Center" 
            secondary="Browse all help articles"
          />
          <ChevronRight size={16} color={theme.palette.text.secondary} />
        </MenuItem>

        <MenuItem onClick={handleTutorialsClick}>
          <ListItemIcon>
            <Play size={18} />
          </ListItemIcon>
          <ListItemText 
            primary="Tutorial Center" 
            secondary="Interactive tutorials & videos"
          />
          <ChevronRight size={16} color={theme.palette.text.secondary} />
        </MenuItem>

        {/* Available Tutorials */}
        {availableTutorials.length > 0 && (
          <Box>
            <Divider />
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                RECOMMENDED TUTORIALS
              </Typography>
            </Box>
            {availableTutorials.slice(0, 3).map((tutorialId) => (
              <MenuItem 
                key={tutorialId}
                onClick={() => handleTutorialClick(tutorialId)}
              >
                <ListItemIcon>
                  <Play size={18} />
                </ListItemIcon>
                <ListItemText 
                  primary={tutorialId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  secondary="Interactive tutorial"
                />
              </MenuItem>
            ))}
          </Box>
        )}

        {/* Available Videos */}
        {availableVideos.length > 0 && (
          <Box>
            <Divider />
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                VIDEO GUIDES
              </Typography>
            </Box>
            {availableVideos.slice(0, 2).map((videoId) => (
              <MenuItem 
                key={videoId}
                onClick={() => handleVideoClick(videoId)}
              >
                <ListItemIcon>
                  <Video size={18} />
                </ListItemIcon>
                <ListItemText 
                  primary={videoId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  secondary="Video tutorial"
                />
              </MenuItem>
            ))}
          </Box>
        )}

        {/* Contextual Tips */}
        {contextualTips.length > 0 && (
          <Box>
            <Divider />
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                QUICK TIPS
              </Typography>
            </Box>
            {contextualTips.slice(0, 2).map((tipId) => (
              <MenuItem 
                key={tipId}
                onClick={() => handleTipClick(tipId)}
              >
                <ListItemIcon>
                  <Lightbulb size={18} />
                </ListItemIcon>
                <ListItemText 
                  primary={tipId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  secondary="Pro tip"
                />
              </MenuItem>
            ))}
          </Box>
        )}

        <Divider />
        
        {/* Footer */}
        <Box sx={{ p: 2, pt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Need more help? Contact support
          </Typography>
        </Box>
      </Menu>
    </>
  );
}
