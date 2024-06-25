import React, { useCallback, useEffect, useState } from 'react';
import {
    Card,
    CardHeader,
    Container,
    Row,
    CardBody,
    Button,
} from "reactstrap";
// core components
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link, useLocation } from 'react-router-dom'
import Header from "components/Headers/Header.js";
import DataTable, { Media } from 'react-data-table-component';
import axiosInstance from 'app/axiosInstance.js';
import { format } from 'date-fns';
import { hasPermission } from 'features/PermissionUtils';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

const Index = () => {
    const location = useLocation();
    const userData = jwtDecode(localStorage.getItem('token').replace(/["']/g, ""));
    const [data, setData] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const userPermissions = useSelector(state => state.permissions.permissions);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            let response;
            if (hasPermission(userPermissions, 'show-all-pengajuan-cuti') && hasPermission(userPermissions, 'show-individu-pengajuan-cuti')) {
                response = await axiosInstance.get(`${baseUrl}/pengajuan-cuti/query`, {
                    params: {
                        draw: currentPage,
                        start: (currentPage - 1) * perPage,
                        length: perPage,
                        search: search,
                        order: 'desc',
                        status: 'pending'
                    }
                });
            } else if (!hasPermission(userPermissions, 'show-all-pengajuan-cuti') && hasPermission(userPermissions, 'show-individu-pengajuan-cuti')) {
                response = await axiosInstance.get(`${baseUrl}/pengajuan-cuti/query`, {
                    params: {
                        draw: currentPage,
                        start: (currentPage - 1) * perPage,
                        length: perPage,
                        search: search,
                        order: 'desc',
                        user_id: userData.data.id,
                        status: 'pending'
                    }
                });
            }
            const json = response.data;
            setData(json.data);
            setTotalRows(json.recordsTotal);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, [search, perPage, currentPage])

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
                    {hasPermission(userPermissions, 'detail-pengajuan-cuti') && (
                        <Link to={`/admin/pengajuan-cuti/detail/${row.id}`} className='btn btn-sm btn-success' title='Detail'><i className='fa fa-eye'></i></Link>
                    )}
                </div>
            ),
            button: true,
            width: "115px"
        },
        {
            name: 'Nama',
            selector: row => row.pengajuan_cuti_username,
            sortable: true
        },
        {
            name: 'Jenis Cuti',
            selector: row => row.jenis_cuti.name,
            wrap: true,
            sortable: true,
        },
        {
            name: 'File Pendukung',
            cell: row => (
                row.url_file_pendukung ? (
                    <div>
                        <img
                            width={70}
                            className='img img-thumbnail img-fluid'
                            src={row.url_file_pendukung}
                            alt="File Pendukung"
                        />
                    </div>
                ) : 'No File'
            ),
        },
        {
            name: 'Alasan Cuti',
            selector: row => row.keterangan,
            wrap: true,
            sortable: true
        },
        {
            name: 'Dari Tanggal',
            selector: row => row.tgl_awal,
            sortable: true
        },
        {
            name: 'Sampai Tanggal',
            selector: row => row.tgl_akhir,
            sortable: true
        },
        {
            name: 'Status',
            selector: row => (row.status == 'pending' ? <span className="badge badge-primary">{row.status}</span> : (row.status == 'disetujui' ? <span className="badge badge-success">{row.status}</span> : <span className="badge badge-danger">{row.status}</span>)),
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
                    <div className="col my-2">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <div className="align-items-center row">
                                    <div className="col-8">
                                        <h3 className="mb-0">List Pending</h3>
                                    </div>
                                    <div className="text-right col-4">
                                        <p className="mb-0">Sisa cuti anda: {userData.data.sisaCuti}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div className="row">
                                    <div className="col-6">
                                        {hasPermission(userPermissions, 'create-pengajuan-cuti') && (
                                            <Link className='btn btn-sm btn-primary' to={"/admin/pengajuan-cuti/add"}>Add Pengajuan Cuti</Link>
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
