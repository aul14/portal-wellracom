import {
    Card,
    CardHeader,
    CardBody,
    Container,
    Row,
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Col
} from "reactstrap";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import Header from "components/Headers/Header.js";
import ErrorAlerts from 'components/alerts/ErrorAlerts.js';
import axiosInstance from 'app/axiosInstance.js';
import Select from 'react-select';

const Create = () => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [file, setFile] = useState("");
    const [dateStart, setDateStart] = useState("");
    const [dateEnd, setDateEnd] = useState("");
    const [telegramId, setTelegramId] = useState("");
    const [preview, setPreview] = useState("");
    const [haveCuti, setHaveCuti] = useState("");
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axiosInstance.get(`${baseUrl}/roles`);
                setRoles(response.data.data);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

        fetchRoles();
    }, []);

    const loadImage = (e) => {
        const image = e.target.files[0];
        setFile(image);
        setPreview(URL.createObjectURL(image));
    }

    const handleSelectChange = (selectedOption) => {
        setSelectedRole(selectedOption);
    };

    const selectOptions = roles.map((role) => ({
        value: role.id,
        label: role.name,
    }));

    const saveUser = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("file", file)
            formData.append("name", name)
            formData.append("username", username)
            formData.append("email", email)
            formData.append("password", password)
            formData.append("confPassword", confPassword)
            formData.append("roleId", selectedRole && selectedRole.value)
            formData.append("dateStart", dateStart)
            formData.append("dateEnd", dateEnd)
            formData.append("telegramId", telegramId)
            formData.append("haveCuti", haveCuti)

            await axiosInstance.post(`${baseUrl}/users`, formData, {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            })
            navigate('/admin/users');
        } catch (error) {
            if (error.response.data.status === 'error' && Array.isArray(error.response.data.msg)) {
                setErrors(error.response.data.msg);
            } else {
                setErrors([{ message: error.response.data.msg }]);
            }

        }
    }
    return (
        <>
            <Header />
            <Container className="mt--8" fluid>
                <Row>
                    <div className="col my-2">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <h3 className="mb-0">Form Add User</h3>
                            </CardHeader>
                            <CardBody>
                                <ErrorAlerts errors={errors} />
                                <Form onSubmit={saveUser}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <FormGroup row>
                                                <Label sm={4}>Name <span className="text-danger">*</span></Label>
                                                <Col sm={8}>
                                                    <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={4}>Username <span className="text-danger">*</span></Label>
                                                <Col sm={8}>
                                                    <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={4}>Email <span className="text-danger">*</span></Label>
                                                <Col sm={8}>
                                                    <Input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={4}>Password <span className="text-danger">*</span></Label>
                                                <Col sm={8}>
                                                    <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={4}>Confirm Password <span className="text-danger">*</span></Label>
                                                <Col sm={8}>
                                                    <Input type="password" placeholder="Confirm Password" value={confPassword} onChange={(e) => setConfPassword(e.target.value)} />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={4}></Label>
                                                <Col sm={8}>
                                                    <div className="custom-control custom-checkbox">
                                                        <Input
                                                            className="custom-control-input"
                                                            id="customCheck"
                                                            checked={haveCuti}
                                                            onChange={(e) => setHaveCuti(e.target.checked)}
                                                            type="checkbox" />
                                                        <Label
                                                            className="custom-control-label"
                                                            htmlFor="customCheck">
                                                            Have a cuti?
                                                        </Label>
                                                    </div>
                                                </Col>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-6">
                                            <FormGroup row>
                                                <Label sm={4}>Role <span className="text-danger">*</span></Label>
                                                <Col sm={8}>
                                                    <Select
                                                        options={selectOptions}
                                                        value={selectedRole}
                                                        onChange={handleSelectChange}
                                                        placeholder="Select a role..."
                                                        isClearable
                                                    />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={4}>Start Date</Label>
                                                <Col sm={8}>
                                                    <Input type="date" placeholder="Start Date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={4}>End Date</Label>
                                                <Col sm={8}>
                                                    <Input type="date" placeholder="End Date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={4}>Telegram ID</Label>
                                                <Col sm={8}>
                                                    <Input type="text" placeholder="Telegram ID" value={telegramId} onChange={(e) => setTelegramId(e.target.value)} />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={4}>Image User</Label>
                                                <Col sm={8}>
                                                    <Input
                                                        type="file" onChange={loadImage}
                                                    />
                                                </Col>
                                            </FormGroup>
                                            {preview ? (
                                                <img src={preview} width={100} alt='Preview Image' className="img img-preview img-fluid" />
                                            ) : null}
                                        </div>
                                    </div>

                                    <FormGroup row>
                                        <Col sm={6}>
                                            <Button type='submit' color='primary' size='sm'>Save</Button>
                                            <Link className='btn btn-sm btn-danger' to={"/admin/users"}>Back</Link>
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                        </Card>
                    </div>
                </Row>
            </Container >
        </>
    )
}

export default Create