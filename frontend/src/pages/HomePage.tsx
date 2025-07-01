import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper,
  Card,
  CardContent,
  CardActions,
  Chip,
} from '@mui/material';
import { 
  Translate as TranslateIcon,
  Description as DescriptionIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Support as SupportIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const features = [
    {
      icon: <TranslateIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'AI Translation',
      description: 'Get instant translations with cultural context and pronunciation guides for 100+ languages.',
      link: '/translation',
      color: 'primary',
    },
    {
      icon: <DescriptionIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Form Assistance',
      description: 'Upload government forms and receive step-by-step guidance with field explanations.',
      link: '/forms',
      color: 'secondary',
    },
    {
      icon: <LanguageIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Cultural Context',
      description: 'Learn not just what to say, but how to say it appropriately in different situations.',
      link: '/about',
      color: 'success',
    },
  ];

  const stats = [
    { label: 'Languages Supported', value: '100+', icon: <LanguageIcon /> },
    { label: 'Secure & Private', value: '100%', icon: <SecurityIcon /> },
    { label: 'Fast Response', value: '<2s', icon: <SpeedIcon /> },
    { label: '24/7 Support', value: 'Always', icon: <SupportIcon /> },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        className="hero-section"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
          py: { xs: 8, md: 12 },
          mb: 8,
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '4rem' },
              mb: 3,
            }}
          >
            Welcome Home
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4, 
              opacity: 0.9,
              lineHeight: 1.6,
              fontWeight: 300,
            }}
          >
            AI-powered translation and form assistance to help refugees 
            navigate their new environment with confidence and dignity.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large"
              component={Link}
              to="/translation"
              sx={{ 
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                '&:hover': {
                  bgcolor: 'grey.100',
                }
              }}
            >
              Start Translating
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              component={Link}
              to="/forms"
              sx={{ 
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              Get Form Help
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl">
        {/* Stats Section */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3
          }}>
            {stats.map((stat, index) => (
              <Paper 
                key={index}
                elevation={2}
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  height: '100%',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 1 }}>
                  {stat.icon}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" textAlign="center" gutterBottom sx={{ mb: 6, fontWeight: 600 }}>
            How We Help You Succeed
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4
          }}>
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="feature-card"
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button 
                    variant="contained" 
                    component={Link}
                    to={feature.link}
                    color={feature.color as any}
                    size="large"
                  >
                    Get Started
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Box>

        {/* CTA Section */}
        <Paper 
          elevation={0}
          sx={{ 
            background: 'linear-gradient(45deg, #f8f9fa, #e9ecef)',
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
            mb: 8,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Ready to Start Your Journey?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Join thousands of refugees who have found success with our platform.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
            <Chip label="Free to Use" color="success" />
            <Chip label="No Registration Required" color="primary" />
            <Chip label="Privacy Protected" color="secondary" />
          </Box>
          <Button 
            variant="contained" 
            size="large"
            component={Link}
            to="/translation"
            sx={{ px: 4, py: 1.5 }}
          >
            Start Using RefugeeAssist Today
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}; 