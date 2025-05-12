import { Box, Typography, Container, Divider, Link, Grid, useTheme } from "@mui/material";
import CopyrightIcon from "@mui/icons-material/Copyright";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function Footer() {
  const theme = useTheme();
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: '#f8fafc',
        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
        py: 4,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid >
            <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
              הקלדות+
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              מערכת מתקדמת לניהול הקלדות ומסמכים, המאפשרת עבודה יעילה ומהירה.
            </Typography>
          </Grid>
          
          <Grid >
            <Typography variant="h6" color="text.primary" gutterBottom>
              קישורים מהירים
            </Typography>
            <Link href="/about" color="text.secondary" sx={{ display: 'block', mb: 1, textDecoration: 'none' }}>
              אודות
            </Link>
            <Link href="/services" color="text.secondary" sx={{ display: 'block', mb: 1, textDecoration: 'none' }}>
              שירותים
            </Link>
            <Link href="/contact" color="text.secondary" sx={{ display: 'block', mb: 1, textDecoration: 'none' }}>
              צור קשר
            </Link>
          </Grid>
          
          <Grid >
            <Typography variant="h6" color="text.primary" gutterBottom>
              עקבו אחרינו
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href="#" color="primary" sx={{ '&:hover': { color: theme.palette.primary.dark } }}>
                <FacebookIcon />
              </Link>
              <Link href="#" color="primary" sx={{ '&:hover': { color: theme.palette.primary.dark } }}>
                <TwitterIcon />
              </Link>
              <Link href="#" color="primary" sx={{ '&:hover': { color: theme.palette.primary.dark } }}>
                <LinkedInIcon />
              </Link>
              <Link href="#" color="primary" sx={{ '&:hover': { color: theme.palette.primary.dark } }}>
                <InstagramIcon />
              </Link>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center" 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CopyrightIcon fontSize="small" sx={{ mx: 0.5 }} />
          {new Date().getFullYear()} כל הזכויות שמורות - הקלדות+
        </Typography>
      </Container>
    </Box>
  );
}