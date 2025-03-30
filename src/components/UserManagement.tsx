import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card } from '@mantine/core';


const UserManagement = () => {
    const user: { id: number; username: string; email: string; role: string }[] = [];
    const [users, setUsers] = useState(user);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const editUser = async (userId: number, updatedUser: { FullName: string; Email: string; Role: string; Password?: string }) => {
        try {
            const response = await axios.put(
                `https://server-type-practicom.onrender.com/api/User/${userId}`,
                updatedUser,
                {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('User updated successfully:', response.data);
            fetchUsers(); // רענון רשימת המשתמשים אחרי העדכון
        } catch (error: any) {
            console.error('Failed to update user:', error.response?.data || error.message);
        }
    };
    
    const deleteUser = async (userId: number) => {
        try {
            await axios.delete(`https://server-type-practicom.onrender.com/api/User/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('User deleted successfully');
            fetchUsers(); // רענון רשימת המשתמשים אחרי מחיקה
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };
    const viewFiles = (userId: number) => {
        // פה את יכולה לנווט לעמוד אחר או להציג את הקבצים על המסך.
        console.log('Viewing files for user:', userId);
    };
            
    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://server-type-practicom.onrender.com/api/User/client'
                , {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`, // כאן חשוב שהטוקן שלך תקין
                        'Content-Type': 'application/json'
                    }
            });
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch users');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>

            <div className="grid grid-cols-1 gap-4">
                {users.map(user => (
                    <Card key={user.id} className="rounded-2xl shadow p-4">
                        {/* <CardContent> */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <p><strong>Name:</strong> {user.username}</p>
                                    <p><strong>Email:</strong> {user.email}</p>
                                    <p><strong>Role:</strong> {user.role}</p>
                                </div>
                                <div className="flex space-x-2">
                                <div className="flex space-x-2">
    <Button onClick={() => editUser(user.id, { username: user.username, email: user.email, role: user.role })}>Edit</Button>
    <Button variant="destructive" onClick={() => deleteUser(user.id)}>Delete</Button>
    <Button onClick={() => viewFiles(user.id)}>View Files</Button>
</div>

                                </div>
                            </div>
                        {/* </CardContent> */}
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default UserManagement;