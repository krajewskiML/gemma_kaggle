import React from 'react';
import { Box, Container } from '@mui/material';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flex: 1,
          py: 2,
        }}
      >
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}; 