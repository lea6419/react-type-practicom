import { FC } from 'react';
import { Card, Title, Text, Stack, Divider } from '@mantine/core';

type ProfileProps = {
  user: {
    name: string;
    email: string;
    role: string;
  };
};

const Profile: FC<ProfileProps> = ({ user }) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder mt="xl" mx="auto" maw={500}>
      <Title order={2} mb="sm">פרופיל משתמש</Title>
      <Divider my="sm" />
      <Stack spacing="xs">
        <Text><strong>שם:</strong> {user.name}</Text>
        <Text><strong>אימייל:</strong> {user.email}</Text>
        <Text><strong>הרשאות:</strong> {user.role}</Text>
      </Stack>
    </Card>
  );
};

export default Profile;
