'use client';

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Stack,
  Divider,
  Alert,
  AlertTitle,
  Grid
} from '@mui/material';
import {
  Lock as LockIcon,
  Star as StarIcon,
  ArrowUpward as ArrowUpwardIcon,
  CheckCircle as CheckCircleIcon,
  AutoAwesome as AutoAwesomeIcon,
  Bolt as BoltIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { UserPlan, PLAN_FEATURES, PLAN_HIERARCHY } from '@/lib/plan-validation';
