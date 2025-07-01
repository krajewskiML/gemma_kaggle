import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Chip,
  Divider,
  Paper,
  useTheme
} from '@mui/material';
import { 
  Favorite as HeartIcon, 
  Language as GlobalIcon, 
  Security as ShieldIcon
} from '@mui/icons-material';

export const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <Paper 
      component="footer" 
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderTop: `1px solid ${theme.palette.divider}`,
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 4
        }}>
          
          {/* Brand section */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  background: 'linear-gradient(45deg, #1976d2, #e91e63)',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1,
                }}
              >
                <HeartIcon sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #1976d2, #e91e63)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                RefugeeAssist
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
              Empowering refugees with AI-powered translation and form assistance 
              to navigate their new environment with confidence and dignity.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<GlobalIcon />}
                label="100+ Languages"
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<ShieldIcon />}
                label="Secure & Private"
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>

          {/* Services section */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Our Services
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                'Real-time text translation with cultural context',
                'Image translation for signs and documents',
                'Government form analysis and guidance',
                'Step-by-step form completion help'
              ].map((service, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: index === 0 ? 'primary.main' : 
                               index === 1 ? 'secondary.main' :
                               index === 2 ? 'success.main' : 'warning.main',
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {service}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Support section */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Support & Resources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {[
                'Getting Started Guide',
                'Frequently Asked Questions',
                'Privacy Policy',
                'Terms of Service'
              ].map((item) => (
                <Button
                  key={item}
                  variant="text"
                  size="small"
                  sx={{
                    justifyContent: 'flex-start',
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {item}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2024 RefugeeAssist. Built with care for those seeking a new beginning.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HeartIcon sx={{ color: 'error.main', fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary">
              Made with love for humanity
            </Typography>
          </Box>
        </Box>
      </Container>
    </Paper>
  );
}; 