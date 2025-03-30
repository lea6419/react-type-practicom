import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  SimpleGrid, 
  Card, 
  Text, 
  Button, 
  Group, 
  Container, 
  Title 
} from "@mantine/core";
import { 
  IconFiles, 
  IconUsers, 
  IconChartBar, 
  IconSettings, 
  IconLogout, 
  IconClipboardList 
} from "@tabler/icons-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  const dashboardItems = [
    {
      icon: <IconFiles size={50} stroke={1.5} />,
      title: "ניהול קבצים",
      description: "העלאה, הורדה וארגון קבצים",
      route: "/files"
    },
    {
      icon: <IconUsers size={50} stroke={1.5} />,
      title: "ניהול משתמשים", 
      description: "הוספה וניהול משתמשים",
      route: "/users"
    },
    {
      icon: <IconChartBar size={50} stroke={1.5} />,
      title: "דוחות וסטטיסטיקות",
      description: "מבט כללי על מדדי המערכת",
      route: "/reports"
    },
    {
      icon: <IconSettings size={50} stroke={1.5} />,
      title: "הגדרות מערכת",
      description: "תצורה והגדרות כלליות",
      route: "/settings"
    },
    {
      icon: <IconClipboardList size={50} stroke={1.5} />,
      title: "יומן פעילות",
      description: "מעקב אחר פעולות במערכת",
      route: "/activity-log"
    }
  ];

  return (
    <Container size="lg">
      <Group align="apart" mb={30}>
        <Title>לוח בקרה</Title>
        <Button 
  color="red" 
  leftIcon={<IconLogout size={16} />} 
  onClick={handleLogout}
>
  התנתקות
</Button>
      </Group>

      <SimpleGrid 
        cols={3} 
        spacing="lg" 
        breakpoints={[
          { maxWidth: 'md', cols: 2 },
          { maxWidth: 'xs', cols: 1 }
        ]}
      >
        {dashboardItems.map((item) => (
          <Card 
            key={item.title} 
            shadow="sm" 
            p="lg" 
            radius="md" 
            withBorder
            onClick={() => navigate(item.route)}
            sx={{ cursor: 'pointer', transition: 'transform 0.2s' }}
            _hover={{ transform: 'scale(1.03)' }}
          >
            <Group align="center" mb="xs">
              {item.icon}
            </Group>
            <Text weight={500} align="center" size="lg" mb="xs">
              {item.title}
            </Text>
            <Text color="dimmed" align="center">
              {item.description}
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}