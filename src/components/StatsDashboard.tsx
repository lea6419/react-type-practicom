import { Card, Grid, Title, Text, Skeleton, Flex } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ['#FF6384', '#36A2EB', '#4BC0C0'];

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-6">
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text size="md" fw={600} ta="center" c="dimmed" mb={4}>
        {label}
      </Text>
      <Text size="xl" fw={700} ta="center">
        {value}
      </Text>
    </Card>
    </div>
  );
}

export default function StatsDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://server-type-practicom.onrender.com/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <Skeleton height={500} radius="md" />;

  const filePieData = {
    labels: ['בהמתנה', 'בתהליך', 'הושלמו'],
    datasets: [
      {
        label: 'סטטוס קבצים',
        data: [
          stats.filesWaiting,
          stats.filesInProgress,
          stats.filesCompleted
        ],
        backgroundColor: COLORS,
        borderColor: '#fff',
        borderWidth: 1,
      }
    ]
  };

  return (
    <div style={{ width: '100%' }}>
      <Title order={2} mb="md" ta="center">
        סטטיסטיקות מערכת
      </Title>

      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <StatCard label="סה״כ משתמשים" value={stats.totalUsers} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <StatCard label="קלדניות" value={stats.typistsCount} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <StatCard label="לקוחות" value={stats.clientsCount} />
        </Grid.Col>
      </Grid>

      <Grid mt="xl">
        <Grid.Col span={12}> {/* שונה ל-span={12} כדי לתפוס את כל הרוחב */}
          <StatCard label="סה״כ קבצים" value={stats.totalFiles} />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder h={300}>
            <Text size="md" fw={600} ta="center" c="dimmed" mb="md">
              התפלגות סטטוס קבצים
            </Text>
            <Flex justify="center" align="center" h="100%">
              <Pie data={filePieData} />
            </Flex>
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
}