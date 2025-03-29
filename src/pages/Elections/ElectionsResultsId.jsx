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
  CheckCircleOutlined,
  BarChartOutlined
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

// Helper function to calculate percentage, winners, and abstains
const processPositionResults = (candidates, votesCast) => {
  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
  const abstainCount = votesCast - totalVotes;
  
  // For pie chart and bar chart, include abstains in total for percentage calculation
  const totalWithAbstains = totalVotes + (abstainCount > 0 ? abstainCount : 0);
  
  // Calculate percentages based on total votes including abstains
  const candidatesWithPercentage = candidates.map(candidate => ({
    ...candidate,
    percentage: totalWithAbstains > 0 
      ? ((candidate.votes / totalWithAbstains) * 100).toFixed(2) 
      : '0.00'
  }));

  // Sort candidates by votes in descending order
  const sortedCandidates = candidatesWithPercentage.sort((a, b) => b.votes - a.votes);

  // Determine winners (handle ties) - winners still based on most votes among candidates
  const maxVotes = sortedCandidates[0]?.votes || 0;
  const winners = sortedCandidates.filter(candidate => candidate.votes === maxVotes);

  // Calculate abstain percentage based on total including abstains
  const abstainPercentage = totalWithAbstains > 0 
    ? ((abstainCount / totalWithAbstains) * 100).toFixed(2) 
    : '0.00';

  // Create abstain object for pie chart
  const abstainObject = {
    name: 'Abstains',
    votes: abstainCount > 0 ? abstainCount : 0,
    percentage: abstainPercentage,
    isAbstain: true // Flag to identify abstain entries
  };

  // Prepare bar chart data (candidates + abstains)
  const barChartData = sortedCandidates.map(candidate => ({
    name: candidate.name,
    votes: candidate.votes,
    percentage: candidate.percentage
  }));
  
  // Only add abstains to bar chart if positive
  if (abstainCount > 0) {
    barChartData.push({
      name: 'Abstains',
      votes: abstainCount,
      percentage: abstainPercentage
    });
  }

  // Prepare pie chart data (include candidates + abstain)
  const pieChartData = [...sortedCandidates];
  if (abstainCount > 0) {
    pieChartData.push(abstainObject);
  }

  // For verification: sum of all percentages should be close to 100%
  const totalPercentage = pieChartData.reduce((sum, item) => sum + parseFloat(item.percentage), 0);

  return {
    candidates: sortedCandidates,
    winners,
    totalVotes,
    totalWithAbstains,
    abstains: abstainCount > 0 ? abstainCount : 0,
    abstainPercentage,
    barChartData,
    pieChartData,
    totalPercentage: totalPercentage.toFixed(2) // For debugging
  };
};

// Custom colors for pie chart
const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#eb2f96'];
const ABSTAIN_COLOR = '#8c8c8c'; // Gray color for abstains

function ElectionsResultsId() {
    const { user, token } = useAuthContext();
    const { id } = useParams();
    const { data, isLoading, isError, refetch } = useFetchElectionResults(token, id);
    const { data: electionStat, isError: electionStatError, isLoading: electionStatLoading, refetch: electionStatRefetch } 
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

    // Process each position's results, passing votes_cast for abstain calculation
    const processedResults = results.map(position => ({
        ...position,
        ...processPositionResults(position.candidates, election.votes_cast)
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
                    title={
                        <Row>
                            <Col span={18}>{position.position_name}</Col>
                            <Col span={6}>
                                <Text type="secondary">
                                    Total votes: {position.totalWithAbstains} 
                                    {position.abstains > 0 ? ` (including ${position.abstains} abstains)` : ''}
                                </Text>
                            </Col>
                        </Row>
                    }
                    style={{ marginBottom: 24 }}
                >
                    <Row gutter={16}>
                        <Col span={10}>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={position.barChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip 
                                        formatter={(value, name, props) => {
                                            const entry = props.payload;
                                            return [`${value} votes (${entry.percentage}%)`, name];
                                        }}
                                    />
                                    <Legend />
                                    <Bar 
                                        dataKey="votes" 
                                        name="Votes" 
                                        fill="#1890ff"
                                        // Color abstains differently
                                        //fill={(entry) => entry.name === 'Abstains' ? ABSTAIN_COLOR : '#1890ff'} 
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Col>
                        <Col span={7}>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={position.pieChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="votes"
                                    >
                                        {position.pieChartData.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={entry.isAbstain ? ABSTAIN_COLOR : COLORS[index % COLORS.length]} 
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value, name, props) => {
                                            const item = props.payload;
                                            return [`${value} votes (${item.percentage}%)`, item.name];
                                        }}
                                    />
                                    <Legend 
                                        formatter={(value, entry) => {
                                            const item = entry.payload;
                                            return `${item.name} (${item.percentage}%)`;
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </Col>
                        <Col span={7}>
                            <Card 
                                type="inner" 
                                title="Results" 
                                extra={position.totalPercentage === '100.00' ? 
                                    <Text type="success">100% Total</Text> : 
                                    <Text>{position.totalPercentage}% Total</Text>}
                            >
                                {position.totalVotes === 0 && position.abstains === 0 ? (
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
                                        
                                        {/* Add Abstains Card */}
                                        {position.abstains > 0 && (
                                            <Card 
                                                type="inner"
                                                title="Abstains"
                                                style={{ backgroundColor: '#f5f5f5' }}
                                            >
                                                <Row>
                                                    <Col span={12}>
                                                        <Text strong>{position.abstains} abstain{position.abstains !== 1 ? 's' : ''}</Text>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Text type="secondary">{position.abstainPercentage}%</Text>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        )}
                                    </Space>
                                )}
                            </Card>
                        </Col>
                    </Row>
                </Card>
            ))}

            {/* Abstains by Position Section */}
            <Divider orientation="left">
                <Title level={3}>
                    <BarChartOutlined style={{ marginRight: 12, color: '#1890ff' }} />
                    Abstains by Position
                </Title>
            </Divider>
            <Card>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart 
                        data={processedResults.map(position => ({
                            name: position.position_name,
                            abstains: position.abstains,
                            percentage: position.abstainPercentage,
                            totalVotes: position.totalWithAbstains
                        }))}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                            formatter={(value, name, props) => {
                                const entry = props.payload;
                                return [
                                    name === "abstains" 
                                        ? `${value} abstains (${entry.percentage}%)` 
                                        : value,
                                    name
                                ];
                            }}
                        />
                        <Legend />
                        <Bar dataKey="abstains" fill="#faad14" name="Abstains" />
                    </BarChart>
                </ResponsiveContainer>
                
                <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
                    {processedResults.map(position => (
                        <Row key={position.position_id} gutter={16}>
                            <Col span={8}>
                                <Text strong>{position.position_name}</Text>
                            </Col>
                            <Col span={8}>
                                <Text>
                                    {position.abstains} abstain{position.abstains !== 1 ? 's' : ''}
                                </Text>
                            </Col>
                            <Col span={8}>
                                <Text>
                                    {position.abstainPercentage}% of total votes
                                </Text>
                            </Col>
                        </Row>
                    ))}
                </Space>
            </Card>

            {electionStat && <ElectionStatistics electionStat={electionStat} />}
        </div>
    );
}

export default ElectionsResultsId;