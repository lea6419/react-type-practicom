import { Card, Title, Table, Divider } from '@mantine/core';

const dummyLogs = [
  { id: 1, action: 'התחברות למערכת', user: 'ישראל ישראלי', time: '2025-05-18 12:34' },
  { id: 2, action: 'העלאת קובץ', user: 'רוני לוי', time: '2025-05-18 12:40' },
  { id: 3, action: 'עדכון פרופיל', user: 'דנה כהן', time: '2025-05-18 12:55' },
];

const ActivityLogPage = () => {
  const rows = dummyLogs.map((log) => (
    <tr key={log.id}>
      <td>{log.time}</td>
      <td>{log.user}</td>
      <td>{log.action}</td>
    </tr>
  ));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder mt="xl" mx="auto" maw={800}>
      <Title order={2} mb="md">יומן פעילות</Title>
      <Divider my="sm" />
      <Table striped highlightOnHover withTableBorder>
        <thead>
          <tr>
            <th>זמן</th>
            <th>משתמש</th>
            <th>פעולה</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Card>
  );
};

export default ActivityLogPage;
