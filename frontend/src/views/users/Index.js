import React, { useEffect, useState } from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    Container,
    Row,
    Button
} from "reactstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link } from 'react-router-dom'
import Header from "components/Headers/Header.js";
import DataTable from 'react-data-table-component';
import axiosInstance from 'app/axiosInstance.js';
import { format } from 'date-fns';
import defaultAvatar from 'assets/img/theme/user-default.png';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

const Index = () => {
    const [data, setData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchData();
    }, [search, perPage, currentPage]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`${baseUrl}/users/query`, {
                params: {
                    draw: currentPage,
                    start: (currentPage - 1) * perPage,
                    length: perPage,
                    search: search,
                    order: 'desc'
                }
            });
            const json = response.data;
            setData(json.data);
            setTotalRows(json.recordsTotal);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    const deleteData = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await axiosInstance.delete(`${baseUrl}/users/${id}`);
                fetchData();
            } catch (error) {
                console.error('Error deleting data:', error);
            }
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
            name: 'Actions',
            cell: row => (
                <div>
                    <Link to={`/admin/users/edit/${row.id}`} className='btn btn-sm btn-info' title='Edit'><i className='fa fa-edit'></i></Link>{''}
                    <Button onClick={() => deleteData(row.id)} color="danger" size="sm" title='Delete'><i className='fa fa-trash'></i></Button>
                </div>
            ),
            button: true // This flag is used to render a button component
        },
        {
            name: 'Image',
            cell: row => (
                <div>
                    <img width={50} className='img img-thumbnail img-fluid' src={row.url_avatar !== null ? row.url_avatar : defaultAvatar}></img>
                </div>
            ),
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Username',
            selector: row => row.username,
            sortable: true
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true
        },
        {
            name: 'Role',
            selector: row => row.role.name,
            sortable: true
        },
        {
            name: 'Updated At',
            selector: row => format(new Date(row.updatedAt), 'dd/MM/yyyy HH:ii'),
            sortable: true
        },
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
                                <h3 className="mb-0">List Users</h3>
                            </CardHeader>
                            <CardBody>
                                <div className="row">
                                    <div className="col-6">
                                        <Link className='btn btn-sm btn-primary' to={"/admin/users/add"}>Add User</Link>
                                    </div>
                                    <div className="col-6">
                                        <div>
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

export default Index;
