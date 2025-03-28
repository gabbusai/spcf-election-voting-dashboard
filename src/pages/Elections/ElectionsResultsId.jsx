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
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useAuthContext } from '../../utils/AuthContext';
import { useParams } from 'react-router-dom';
import { useFetchElectionResults } from '../../utils/queries';
import { useFetchElectionStatistics } from '../../utils/queries';
import ElectionStatistics from '../../components/ElectionStatistics';

const { Title, Text } = Typography;

// Helper function to calculate percentage and determine winners
const processPositionResults = (candidates) => {
  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
  
  // Calculate percentages
  const candidatesWithPercentage = candidates.map(candidate => ({
    ...candidate,
    percentage: totalVotes > 0 
      ? ((candidate.votes / totalVotes) * 100).toFixed(2) 
      : '0.00'
  }));

  // Sort candidates by votes in descending order
  const sortedCandidates = candidatesWithPercentage.sort((a, b) => b.votes - a.votes);

  // Determine winners (handle ties)
  const maxVotes = sortedCandidates[0]?.votes || 0;
  const winners = sortedCandidates.filter(candidate => candidate.votes === maxVotes);

  return {
    candidates: sortedCandidates,
    winners,
    totalVotes
  };
};

// Custom colors for pie chart
const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'];

function ElectionsResultsId() {
    const { user, token } = useAuthContext();
    const { id } = useParams();
    const { data, isLoading, isError, refetch } = useFetchElectionResults(token, id);
    const {data: electionStat, isError: electionStatError, isLoading: electionStatLoading, refetch: electionStatRefetch}
    = useFetchElectionStatistics(token, id);

    
    if (isLoading || electionStatLoading) return (
        <Card>
            <Alert 
                message="Loading Election Results" 
                description="Fetching the latest election data..." 
                type="info" 
            />
        </Card>
    );

    if (isError || electionStatError) return (
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

    // Process each position's results
    const processedResults = results.map(position => ({
        ...position,
        ...processPositionResults(position.candidates)
    }));

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
            {processedResults.map((position) => (
                <Card 
                    key={position.position_id} 
                    title={position.position_name}
                    style={{ marginBottom: 24 }}
                >
                    <Row gutter={16}>
                        <Col span={10}>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={position.candidates}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip 
                                        formatter={(value, name, props) => {
                                            const candidate = props.payload;
                                            return [`${value} votes (${candidate.percentage}%)`, name];
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="votes" fill="#1890ff" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Col>
                        <Col span={7}>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={position.candidates}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="votes"
                                    >
                                        {position.candidates.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value, name, props) => {
                                            const candidate = props.payload;
                                            return [`${value} votes (${candidate.percentage}%)`, name];
                                        }}
                                    />
                                    <Legend 
                                        formatter={(value, entry) => {
                                            const candidate = entry.payload;
                                            return `${candidate.name} (${candidate.percentage}%)`;
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </Col>
                        <Col span={7}>
                            <Card 
                                type="inner" 
                                title="Candidates" 
                                extra={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                            >
                                {position.totalVotes === 0 ? (
                                    <Alert 
                                        message="No Votes" 
                                        description="No votes were received for this position" 
                                        type="warning" 
                                    />
                                ) : (
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        {position.candidates.map(candidate => (
                                            <Card 
                                                key={candidate.candidate_id} 
                                                type="inner"
                                                title={candidate.name}
                                                extra={
                                                    position.winners.some(w => w.candidate_id === candidate.candidate_id) 
                                                        ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> 
                                                        : null
                                                }
                                            >
                                                <Row>
                                                    <Col span={12}>
                                                        <Text strong>{candidate.votes} vote{candidate.votes !== 1 ? 's' : ''}</Text>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Text type="secondary">{candidate.percentage}%</Text>
                                                    </Col>
                                                </Row>
                                                <Text type="secondary">({candidate.partylist})</Text>
                                            </Card>
                                        ))}
                                    </Space>
                                )}
                            </Card>
                        </Col>
                    </Row>
                </Card>
            ))}

            {electionStat && <ElectionStatistics electionStat={electionStat} />}
        </div>
    );
}

export default ElectionsResultsId;