import React, { useState } from 'react';
import { useAuthContext } from '../../utils/AuthContext';
import { useParams } from 'react-router-dom';
import { useFetchElectionVoters, useFetchTurnouts } from '../../utils/queries';
import { Table, Input, Button, Space, Typography, Card, Statistic } from 'antd';
import { SearchOutlined, PieChartOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Vote, BarChart2, Users } from 'lucide-react';

const { Title, Text } = Typography;

function ElectionsReport() {
    const { user, token } = useAuthContext();
    const { id } = useParams();
    const [search, setSearch] = useState('');
    
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch,
    } = useFetchTurnouts(token, id, 15, search);
    
    // Handle search input
    const handleSearch = (value) => {
        setSearch(value);
        refetch();
    };

    // Table columns definition
    const columns = [
        {
            title: 'Student ID',
            dataIndex: 'student_id',
            key: 'student_id',
            sorter: (a, b) => a.student_id - b.student_id,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Department ID',
            dataIndex: 'department_id',
            key: 'department_id',
        },
        {
            title: 'Vote Date',
            dataIndex: 'vote_date',
            key: 'vote_date',
            render: (text) => new Date(text).toLocaleString(),
            sorter: (a, b) => new Date(a.vote_date) - new Date(b.vote_date),
        },
        {
            title: 'Voted For',
            dataIndex: 'voted_for',
            key: 'voted_for',
            render: (voted_for) => voted_for?.candidate_name || 'N/A',
        },
    ];

    // Flatten the paginated data for the table
    const votersData = data?.pages?.flatMap(page => page.voters) || [];

    // Get election data from the first page
    const electionData = data?.pages?.[0]?.election || {};
    const totalVoters = electionData.total_voters || 0;
    const votesCast = electionData.votes_cast || 0;
    const turnoutPercentage = electionData.turnout_percentage || 0;

    // Prepare data for election statistics pie chart
    const electionStatsData = [
        { 
            name: 'Votes Cast', 
            value: votesCast,
            percentage: turnoutPercentage
        },
        { 
            name: 'Non-Votes', 
            value: totalVoters - votesCast,
            percentage: totalVoters > 0 ? ((totalVoters - votesCast) / totalVoters * 100).toFixed(2) : 0
        }
    ].filter(item => item.value >= 0); // Ensure no negative values

    // Colors for the pie chart
    const COLORS = ['#00C49F', '#FF8042'];

    return (
        <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
            <Title level={2}>
                <Vote style={{ marginRight: '10px' }} />
                {electionData.name || 'Election Turnout Report'}
            </Title>
            
            {/* Election Overview */}
            {electionData && Object.keys(electionData).length > 0 && (
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <Card>
                        <Statistic 
                            title="Election Status" 
                            value={electionData.status} 
                            prefix={<PieChartOutlined />}
                        />
                    </Card>
                    <Card>
                        <Statistic 
                            title="Total Voters" 
                            value={totalVoters} 
                            prefix={<Users />}
                        />
                    </Card>
                    <Card>
                        <Statistic 
                            title="Votes Cast" 
                            value={votesCast} 
                            prefix={<BarChart2 />}
                        />
                    </Card>
                    <Card>
                        <Statistic 
                            title="Turnout Percentage" 
                            value={`${turnoutPercentage}%`} 
                            prefix={<PieChartOutlined />}
                        />
                    </Card>
                </div>
            )}

            {/* Election Turnout Distribution */}
            {electionStatsData.length > 0 && (
                <Card title="Election Turnout Distribution" style={{ marginBottom: '20px' }}>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={electionStatsData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                            >
                                {electionStatsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value, name) => [
                                    `${value} (${electionStatsData.find(d => d.name === name)?.percentage}%)`, 
                                    name
                                ]}
                            />
                            <Legend 
                                formatter={(value) => {
                                    const entry = electionStatsData.find(d => d.name === value);
                                    return `${value} - ${entry?.percentage}%`;
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            )}

            {/* Search Bar */}
            <Space style={{ marginBottom: '20px' }}>
                <Input
                    placeholder="Search by name or student ID"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onPressEnter={(e) => handleSearch(e.target.value)}
                    style={{ width: 200 }}
                />
                <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={() => handleSearch(search)}
                >
                    Search
                </Button>
            </Space>

            {/* Voters Table */}
            <Table
                columns={columns}
                dataSource={votersData}
                rowKey={(record) => `${record.student_id}-${record.vote_date}`}
                loading={isLoading || isFetchingNextPage}
                pagination={{
                    total: data?.pages?.[0]?.pagination?.total || votersData.length,
                    current: data?.pages?.[0]?.pagination?.current_page || 1,
                    pageSize: data?.pages?.[0]?.pagination?.per_page || 15,
                    showSizeChanger: false,
                    onChange: (page) => {
                        if (hasNextPage && page > (data?.pages?.[0]?.pagination?.current_page || 1)) {
                            fetchNextPage();
                        }
                    },
                }}
                locale={{
                    emptyText: isError ? (
                        <Space direction="vertical">
                            <p>Error loading data: {error?.message}</p>
                            <Button onClick={refetch}>Retry</Button>
                        </Space>
                    ) : 'No voters found'
                }}
            />

            {/* Load More Button */}
            {hasNextPage && (
                <Button
                    onClick={fetchNextPage}
                    loading={isFetchingNextPage}
                    style={{ marginTop: '10px' }}
                >
                    Load More
                </Button>
            )}
        </div>
    );
}

export default ElectionsReport;