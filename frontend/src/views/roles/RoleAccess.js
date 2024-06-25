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
import { RefreshToken } from 'features/AuthSlice';
import { addPermission, removePermission } from 'features/PermissionSlice';

const RoleAccess = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const [modules, setModules] = useState([]);
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [checkAllStates, setCheckAllStates] = useState({});

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
                    const commonPermissions = modulePermissions.filter(permissionId => rolePermissions.includes(permissionId));
                    setSelectedPermissions(commonPermissions);
                    setModules(moduleResponse.data.data);

                    const initialCheckAllStates = {};
                    moduleResponse.data.data.forEach(module => {
                        initialCheckAllStates[module.id] = module.permissions.every(permission => commonPermissions.includes(permission.id));
                    });
                    setCheckAllStates(initialCheckAllStates);
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
    }, [id, baseUrl]);

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
            await dispatch(RefreshToken());
            const permissionKey = findPermissionKeyById(permissionId, modules);
            dispatch(addPermission(permissionKey));
        } else {
            setSelectedPermissions(prevSelected => prevSelected.filter(id => id !== permissionId));
            const detach = await axiosInstance.post(`${baseUrl}/access-control/detach_permission`, {
                roleId: parseInt(id),
                permissionId: permissionId
            });
            if (detach.data.status === 'success') {
                setSuccess([{ message: detach.data.msg }]);
            }
            await dispatch(RefreshToken());
            const permissionKey = findPermissionKeyById(permissionId, modules);
            dispatch(removePermission(permissionKey));
        }
    };

    const handleCheckAllChange = (moduleId, checked) => {
        const module = modules.find(mod => mod.id === moduleId);
        const permissionIds = module.permissions.map(permission => permission.id);

        setCheckAllStates(prevStates => ({
            ...prevStates,
            [moduleId]: checked
        }));

        if (checked) {
            const newPermissions = permissionIds.filter(id => !selectedPermissions.includes(id));
            setSelectedPermissions(prevSelected => [...prevSelected, ...newPermissions]);
            newPermissions.forEach(async (permissionId) => {
                const attach = await axiosInstance.post(`${baseUrl}/access-control/attach_permission`, {
                    roleId: parseInt(id),
                    permissionId: permissionId
                });
                if (attach.data.status === 'success') {
                    setSuccess([{ message: attach.data.msg }]);
                }
                await dispatch(RefreshToken());
                const permissionKey = findPermissionKeyById(permissionId, modules);
                dispatch(addPermission(permissionKey));
            });
        } else {
            setSelectedPermissions(prevSelected => prevSelected.filter(id => !permissionIds.includes(id)));
            permissionIds.forEach(async (permissionId) => {
                const detach = await axiosInstance.post(`${baseUrl}/access-control/detach_permission`, {
                    roleId: parseInt(id),
                    permissionId: permissionId
                });
                if (detach.data.status === 'success') {
                    setSuccess([{ message: detach.data.msg }]);
                }
                await dispatch(RefreshToken());
                const permissionKey = findPermissionKeyById(permissionId, modules);
                dispatch(removePermission(permissionKey));
            });
        }
    };

    const findPermissionKeyById = (permissionId, modules) => {
        for (const module of modules) {
            const permission = module.permissions.find(p => p.id === permissionId);
            if (permission) {
                return permission.keyName;
            }
        }
        return null;
    };

    return (
        <>
            <Header />
            <Container className="mt--8" fluid>
                <Row>
                    <div className="col my-2">
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
                                                                <div className="custom-control custom-checkbox">
                                                                    <FormGroup>
                                                                        <Input
                                                                            className="custom-control-input"
                                                                            id={`checkAll${module.id}`}
                                                                            type="checkbox"
                                                                            checked={checkAllStates[module.id]}
                                                                            onChange={(e) => handleCheckAllChange(module.id, e.target.checked)}
                                                                        />
                                                                        <Label className="custom-control-label" htmlFor={`checkAll${module.id}`}>
                                                                            Check All / Uncheck All
                                                                        </Label>
                                                                    </FormGroup>
                                                                </div>
                                                                <hr />
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
