import {
    Card,
    CardHeader,
    CardBody,
    Container,
    Row,
    Col,
    UncontrolledCollapse,
    Button,
    FormGroup,
    Input,
    Label,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ErrorAlerts from 'components/alerts/ErrorAlerts.js';
import SuccessAlerts from 'components/alerts/SuccessAlerts.js';
import axiosInstance from 'app/axiosInstance.js';
import { useDispatch } from "react-redux";
import { RefreshToken } from 'features/authSlice.js';

const RoleAccess = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const [modules, setModules] = useState([]);
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [moduleResponse, roleResponse] = await Promise.all([
                    axiosInstance.get(`${baseUrl}/modules/withpermissions`),
                    axiosInstance.get(`${baseUrl}/roles/withpermissions/${id}`)
                ]);

                if (moduleResponse.data.status === 'success' && roleResponse.data.status === 'success') {
                    const modulePermissions = moduleResponse.data.data.flatMap(module => module.permissions.map(permission => permission.id));
                    const rolePermissions = roleResponse.data.data.permissions.map(permission => permission.id);
                    // Intersection of modulePermissions and rolePermissions
                    const commonPermissions = modulePermissions.filter(permissionId => rolePermissions.includes(permissionId));
                    setSelectedPermissions(commonPermissions);
                    setModules(moduleResponse.data.data)
                } else {
                    console.error("Failed to fetch module and role permissions");
                }
            } catch (error) {
                console.error("Error fetching module and role permissions:", error);
                if (error.response && error.response.data.status === 'error' && Array.isArray(error.response.data.msg)) {
                    setErrors(error.response.data.msg);
                } else {
                    setErrors([{ message: error.message }]);
                }
            }
        };

        fetchData();
    }, [id]);

    const handlePermissionChange = async (permissionId, checked) => {
        if (checked) {
            setSelectedPermissions(prevSelected => [...prevSelected, permissionId]);
            const attach = await axiosInstance.post(`${baseUrl}/access-control/attach_permission`, {
                roleId: parseInt(id),
                permissionId: permissionId
            });
            if (attach.data.status === 'success') {
                setSuccess([{ message: attach.data.msg }]);
            }
            dispatch(RefreshToken());
        } else {
            setSelectedPermissions(prevSelected => prevSelected.filter(id => id !== permissionId));
            const detach = await axiosInstance.post(`${baseUrl}/access-control/detach_permission`, {
                roleId: parseInt(id),
                permissionId: permissionId
            });
            if (detach.data.status === 'success') {
                setSuccess([{ message: detach.data.msg }]);
            }
            dispatch(RefreshToken());
        }
    };

    return (
        <>
            <Header />
            {/* Page content */}
            <Container className="mt--8" fluid>
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <h3 className="mb-0">Role Access</h3>
                            </CardHeader>
                            <CardBody>
                                <ErrorAlerts errors={errors} />
                                <SuccessAlerts success={success} />
                                <Row>
                                    {modules.map((module, index) => (
                                        <Col md={6} key={module.id}>
                                            <div id="accordionExample">
                                                <div className="card">
                                                    <div className="card-header" id={`heading${index}`}>
                                                        <h2 className="mb-0">
                                                            <Button color="link" id={`toggle${index}`} className="btn btn-link btn-block text-left">
                                                                {module.name}
                                                            </Button>
                                                        </h2>
                                                    </div>
                                                    <UncontrolledCollapse toggler={`#toggle${index}`}>
                                                        <Card>
                                                            <CardBody>
                                                                {module.permissions.length > 0 ? (
                                                                    <FormGroup>
                                                                        {module.permissions.map(permission => (
                                                                            <div key={permission.id} className="custom-control custom-checkbox mb-3">
                                                                                <Input
                                                                                    className="custom-control-input"
                                                                                    id={`customCheck${permission.id}`}
                                                                                    type="checkbox"
                                                                                    checked={selectedPermissions.includes(permission.id)}
                                                                                    onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                                                                                />
                                                                                <Label
                                                                                    className="custom-control-label"
                                                                                    htmlFor={`customCheck${permission.id}`}
                                                                                >
                                                                                    {permission.name}
                                                                                </Label>
                                                                            </div>
                                                                        ))}
                                                                    </FormGroup>
                                                                ) : (
                                                                    <p>No permissions available</p>
                                                                )}
                                                            </CardBody>
                                                        </Card>
                                                    </UncontrolledCollapse>
                                                </div>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <Link className='btn btn-sm btn-danger' to={"/admin/roles"}>Back</Link>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    );
};

export default RoleAccess;
