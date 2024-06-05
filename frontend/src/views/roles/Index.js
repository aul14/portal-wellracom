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
import { hasPermission } from 'features/PermissionUtils';
import { useSelector } from 'react-redux';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

const Index = () => {
    const [data, setData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const userPermissions = useSelector(state => state.permissions.permissions);

    useEffect(() => {
        fetchData();
    }, [search, perPage, currentPage]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`${baseUrl}/roles/query`, {
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
                await axiosInstance.delete(`${baseUrl}/roles/${id}`);
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
                    {hasPermission(userPermissions, 'edit-role') && (
                        <Link to={`/admin/roles/edit/${row.id}`} className='btn btn-sm btn-info' title='Edit'><i className='fa fa-edit'></i></Link>
                    )}
                    {hasPermission(userPermissions, 'delete-role') && (
                        <Button onClick={() => deleteData(row.id)} color="danger" size="sm" title='Delete'><i className='fa fa-trash'></i></Button>
                    )}
                    {hasPermission(userPermissions, 'manage-role-access') && (
                        <Link to={`/admin/roles/role-access/${row.id}`} className='btn btn-sm btn-warning' title='Role Access'><i className='fa fa-key'></i></Link>
                    )}
                </div>
            ),
            button: true,
            width: "115px"
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Description',
            selector: row => row.description,
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
                                <h3 className="mb-0">List Roles</h3>
                            </CardHeader>
                            <CardBody>
                                <div className="row">
                                    <div className="col-6">
                                        {hasPermission(userPermissions, 'create-role') && (
                                            <Link className='btn btn-sm btn-primary' to={"/admin/roles/add"}>Add Roles</Link>
                                        )}
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
