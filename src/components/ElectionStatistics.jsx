import React from 'react';
import {
    Card,
    Typography,
    Row,
    Col,
    Statistic,
    Alert,
    Divider
} from 'antd';
import {
    PieChartOutlined,
    UserOutlined,
    LineChartOutlined
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

const { Title, Text } = Typography;

function ElectionStatistics({ electionStat }) {
    if (!electionStat) return (
        <Card>
            <Alert
                message="No Statistics Available"
                description="Unable to retrieve election statistics"
                type="warning"
            />
        </Card>
    );

    // Prepare data for charts
    const departmentVoterData = electionStat.department_turnout.map(dept => ({
        name: dept.department_name,
        eligible: dept.eligible_voters,
        voted: dept.voted_count,
        turnoutPercentage: dept.department_turnout_percentage
    }));

    const votesDistributionData = electionStat.department_turnout.map(dept => ({
        name: dept.department_name,
        value: dept.votes_distribution_percentage
    }));

    // Color palette
    const COLORS = ['#1890ff', '#52c41a', '#faad14', '#eb2f96', '#722ed1'];

    return (
        <div>
            {/* Election Statistics Overview */}
            <Card
                title={
                    <Title level={3}>
                        <LineChartOutlined style={{ marginRight: 12, color: '#1890ff' }} />
                        Election Statistics
                    </Title>
                }
            >
                <Row gutter={16}>
                    <Col span={6}>
                        <Statistic
                            title="Total Eligible Voters"
                            value={electionStat.total_eligible_voters}
                            prefix={<UserOutlined />}
                        />
                    </Col>
                    <Col span={6}>
                        <Statistic
                            title="Total Votes Cast"
                            value={electionStat.total_voted}
                        />
                    </Col>
                    <Col span={6}>
                        <Statistic
                            title="Overall Turnout"
                            value={`${electionStat.overall_turnout_percentage}%`}
                        />
                    </Col>
                    <Col span={6}>
                        <Statistic
                            title="Election Type"
                            value={electionStat.election_details.election_type.name}
                        />
                    </Col>
                </Row>
            </Card>

            <Divider orientation="left">
                <Title level={4}>
                    <PieChartOutlined style={{ marginRight: 12, color: '#1890ff' }} />
                    Departmental Voting Insights
                </Title>
            </Divider>

            <Row gutter={16}>
                {/* Department Voter Stacked Bar Chart */}
                <Col span={12}>
                    <Card title="Department Voter Breakdown">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={departmentVoterData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis label={{ value: 'Number of Voters', angle: -90, position: 'insideLeft' }} />
                                <Tooltip
                                    formatter={(value, name) => {
                                        return name === 'eligible'
                                            ? [`${value} Eligible Voters`, 'Eligible']
                                            : [`${value} Votes Cast`, 'Voted'];
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="eligible" stackId="a" fill="#1890ff" />
                                <Bar dataKey="voted" stackId="a" fill="#52c41a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                {/* Votes Distribution Pie Chart */}
                <Col span={12}>
                    <Card title="Votes Distribution by Department">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={votesDistributionData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(2)}%)`}
                                >
                                    {votesDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => [`${value.toFixed(2)}%`, 'Votes']}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Detailed Department Statistics */}
            <Card
                title={
                    <Title level={4} style={{ margin: 0 }}>
                        Detailed Department Statistics
                    </Title>
                }
                style={{ marginTop: 16 }}
            >
                <Row gutter={16}>
                    {electionStat.department_turnout.map((dept, index) => (
                        <Col span={8} key={dept.department_id}>
                            <Card
                                type="inner"
                                title={dept.department_name}
                                style={{ marginBottom: 16 }}
                            >
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Statistic
                                            title="Eligible Voters"
                                            value={dept.eligible_voters}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <Statistic
                                            title="Votes Cast"
                                            value={dept.voted_count}
                                        />
                                    </Col>
                                </Row>
                                <Row gutter={16} style={{ marginTop: 16 }}>
                                    <Col span={8}>
                                        <Statistic
                                            title="Overall Turnout"
                                            value={`${dept.overall_turnout_percentage}%`}
                                            valueStyle={{ color: '#1890ff' }}
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic
                                            title="Dept. Turnout"
                                            value={`${dept.department_turnout_percentage}%`}
                                            valueStyle={{ color: '#52c41a' }}
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic
                                            title="Votes Distribution"
                                            value={`${dept.votes_distribution_percentage}%`}
                                            valueStyle={{ color: '#faad14' }}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card>
        </div>
    );
}

export default ElectionStatistics;