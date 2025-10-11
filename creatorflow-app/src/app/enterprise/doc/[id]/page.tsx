'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  Chip,
  Divider,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack as ArrowLeftIcon,
  Download as DownloadIcon,
  Share as Share2Icon,
  Bookmark as BookmarkIcon,
  Print as PrinterIcon,
  AccessTime as ClockIcon,
  Person as UserIcon,
  CalendarMonth as CalendarIcon,
  Tag as TagIcon,
  Security as ShieldIcon,
  Settings as SettingsIcon,
  Code as CodeIcon,
  AttachMoney as DollarSignIcon,
  Description as FileTextIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { getEnterpriseDocById, getEnterpriseDocsByCategory } from '@/lib/enterprise-docs';

export default function EnterpriseDocPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const docId = params.id as string;
  const download = searchParams.get('download') === 'true';
  
  const [doc, setDoc] = useState<any>(null);
  const [relatedDocs, setRelatedDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/enterprise?id=${docId}`);
        const data = await response.json();
        
        if (data.success && data.doc) {
          setDoc(data.doc);
          // Get related documents
          const related = getEnterpriseDocsByCategory(data.doc.category);
          setRelatedDocs(related.filter(d => d.id !== docId).slice(0, 3));
        } else {
          setError('Document not found');
        }
      } catch (err) {
        setError('Failed to load document');
        console.error('Document fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (docId) {
      fetchDoc();
    }
  }, [docId]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'administration':
        return <SettingsIcon sx={{ fontSize: 20 }} />;
      case 'security':
        return <ShieldIcon sx={{ fontSize: 20 }} />;
      case 'compliance':
        return <CheckCircleIcon sx={{ fontSize: 20 }} />;
      case 'integration':
        return <CodeIcon sx={{ fontSize: 20 }} />;
      case 'api':
        return <CodeIcon sx={{ fontSize: 20 }} />;
      case 'billing':
        return <DollarSignIcon sx={{ fontSize: 20 }} />;
      case 'support':
        return <FileTextIcon sx={{ fontSize: 20 }} />;
      default:
        return <FileTextIcon sx={{ fontSize: 20 }} />;
    }
  };

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case 'admin':
        return 'primary';
      case 'it':
        return 'secondary';
      case 'security':
        return 'error';
      case 'finance':
        return 'success';
      case 'compliance':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleDownload = () => {
    // In a real implementation, this would generate and download a PDF
    console.log('Downloading PDF for document:', docId);
    // For now, just show an alert
    alert('PDF download would be implemented here');
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !doc) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 4 }}>
            {error || 'Document not found'}
          </Alert>
          <Button 
            variant="contained" 
            startIcon={<ArrowLeftIcon />}
            href="/enterprise"
          >
            Back to Enterprise Documentation
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'background.paper', py: 4 }}>
        <Container maxWidth="lg">
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link href="/" color="inherit">Home</Link>
            <Link href="/enterprise" color="inherit">Enterprise Documentation</Link>
            <Typography color="text.primary">{doc.title}</Typography>
          </Breadcrumbs>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {getCategoryIcon(doc.category)}
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', ml: 1 }}>
                  {doc.title}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <Chip 
                  icon={<UserIcon sx={{ fontSize: 16 }} />}
                  label={doc.author} 
                  size="small" 
                  variant="outlined" 
                />
                <Chip 
                  icon={<ClockIcon sx={{ fontSize: 16 }} />}
                  label={`${doc.estimatedReadTime} min read`} 
                  size="small" 
                  variant="outlined" 
                />
                <Chip 
                  icon={<CalendarIcon sx={{ fontSize: 16 }} />}
                  label={`Updated ${doc.lastUpdated}`} 
                  size="small" 
                  variant="outlined" 
                />
                <Chip 
                  label={doc.difficulty} 
                  size="small" 
                  color={doc.difficulty === 'beginner' ? 'success' : doc.difficulty === 'intermediate' ? 'warning' : 'error'}
                  variant="outlined" 
                />
                <Chip 
                  label={doc.audience} 
                  size="small" 
                  color={getAudienceColor(doc.audience) as any}
                  variant="outlined" 
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {doc.tags.map((tag: string) => (
                  <Chip 
                    key={tag}
                    icon={<TagIcon sx={{ fontSize: 16 }} />}
                    label={tag} 
                    size="small" 
                    variant="outlined" 
                    color="primary"
                  />
                ))}
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <IconButton onClick={handleDownload} title="Download PDF">
                <DownloadIcon />
              </IconButton>
              <IconButton onClick={handleShare} title="Share">
                <Share2Icon />
              </IconButton>
              <IconButton onClick={handlePrint} title="Print">
                <PrinterIcon />
              </IconButton>
              <IconButton title="Bookmark">
                <BookmarkIcon />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Content */}
      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Box 
            sx={{ 
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                fontWeight: 'bold',
                mb: 2,
                mt: 4,
                '&:first-of-type': { mt: 0 }
              },
              '& p': {
                mb: 2,
                lineHeight: 1.7
              },
              '& ul, & ol': {
                mb: 2,
                pl: 3
              },
              '& li': {
                mb: 1
              },
              '& blockquote': {
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                pl: 3,
                py: 1,
                bgcolor: 'action.hover',
                fontStyle: 'italic',
                mb: 2
              },
              '& code': {
                bgcolor: 'action.hover',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontFamily: 'monospace'
              },
              '& pre': {
                bgcolor: 'action.hover',
                p: 2,
                borderRadius: 1,
                overflow: 'auto',
                mb: 2
              },
              '& table': {
                width: '100%',
                borderCollapse: 'collapse',
                mb: 2
              },
              '& th, & td': {
                border: '1px solid',
                borderColor: 'divider',
                px: 2,
                py: 1,
                textAlign: 'left'
              },
              '& th': {
                bgcolor: 'action.hover',
                fontWeight: 'bold'
              }
            }}
            dangerouslySetInnerHTML={{ __html: doc.content.replace(/\n/g, '<br>') }}
          />
        </Container>
      </Box>

      {/* Related Documents */}
      {relatedDocs.length > 0 && (
        <Box sx={{ py: 6, bgcolor: 'background.paper' }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 4 }}>
              Related Documentation
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              {relatedDocs.map((relatedDoc) => (
                <Card 
                  key={relatedDoc.id}
                  component="a"
                  href={`/enterprise/doc/${relatedDoc.id}`}
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': { 
                      boxShadow: 4,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {getCategoryIcon(relatedDoc.category)}
                      <Typography variant="h6" sx={{ fontWeight: 'bold', ml: 1, color: 'primary.main' }}>
                        {relatedDoc.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                      {relatedDoc.content.substring(0, 100)}...
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={relatedDoc.audience} 
                        size="small" 
                        color={getAudienceColor(relatedDoc.audience) as any}
                        variant="outlined" 
                      />
                      <Chip 
                        label={`${relatedDoc.estimatedReadTime} min`} 
                        size="small" 
                        variant="outlined" 
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Container>
        </Box>
      )}

      {/* Back to Enterprise Documentation */}
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Button 
            variant="contained" 
            startIcon={<ArrowLeftIcon />}
            href="/enterprise"
            size="large"
          >
            Back to Enterprise Documentation
          </Button>
        </Container>
      </Box>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onClose={() => setShowShareDialog(false)}>
        <DialogTitle>Share Document</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Share this document with your team or colleagues.
          </Typography>
          <TextField
            fullWidth
            label="Document URL"
            value={`${window.location.origin}/enterprise/doc/${docId}`}
            InputProps={{
              readOnly: true,
            }}
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Copy the URL above to share this document.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowShareDialog(false)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/enterprise/doc/${docId}`);
              setShowShareDialog(false);
            }}
          >
            Copy URL
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
