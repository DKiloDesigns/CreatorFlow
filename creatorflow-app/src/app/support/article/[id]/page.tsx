'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Box, 
  Container, 
  Typography, 
  Chip, 
  Button, 
  Breadcrumbs, 
  Link,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Calendar,
  Tag,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark
} from 'lucide-react';
import { PublicHeader } from '@/components/PublicHeader';
import { Footer } from '@/components/Footer';
import { getArticleById, getRelatedArticles } from '@/lib/help-articles';

export default function ArticlePage() {
  const params = useParams();
  const articleId = params.id as string;
  
  const [article, setArticle] = useState<any>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/help/search?id=${articleId}`);
        const data = await response.json();
        
        if (data.success && data.article) {
          setArticle(data.article);
          // Get related articles
          const related = getRelatedArticles(articleId);
          setRelatedArticles(related);
        } else {
          setError('Article not found');
        }
      } catch (err) {
        setError('Failed to load article');
        console.error('Article fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !article) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
        <PublicHeader />
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 4 }}>
            {error || 'Article not found'}
          </Alert>
          <Button 
            variant="contained" 
            startIcon={<ArrowLeft />}
            href="/support"
          >
            Back to Help Center
          </Button>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <PublicHeader />

      {/* Article Header */}
      <Box component="section" sx={{ py: 4, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link href="/support" color="inherit">
              Help Center
            </Link>
            <Link href={`/support?category=${article.category}`} color="inherit">
              {article.category}
            </Link>
            <Typography color="text.primary">{article.title}</Typography>
          </Breadcrumbs>

          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
            {article.title}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
            <Chip 
              icon={<User size={16} />}
              label={article.author} 
              size="small" 
              variant="outlined" 
            />
            <Chip 
              icon={<Clock size={16} />}
              label={`${article.readTime} min read`} 
              size="small" 
              variant="outlined" 
            />
            <Chip 
              icon={<Calendar size={16} />}
              label={`Updated ${article.lastUpdated}`} 
              size="small" 
              variant="outlined" 
            />
            <Chip 
              label={article.difficulty} 
              size="small" 
              color={article.difficulty === 'beginner' ? 'success' : article.difficulty === 'intermediate' ? 'warning' : 'error'}
              variant="outlined" 
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
            {article.tags.map((tag: string) => (
              <Chip 
                key={tag}
                icon={<Tag size={16} />}
                label={tag} 
                size="small" 
                variant="outlined" 
                color="primary"
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="outlined" 
              startIcon={<ThumbsUp size={16} />}
              size="small"
            >
              Helpful
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<ThumbsDown size={16} />}
              size="small"
            >
              Not Helpful
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<Share2 size={16} />}
              size="small"
            >
              Share
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<Bookmark size={16} />}
              size="small"
            >
              Save
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Article Content */}
      <Box component="section" sx={{ py: 6 }}>
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
              }
            }}
            dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }}
          />
        </Container>
      </Box>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <Box component="section" sx={{ py: 6, bgcolor: 'background.paper' }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 4 }}>
              Related Articles
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
              {relatedArticles.map((relatedArticle) => (
                <Card 
                  key={relatedArticle.id}
                  component="a"
                  href={`/support/article/${relatedArticle.id}`}
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
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                      {relatedArticle.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                      {relatedArticle.content.substring(0, 100)}...
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={relatedArticle.category} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                      <Chip 
                        label={`${relatedArticle.readTime} min`} 
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

      {/* Back to Help Center */}
      <Box component="section" sx={{ py: 4 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Button 
            variant="contained" 
            startIcon={<ArrowLeft />}
            href="/support"
            size="large"
          >
            Back to Help Center
          </Button>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
