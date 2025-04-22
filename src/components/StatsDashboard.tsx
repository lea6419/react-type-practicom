import { Card, Grid, Title, Text, Skeleton } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// רישום קומפוננטות לגרף
ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ['#FF6384', '#36A2EB', '#4BC0C0'];

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

    if (loading) return <Skeleton height={300} />;

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
                borderWidth: 1
            }
        ]
    };

    return (
        <div>
            <Title order={2} mb="md">סטטיסטיקות מערכת</Title>

            <Grid>
                <Grid.Col span={4}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Text size="lg" fw={700}>סה״כ משתמשים</Text>
                        <Text size="xl">{stats.totalUsers}</Text>
                    </Card>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Text size="lg" fw={700}>קלדניות</Text>
                        <Text size="xl">{stats.typistsCount}</Text>
                    </Card>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Text size="lg" fw={700}>לקוחות</Text>
                        <Text size="xl">{stats.clientsCount}</Text>
                    </Card>
                </Grid.Col>
            </Grid>

            <Grid mt="xl">
                <Grid.Col span={6}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Text size="lg" fw={700}>סה״כ קבצים</Text>
                        <Text size="xl">{stats.totalFiles}</Text>
                    </Card>
                </Grid.Col>

                <Grid.Col span={6}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Text size="lg" fw={700} mb="md">התפלגות סטטוס קבצים</Text>
                        <Pie data={filePieData} />
                    </Card>
                </Grid.Col>
            </Grid>
        </div>
    );
}
