"use client"

import { Box, Container, Typography, Grid, Button, Paper, Divider, Link } from "@mui/material"
import KeyboardIcon from "@mui/icons-material/Keyboard"
import BarChartIcon from "@mui/icons-material/BarChart"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

export default function AboutPage() {
  return (
    <Box
      sx={{ minHeight: "100vh", background: "linear-gradient(to bottom, #f0f4f8, #dbeafe)", pt: 10, pb: 6 }}
      dir="rtl"
    >
      <Container>
        {/* Navigation */}
        <Button startIcon={<ArrowBackIcon />} component={Link} href="/" sx={{ color: "primary.main", mb: 4 }}>
          חזרה לדף הבית
        </Button>

        {/* Hero Section */}
        <Grid container spacing={6} alignItems="center" mb={8}>
        <Grid container spacing={6} alignItems="center" mb={8}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              אודות המערכת
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={4}>
              מערכת ניהול ההקלדות המקצועית המובילה בישראל, המאפשרת לך לשפר את מהירות ודיוק ההקלדה שלך.
            </Typography>
            <Button variant="contained" size="large" href="/signup">
              הצטרפי עכשיו
            </Button>
          </Grid>
          <Grid container spacing={6} alignItems="center" mb={8}>
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="אודות המערכת"
              style={{ width: "100%", borderRadius: "8px" }}
            />
          </Grid>
        </Grid>

        {/* Our Mission */}
        <Box textAlign="center" mb={8}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            המשימה שלנו
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800, mx: "auto" }}>
            אנו מאמינים שהקלדה מהירה ומדויקת היא מיומנות חיונית בעולם הדיגיטלי של היום. המשימה שלנו היא לספק את הכלים
            הטובים ביותר לשיפור יכולות ההקלדה, לעקוב אחר התקדמות, ולהפוך את תהליך הלמידה למהנה ויעיל.
          </Typography>
        </Box>

        {/* Key Features */}
        <Box mb={8}>
          <Typography variant="h5" textAlign="center" fontWeight="bold" gutterBottom mb={4}>
            התכונות המרכזיות
          </Typography>
          <Grid container spacing={4}>
            {[
              { icon: <KeyboardIcon fontSize="large" color="primary" />, label: "אימוני הקלדה מותאמים אישית" },
              { icon: <BarChartIcon fontSize="large" color="primary" />, label: "ניתוח ביצועים מתקדם" },
              { icon: <AccessTimeIcon fontSize="large" color="primary" />, label: "מעקב זמן אמת" },
              { icon: <EmojiEventsIcon fontSize="large" color="primary" />, label: "תחרויות והישגים" },
            ].map((item, index) => (
              <Grid container spacing={6} alignItems="center" mb={8}>
                <Paper elevation={3} sx={{ p: 3, textAlign: "center", borderRadius: 3, height: "100%" }}>
                  {item.icon}
                  <Typography variant="h6" mt={1}>
                    {item.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Statistics */}
        <Box mb={8}>
          <Typography variant="h5" textAlign="center" fontWeight="bold" gutterBottom mb={4}>
            המערכת במספרים
          </Typography>
          <Paper elevation={1} sx={{ p: 4, borderRadius: 3 }}>
            <Grid container spacing={4}>
              {[
                { value: "100K+", label: "משתמשים פעילים" },
                { value: "5M+", label: "תרגילי הקלדה הושלמו" },
                { value: "30%", label: "שיפור ממוצע במהירות" },
                { value: "4.8", label: "דירוג ממוצע בחנויות" },
              ].map((stat, index) => (
                <Grid container spacing={6} alignItems="center" mb={8}>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>

        {/* Our Team */}
        <Box mb={8}>
          <Typography variant="h5" textAlign="center" fontWeight="bold" gutterBottom mb={4}>
            הצוות שלנו
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                name: "רון לוי",
                role: 'מייסד ומנכ"ל',
                bio: "מומחה בתחום ההקלדה המהירה עם ניסיון של 15 שנה בפיתוח תוכנה חינוכית.",
              },
              {
                name: "מיכל כהן",
                role: "מנהלת מוצר",
                bio: "בעלת תואר שני בממשק משתמש וחוויית משתמש, מובילה את פיתוח המוצר מאז 2018.",
              },
              {
                name: "דוד אברהם",
                role: "ראש צוות פיתוח",
                bio: "מפתח Full Stack עם התמחות בטכנולוגיות React ו-Node.js, מוביל את הפיתוח הטכני.",
              },
            ].map((member, index) => (
              <Grid container spacing={6} alignItems="center" mb={8}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3, height: "100%" }}>
                  <Typography variant="h6" fontWeight="bold">
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.bio}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Testimonials */}
        <Box mb={8}>
          <Typography variant="h5" textAlign="center" fontWeight="bold" gutterBottom mb={4}>
            מה המשתמשים אומרים
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                quote: "המערכת שינתה לחלוטין את יכולת ההקלדה שלי. שיפרתי את המהירות שלי ב-40% תוך חודש!",
                author: "יעל ג., מתכנתת",
              },
              {
                quote: "כמורה למחשבים, אני ממליץ על המערכת לכל התלמידים שלי. התוצאות מדהימות.",
                author: "אבי ל., מורה למחשבים",
              },
              {
                quote: "הניתוחים המפורטים והמשוב בזמן אמת עזרו לי להבין בדיוק איפה אני צריך להשתפר.",
                author: "נועה ק., סטודנטית",
              },
            ].map((testimonial, index) => (
              <Grid container spacing={6} alignItems="center" mb={8}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3, height: "100%" }}>
                  <Typography variant="body1" paragraph sx={{ fontStyle: "italic", mb: 2 }}>
                    "{testimonial.quote}"
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="subtitle2" color="text.secondary" fontWeight="medium">
                    — {testimonial.author}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA */}
        <Paper
          elevation={3}
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: 3,
            background: "linear-gradient(to right, #3f51b5, #2196f3)",
            color: "white",
            mt: 8,
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            מוכנים לשפר את מיומנויות ההקלדה שלכם?
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 800, mx: "auto", mb: 4 }}>
            הצטרפו למערכת היום והתחילו את המסע לעבר הקלדה מהירה, מדויקת ויעילה יותר.
          </Typography>
          <Button
            variant="contained"
            size="large"
            href="/signup"
            sx={{
              bgcolor: "white",
              color: "primary.main",
              "&:hover": { bgcolor: "grey.100" },
              px: 4,
              py: 1.5,
            }}
          >
            התחילי עכשיו
          </Button>
        </Paper>
      </Container>
    </Box>
  )
}
