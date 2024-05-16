import React, { useEffect, useState } from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    Container,
    Row,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import DataTable from 'react-data-table-component';
import axiosInstance from '../../app/axiosInstance.js';
import { format } from 'date-fns'

const baseUrl = process.env.REACT_APP_API_BASE_URL;

const Tables = () => {
    const [data, setData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const token = localStorage.getItem('token').replace(/["']/g, "");

    useEffect(() => {
        fetchData();
    }, [search, perPage, currentPage]);

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get(`${baseUrl}/modules/query`, {
                params: {
                    draw: currentPage,
                    start: (currentPage - 1) * perPage,
                    length: perPage,
                    search: search,
                    order: 'asc'
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const json = response.data;
            setData(json.data);
            setTotalRows(json.recordsTotal);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1); // Reset to the first page on search
    };

    const handlePerPageChange = (newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page); // Reset to the first page on entries per page change
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Updated At',
            selector: row => format(new Date(row.updatedAt), 'dd/MM/yyyy HH:ii'),
            sortable: true
        },
        // Add more columns as needed
    ];

    return (
        <>
            <Header />
            {/* Page content */}
            <Container className="mt--8" fluid>
                {/* Table */}
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <h3 className="mb-0">List Modules</h3>
                            </CardHeader>
                            <CardBody>
                                <div className="row">
                                    <div className="col-6">
                                        <button className='btn btn-primary'>Add Modules</button>
                                    </div>
                                    <div className="col-6">
                                        <div className="mb-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search..."
                                                value={search}
                                                onChange={handleSearchChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DataTable
                                    columns={columns}
                                    data={data}
                                    progressPending={loading}
                                    pagination
                                    paginationServer
                                    paginationTotalRows={totalRows}
                                    onChangeRowsPerPage={handlePerPageChange}
                                    onChangePage={handlePageChange}
                                    paginationPerPage={perPage}
                                    paginationRowsPerPageOptions={[5, 10, 20, 50]}
                                />
                            </CardBody>
                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    );
};

export default Tables;
