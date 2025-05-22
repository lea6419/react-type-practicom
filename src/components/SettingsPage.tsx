import { Card, Title, Text, Switch, Divider, Stack } from '@mantine/core';
import { useState } from 'react';

const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder mt="xl" mx="auto" maw={600}>
      <Title order={2} mb="md">הגדרות מערכת</Title>
      <Divider my="sm" />
      <Stack>
        <Switch
          label="הפעל התראות"
          checked={notifications}
          onChange={(e) => setNotifications(e.currentTarget.checked)}
        />
        <Switch
          label="מצב כהה"
          checked={darkMode}
          onChange={(e) => setDarkMode(e.currentTarget.checked)}
        />
        {/* תוכל להוסיף כאן עוד הגדרות לפי הצורך */}
      </Stack>
    </Card>
  );
};

export default SettingsPage;
