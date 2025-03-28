import React, { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { 
    Input, 
    Select, 
    Table, 
    Card, 
    Typography, 
    Space, 
    Tag, 
    Spin, 
    Tooltip
} from 'antd'
import { 
    Search, 
    Filter, 
    User, 
    CheckCircle2, 
    XCircle,
    Download,
    RefreshCw
} from 'lucide-react'
import { useFetchDepartments, useFetchElectionVoters } from '../../utils/queries';
import { useAuthContext } from '../../utils/AuthContext';
import { CSVLink } from 'react-csv';

const { Title, Text } = Typography;
const { Option } = Select;

function ElectionVoterStatus() {
    const { id } = useParams();
    const [search, setSearch] = useState('');
    const [votingStatus, setVotingStatus] = useState(null);
    const [departmentId, setDepartmentId] = useState(null);
    const { token } = useAuthContext();

    // Fetch departments and voters
    const {
        data: departmentData, 
        isLoading: depLoading, 
        isError: depError
    } = useFetchDepartments();

    const { 
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch, 
    } = useFetchElectionVoters(
        token, 
        id, 
        20, 
        search, 
        votingStatus, 
        departmentId
    );

    // Flatten voters data for table and export
    const votersData = useMemo(() => {
        return data?.pages.flatMap(page => page.voters) || [];
    }, [data]);

    // Prepare CSV export data
    const csvData = useMemo(() => {
        return votersData.map(voter => ({
            'Student ID': voter.student_id,
            'Name': voter.student_name,
            'Department': departmentData?.find(dep => dep.id === voter.department_id)?.name || 'N/A',
            'Voting Status': voter.has_voted ? 'Voted' : 'Not Voted'
        }));
    }, [votersData, departmentData]);

    // Columns for the voter status table
    const columns = [
        {
            title: 'Student ID',
            dataIndex: 'student_id',
            key: 'student_id',
            width: 150,
            sorter: (a, b) => a.student_id.localeCompare(b.student_id),
        },
        {
            title: 'Name',
            dataIndex: 'student_name',
            key: 'student_name',
            width: 250,
            render: (text, record) => (
                <Space>
                    <User size={16} className="text-gray-500" />
                    {text}
                </Space>
            ),
            sorter: (a, b) => a.student_name.localeCompare(b.student_name),
        },
        {
            title: 'Department',
            dataIndex: 'department_id',
            key: 'department_id',
            width: 200,
            render: (departmentId) => {
                const department = departmentData?.find(dep => dep.id === departmentId);
                return department ? department.name : 'N/A';
            },
            sorter: (a, b) => {
                const depA = departmentData?.find(dep => dep.id === a.department_id)?.name || '';
                const depB = departmentData?.find(dep => dep.id === b.department_id)?.name || '';
                return depA.localeCompare(depB);
            },
        },
        {
            title: 'Voting Status',
            dataIndex: 'has_voted',
            key: 'has_voted',
            width: 150,
            render: (hasVoted) => (
                hasVoted ? (
                    <Tag color="green" icon={<CheckCircle2 size={12} />}>
                        Voted
                    </Tag>
                ) : (
                    <Tag color="red" icon={<XCircle size={12} />}>
                        Not Voted
                    </Tag>
                )
            ),
            sorter: (a, b) => a.has_voted - b.has_voted,
            filters: [
                { text: 'Voted', value: true },
                { text: 'Not Voted', value: false }
            ],
            onFilter: (value, record) => record.has_voted === value,
        }
    ];

    // Handle infinite scroll
    const handleTableScroll = (event) => {
        const { target } = event;
        if (
            hasNextPage && 
            !isFetchingNextPage && 
            target.scrollTop + target.offsetHeight === target.scrollHeight
        ) {
            fetchNextPage();
        }
    };

    // Voting statistics
    const votingStats = useMemo(() => {
        const total = votersData.length;
        const voted = votersData.filter(voter => voter.has_voted).length;
        const notVoted = total - voted;
        return {
            total,
            voted,
            notVoted,
            votedPercentage: total > 0 ? ((voted / total) * 100).toFixed(2) : 0
        };
    }, [votersData]);

    return (
        <Card 
            className="shadow-lg rounded-xl"
            extra={
                <Space>
                    <Tooltip title="Refresh Data">
                        <button 
                            onClick={refetch} 
                            className="hover:bg-gray-100 p-2 rounded-full transition-all"
                        >
                            <RefreshCw size={20} className="text-gray-600" />
                        </button>
                    </Tooltip>
                    <Tooltip title="Export to CSV">
                        <CSVLink 
                            data={csvData} 
                            filename={`election-voters-${id}.csv`}
                            className="hover:bg-gray-100 p-2 rounded-full transition-all"
                        >
                            <Download size={20} className="text-gray-600" />
                        </CSVLink>
                    </Tooltip>
                </Space>
            }
        >
            <Space direction="vertical" size="large" className="w-full">
                <div className="flex justify-between items-center">
                    <Title level={3} className="flex items-center m-0">
                        <Filter size={24} className="mr-2 text-gray-600" />
                        Election Voter Status
                    </Title>
                    <div className="flex space-x-4 bg-gray-50 p-3 rounded-lg">
                        <div className="text-center">
                            <Text strong className="text-gray-600">Total Voters</Text>
                            <div className="text-2xl font-bold">{votingStats.total}</div>
                        </div>
                        <div className="text-center">
                            <Text strong className="text-green-600">Voted</Text>
                            <div className="text-2xl font-bold text-green-600">{votingStats.voted}</div>
                        </div>
                        <div className="text-center">
                            <Text strong className="text-red-600">Not Voted</Text>
                            <div className="text-2xl font-bold text-red-600">{votingStats.notVoted}</div>
                        </div>
                        <div className="text-center">
                            <Text strong className="text-blue-600">Turnout</Text>
                            <div className="text-2xl font-bold text-blue-600">{votingStats.votedPercentage}%</div>
                        </div>
                    </div>
                </div>

                <Space.Compact className="w-full">
                    <Input 
                        prefix={<Search size={16} />}
                        placeholder="Search by student name or ID"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-2/5"
                    />

                    <Select
                        placeholder="Voting Status"
                        onChange={setVotingStatus}
                        value={votingStatus}
                        className="w-1/5"
                        allowClear
                    >
                        <Option value="voted">Voted</Option>
                        <Option value="not_voted">Not Voted</Option>
                    </Select>

                    <Select
                        placeholder="Department"
                        onChange={setDepartmentId}
                        value={departmentId}
                        className="w-2/5"
                        loading={depLoading}
                        allowClear
                    >
                        {departmentData?.map(dept => (
                            <Option key={dept.id} value={dept.id}>
                                {dept.name}
                            </Option>
                        ))}
                    </Select>
                </Space.Compact>

                <Table 
                    columns={columns}
                    dataSource={votersData}
                    loading={isLoading}
                    pagination={{
                        pageSize: 20,
                        showSizeChanger: true,
                        pageSizeOptions: [10, 20, 50, 100],
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} voters`
                    }}
                    scroll={{ y: 500 }}
                    onScroll={handleTableScroll}
                    footer={() => (
                        isFetchingNextPage && (
                            <div className="text-center">
                                <Spin size="large" />
                                <Text type="secondary" className="ml-2">
                                    Loading more...
                                </Text>
                            </div>
                        )
                    )}
                    locale={{
                        emptyText: (
                            <Space direction="vertical" align="center">
                                <Text type="secondary">No voters found</Text>
                                <Text type="secondary">Try adjusting your filters</Text>
                            </Space>
                        )
                    }}
                    className="shadow-sm rounded-lg"
                />
            </Space>
        </Card>
    );
}

export default ElectionVoterStatus;