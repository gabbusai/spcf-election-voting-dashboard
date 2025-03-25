import React from 'react';
import { 
  Card, 
  Statistic, 
  Row, 
  Col, 
  Typography, 
  Progress, 
  Alert, 
  Divider, 
  Space 
} from 'antd';
import { 
  TrophyOutlined, 
  PieChartOutlined, 
  UserOutlined, 
  CheckCircleOutlined 
} from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuthContext } from '../../utils/AuthContext';
import { useParams } from 'react-router-dom';
import { useFetchElectionResults } from '../../utils/queries';

const { Title, Text } = Typography;

function ElectionsResultsId() {
    const { user, token } = useAuthContext();
    const { id } = useParams();
    const { data, isLoading, isError, refetch } = useFetchElectionResults(token, id);

    if (isLoading) return (
        <Card>
            <Alert 
                message="Loading Election Results" 
                description="Fetching the latest election data..." 
                type="info" 
            />
        </Card>
    );

    if (isError) return (
        <Card>
            <Alert 
                message="Error Loading Results" 
                description="Unable to retrieve election data" 
                type="error" 
                showIcon 
                action={
                    <Space>
                        <a onClick={refetch}>Retry</a>
                    </Space>
                }
            />
        </Card>
    );

    if (!data) return (
        <Card>
            <Alert 
                message="No Data Available" 
                description="No election data found for this election" 
                type="warning" 
            />
        </Card>
    );

    const { election, results } = data;

    // Process leaderboard data
    const leaderboardData = results.flatMap(position => {
        const maxVotes = Math.max(...position.candidates.map(c => c.votes));
        return position.candidates
            .filter(c => c.votes === maxVotes && maxVotes > 0)
            .map(c => ({
                position: position.position_name,
                name: c.name,
                votes: c.votes,
                partylist: c.partylist
            }));
    });

    return (
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Election Overview */}
            <Card 
                title={
                    <Title level={2} style={{ margin: 0 }}>
                        <TrophyOutlined style={{ marginRight: 12, color: '#1890ff' }} />
                        {election.name}
                    </Title>
                }
                extra={<Text type="secondary">{election.status}</Text>}
            >
                <Row gutter={16}>
                    <Col span={6}>
                        <Statistic 
                            title="Total Registered Voters" 
                            value={election.total_voters} 
                            prefix={<UserOutlined />} 
                        />
                    </Col>
                    <Col span={6}>
                        <Statistic 
                            title="Votes Cast" 
                            value={election.votes_cast} 
                        />
                    </Col>
                    <Col span={6}>
                        <Statistic 
                            title="Turnout" 
                            value={`${election.turnout_percentage}%`} 
                        />
                    </Col>
                    <Col span={6}>
                        <Progress 
                            type="circle" 
                            percent={election.turnout_percentage} 
                            format={() => `${election.turnout_percentage}%`} 
                        />
                    </Col>
                </Row>
            </Card>

            <Divider orientation="left">
                <Title level={3}>
                    <PieChartOutlined style={{ marginRight: 12, color: '#1890ff' }} />
                    Election Results by Position
                </Title>
            </Divider>

            {/* Position Results */}
            {results.map((position) => (
                <Card 
                    key={position.position_id} 
                    title={position.position_name}
                    style={{ marginBottom: 24 }}
                >
                    <Row gutter={16}>
                        <Col span={16}>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={position.candidates}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="votes" fill="#1890ff" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Col>
                        <Col span={8}>
                            <Card 
                                type="inner" 
                                title="Winners" 
                                extra={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                            >
                                {position.winners[0] === "No votes received for this position" ? (
                                    <Alert 
                                        message="No Votes" 
                                        description="No votes were received for this position" 
                                        type="warning" 
                                    />
                                ) : (
                                    <Space direction="vertical">
                                        {position.winners.map(winner => (
                                            <Text key={winner.candidate_id}>
                                                {winner.name} ({winner.partylist}) - {winner.votes} vote{winner.votes !== 1 ? 's' : ''}
                                            </Text>
                                        ))}
                                    </Space>
                                )}
                            </Card>
                        </Col>
                    </Row>
                </Card>
            ))}

            {/* Leaderboard Section */}
            <Card 
                title={
                    <Title level={3} style={{ margin: 0 }}>
                        <TrophyOutlined style={{ marginRight: 12, color: '#1890ff' }} />
                        Leaderboard
                    </Title>
                }
            >
                {leaderboardData.length > 0 ? (
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {leaderboardData.map((entry, index) => (
                            <Card 
                                key={`${entry.position}-${entry.name}`} 
                                type="inner"
                                title={entry.position}
                                extra={`${entry.votes} vote${entry.votes !== 1 ? 's' : ''}`}
                                style={{ marginBottom: 8 }}
                            >
                                <Text strong>{entry.name}</Text>
                                <Text type="secondary"> ({entry.partylist})</Text>
                            </Card>
                        ))}
                    </Space>
                ) : (
                    <Alert 
                        message="No Winners" 
                        description="No winners have been determined yet" 
                        type="info" 
                    />
                )}
            </Card>
        </div>
    );
}

export default ElectionsResultsId;