import { useInfiniteQuery, useQueries, useQuery } from "@tanstack/react-query";
import { fetchCountAllDepartments, fetchElectionVoterStatus, fetchPaginatedFeedbacks, fetchPaginatedPosts, fetchPaginatedTurnouts, fetchPaginatedUsers, getAdminElectionResults, getAllCandidates, getAllElections, getAllPartylists, getAllPositions, getAllRegistered, getDepartmentById, getDepartments, getDepartmentsList, getElectionById, getElectionStatistics } from "./api";


export const useFetchDepartments = () => {
    return useQuery({
        queryKey: ['departments'],
        queryFn: () => getDepartments(),
    })
}

//elections
export const useFetchElections = (token) => {
    return useQuery({
        queryKey: ['electionCount'],
        queryFn: () => getAllElections(token),
    })
};

export const useFetchAllRegistered = (token) => {
    return useQuery({
        queryKey: ['allRegistered'],
        queryFn: () => getAllRegistered(token),
    })
}

export const useFetchElectionById = (token, id) => {
    return useQuery({
        queryKey: ['election', id],
        queryFn: () => getElectionById(token, id),
    })
}

//dashboard fetching
export const useFetchDashboard = (token) => {
    return useQueries({
        queries: [
            {
                queryKey: ['electionsData'],
                queryFn: () => getAllElections(token),
            },
            {
                queryKey: ['registeredData'],
                queryFn: () => getAllRegistered(token),
            },
            {
                queryKey: ['studentsCount'],
                queryFn: () => fetchCountAllDepartments(token),
            }
        ]
    })
}

//candidates
export const useFetchCandidates = () => {
    return useQuery({
        queryKey: ['candidates'],
        queryFn: () => getAllCandidates(),
    })
}
//positions
export const useFetchPositions = () => {
    return useQuery({
        queryKey: ['positions'],
        queryFn: () => getAllPositions(),
    })
}
//party list
export const useFetchPartyList = (token) => {
    return useQuery({
        queryKey: ['partyList'],
        queryFn: () => getAllPartylists(token),
    })
}


//departments
export const useFetchDepartmentsList = (token) => {
    return useQuery({
        queryKey: ['departmentsList'],
        queryFn: () => getDepartmentsList(token),
    })
}
export const useFetchDepartmenyById = (token, id) => {
    return useQuery({
        queryKey: ['departmentById'],
        queryFn: () => getDepartmentById(token, id),
    })
}


//get paginated posts
export const useFetchPaginatedPosts = (token, perPage) => {
    return useInfiniteQuery({
        queryKey: ['paginatedPosts', perPage],
        queryFn: ({pageParam = 1}) => fetchPaginatedPosts(token, pageParam, perPage),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
        // If there's a next page (based on last_page or next_page_url), return the next page number
        if (lastPage.pagination.current_page < lastPage.pagination.last_page) {
            return lastPage.pagination.current_page + 1;
        }
        return undefined; // No more pages to fetch
        }
    })
}

//get paginated users with search
export const useFetchStudents = (token, perPage, search) => {
    return useInfiniteQuery({
        queryKey: ['students', perPage, search],
        queryFn: ({pageParam = 1}) => fetchPaginatedUsers(token, search, pageParam, perPage),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if(lastPage.pagination.current_page < lastPage.pagination.last_page){
                return lastPage.pagination.current_page + 1;
            }
            return undefined;
        }
    })
}

//get paginated users with search
export const useFetchTurnouts = (token, id, perPage, search) => {
    return useInfiniteQuery({
        queryKey: ['turnouts', perPage, search],
        queryFn: ({pageParam = 1}) => fetchPaginatedTurnouts(token, id, search, pageParam, perPage),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if(lastPage.pagination.current_page < lastPage.pagination.last_page){
                return lastPage.pagination.current_page + 1;
            }
            return undefined;
        }
    })
}

//fetch paginated feedbacks
//get paginated users with search
export const useFetchFeedbacks = (token, id, perPage, search) => {
    return useInfiniteQuery({
        queryKey: ['feedbacks', perPage, search],
        queryFn: ({pageParam = 1}) => fetchPaginatedFeedbacks(token, id, search, pageParam, perPage),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if(lastPage.pagination.current_page < lastPage.pagination.last_page){
                return lastPage.pagination.current_page + 1;
            }
            return undefined;
        }
    })
}


//get election results 
export const useFetchElectionResults = (token, id) => {
    return useQuery({
        queryKey: ['electionResults', id],
        queryFn: () => getAdminElectionResults(token, id),
    })
}

//get election statistics
export const useFetchElectionStatistics = (token, id) =>{
    return useQuery({
        queryKey: ['electionStatistics', id],
        queryFn: () => getElectionStatistics(token, id),
    })
}



//fetch paginated voter status
export const useFetchElectionVoters = (
    token, 
    id, 
    perPage = 15, 
    search = "", 
    votingStatus = null, 
    departmentId = null, 
    sortBy = 'id', 
    sortDirection = 'asc'
) => {
    return useInfiniteQuery({
        queryKey: [
            'election-voters', 
            id, 
            perPage, 
            search, 
            votingStatus, 
            departmentId, 
            sortBy, 
            sortDirection
        ],
        queryFn: ({pageParam = 1}) => fetchElectionVoterStatus(
            token, 
            id, 
            search, 
            pageParam, 
            perPage, 
            votingStatus, 
            departmentId, 
            sortBy, 
            sortDirection
        ),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const pagination = lastPage.pagination;
            if (pagination.current_page < pagination.total_pages) {
                return pagination.current_page + 1;
            }
            return undefined;
        }
    });
};
