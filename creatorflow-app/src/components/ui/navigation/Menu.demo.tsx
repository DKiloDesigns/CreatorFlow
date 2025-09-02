'use client';

import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuCheckboxItem,
  MenuRadioItem,
  MenuSeparator,
  MenuLabel,
  MenuGroup,
  MenuSub,
  MenuSubTrigger,
  MenuSubContent,
} from './Menu';
import { Settings, User, LogOut, HelpCircle, Bell, Download, Upload, Trash2, Edit, Copy, MoreHorizontal } from 'lucide-react';

export function MenuDemo() {
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');

  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>Menu Component Demo</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>Comprehensive showcase of all Menu component features</Typography>
      </Box>

      <Grid container spacing={4}>
        
        {/* Basic Menu */}
        <Grid item xs={12} md={6} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>Basic Menu</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Menu>
              <MenuTrigger>Actions</MenuTrigger>
              <MenuContent>
                <MenuItem onClick={() => console.log('Edit clicked')}>
                  <Edit style={{ marginRight: 8, height: 16, width: 16 }} />
                  Edit
                </MenuItem>
                <MenuItem onClick={() => console.log('Copy clicked')}>
                  <Copy style={{ marginRight: 8, height: 16, width: 16 }} />
                  Copy
                </MenuItem>
                <MenuItem onClick={() => console.log('Delete clicked')}>
                  <Trash2 style={{ marginRight: 8, height: 16, width: 16 }} />
                  Delete
                </MenuItem>
              </MenuContent>
            </Menu>
          </Box>
        </Box>

        {/* Menu with Icons */}
        <Grid item xs={12} md={6} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>Menu with Icons</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Menu>
              <MenuTrigger>User Menu</MenuTrigger>
              <MenuContent>
                <MenuItem onClick={() => console.log('Profile clicked')}>
                  <User style={{ marginRight: 8, height: 16, width: 16 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={() => console.log('Settings clicked')}>
                  <Settings style={{ marginRight: 8, height: 16, width: 16 }} />
                  Settings
                </MenuItem>
                <MenuItem onClick={() => console.log('Help clicked')}>
                  <HelpCircle style={{ marginRight: 8, height: 16, width: 16 }} />
                  Help & Support
                </MenuItem>
                <MenuSeparator />
                <MenuItem onClick={() => console.log('Sign out clicked')}>
                  <LogOut style={{ marginRight: 8, height: 16, width: 16 }} />
                  Sign Out
                </MenuItem>
              </MenuContent>
            </Menu>
          </div>
        </div>

        {/* Menu with Checkbox Items */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Checkbox Menu</h3>
          <div className="flex justify-center">
            <Menu>
              <MenuTrigger>Notifications</MenuTrigger>
              <MenuContent>
                <MenuLabel>Notification Settings</MenuLabel>
                <MenuCheckboxItem
                  checked={notifications}
                  onCheckedChange={setNotifications}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Push Notifications
                </MenuCheckboxItem>
                <MenuCheckboxItem
                  checked={true}
                  onCheckedChange={() => {}}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Email Notifications
                </MenuCheckboxItem>
                <MenuCheckboxItem
                  checked={false}
                  onCheckedChange={() => {}}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  SMS Notifications
                </MenuCheckboxItem>
              </MenuContent>
            </Menu>
          </div>
        </div>

        {/* Menu with Radio Items */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Radio Menu</h3>
          <div className="flex justify-center">
            <Menu>
              <MenuTrigger>Theme: {theme}</MenuTrigger>
              <MenuContent>
                <MenuLabel>Choose Theme</MenuLabel>
                <MenuRadioItem
                  value="light"
                  checked={theme === 'light'}
                  onSelect={setTheme}
                >
                  Light
                </MenuRadioItem>
                <MenuRadioItem
                  value="dark"
                  checked={theme === 'dark'}
                  onSelect={setTheme}
                >
                  Dark
                </MenuRadioItem>
                <MenuRadioItem
                  value="auto"
                  checked={theme === 'auto'}
                  onSelect={setTheme}
                >
                  Auto
                </MenuRadioItem>
              </MenuContent>
            </Menu>
          </div>
        </div>

        {/* Menu with Groups */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Grouped Menu</h3>
          <div className="flex justify-center">
            <Menu>
              <MenuTrigger>File Operations</MenuTrigger>
              <MenuContent>
                <MenuGroup>
                  <MenuLabel>Create</MenuLabel>
                  <MenuItem onClick={() => console.log('New file')}>
                    <Upload className="mr-2 h-4 w-4" />
                    New File
                  </MenuItem>
                  <MenuItem onClick={() => console.log('New folder')}>
                    <Upload className="mr-2 h-4 w-4" />
                    New Folder
                  </MenuItem>
                </MenuGroup>
                <MenuSeparator />
                <MenuGroup>
                  <MenuLabel>Import/Export</MenuLabel>
                  <MenuItem onClick={() => console.log('Import')}>
                    <Download className="mr-2 h-4 w-4" />
                    Import
                  </MenuItem>
                  <MenuItem onClick={() => console.log('Export')}>
                    <Upload className="mr-2 h-4 w-4" />
                    Export
                  </MenuItem>
                </MenuGroup>
              </MenuContent>
            </Menu>
          </div>
        </div>

        {/* Menu with Sub-Menus */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Sub-Menu</h3>
          <div className="flex justify-center">
            <Menu>
              <MenuTrigger>More Options</MenuTrigger>
              <MenuContent>
                <MenuItem onClick={() => console.log('Share')}>
                  Share
                </MenuItem>
                <MenuSub>
                  <MenuSubTrigger>Export</MenuSubTrigger>
                  <MenuSubContent>
                    <MenuItem onClick={() => console.log('Export as PDF')}>
                      Export as PDF
                    </MenuItem>
                    <MenuItem onClick={() => console.log('Export as Word')}>
                      Export as Word
                    </MenuItem>
                    <MenuItem onClick={() => console.log('Export as HTML')}>
                      Export as HTML
                    </MenuItem>
                  </MenuSubContent>
                </MenuSub>
                <MenuSeparator />
                <MenuItem onClick={() => console.log('Delete')}>
                  Delete
                </MenuItem>
              </MenuContent>
            </Menu>
          </div>
        </div>

        {/* Menu with Custom Trigger */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Custom Trigger</h3>
          <div className="flex justify-center">
            <Menu>
              <MenuTrigger asChild>
                <button className="inline-flex items-center justify-center rounded-full w-10 h-10 bg-gray-100 hover:bg-gray-200 transition-colors">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </MenuTrigger>
              <MenuContent>
                <MenuItem onClick={() => console.log('View')}>View</MenuItem>
                <MenuItem onClick={() => console.log('Edit')}>Edit</MenuItem>
                <MenuItem onClick={() => console.log('Delete')}>Delete</MenuItem>
              </MenuContent>
            </Menu>
          </div>
        </div>

        {/* Menu with Inset Items */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Inset Items</h3>
          <div className="flex justify-center">
            <Menu>
              <MenuTrigger>Nested Menu</MenuTrigger>
              <MenuContent>
                <MenuItem onClick={() => console.log('Level 1')}>
                  Level 1
                </MenuItem>
                <MenuItem inset onClick={() => console.log('Level 2')}>
                  Level 2
                </MenuItem>
                <MenuItem inset onClick={() => console.log('Level 3')}>
                  Level 3
                </MenuItem>
                <MenuSeparator />
                <MenuItem onClick={() => console.log('Back to top')}>
                  Back to top
                </MenuItem>
              </MenuContent>
            </Menu>
          </div>
        </div>

        {/* Language Selection Menu */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Language Selection</h3>
          <div className="flex justify-center">
            <Menu>
              <MenuTrigger>Language: {language.toUpperCase()}</MenuTrigger>
              <MenuContent>
                <MenuLabel>Select Language</MenuLabel>
                <MenuRadioItem
                  value="en"
                  checked={language === 'en'}
                  onSelect={setLanguage}
                >
                  English
                </MenuRadioItem>
                <MenuRadioItem
                  value="es"
                  checked={language === 'es'}
                  onSelect={setLanguage}
                >
                  Español
                </MenuRadioItem>
                <MenuRadioItem
                  value="fr"
                  checked={language === 'fr'}
                  onSelect={setLanguage}
                >
                  Français
                </MenuRadioItem>
                <MenuRadioItem
                  value="de"
                  checked={language === 'de'}
                  onSelect={setLanguage}
                >
                  Deutsch
                </MenuRadioItem>
              </MenuContent>
            </Menu>
          </div>
        </div>

      </div>

      {/* Usage Examples */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Usage Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Basic Usage</h3>
            <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
{`<Menu>
  <MenuTrigger>Click me</MenuTrigger>
  <MenuContent>
    <MenuItem>Option 1</MenuItem>
    <MenuItem>Option 2</MenuItem>
  </MenuContent>
</Menu>`}
            </pre>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">With Icons & Separators</h3>
            <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
{`<Menu>
  <MenuTrigger>User</MenuTrigger>
  <MenuContent>
    <MenuItem>
      <User className="mr-2 h-4 w-4" />
      Profile
    </MenuItem>
    <MenuSeparator />
    <MenuItem>Sign Out</MenuItem>
  </MenuContent>
</Menu>`}
            </pre>
          </div>
        </div>
      </div>

      {/* Accessibility Features */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">♿ Accessibility Features</h2>
        <ul className="space-y-2 text-blue-700">
          <li>• Full keyboard navigation support (Arrow keys, Enter, Space, Escape)</li>
          <li>• Proper ARIA attributes (aria-expanded, aria-haspopup, aria-controls)</li>
          <li>• Focus management and trapping</li>
          <li>• Screen reader support with semantic HTML</li>
          <li>• Click outside to close functionality</li>
          <li>• High contrast and focus indicators</li>
        </ul>
      </div>
    </div>
  );
}
