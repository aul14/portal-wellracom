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
    Col,
    Alert
} from "reactstrap";
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from "components/Headers/Header.js";
import axiosInstance from '../../app/axiosInstance.js';
import Select from 'react-select';

const Edit = () => {
    const [keyName, setKeyName] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState("");
    const [msg, setMsg] = useState("");
    const [visible, setVisible] = useState(true);
    const onDismiss = () => setVisible(false);
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const { id } = useParams();


    useEffect(() => {
        const getPermissionById = async () => {
            try {
                const response = await axiosInstance.get(`${baseUrl}/permissions/${id}`);
                setKeyName(response.data.data.keyName);
                setName(response.data.data.name);
                setDescription(response.data.data.description);
                setSelectedModule(response.data.data.moduleId
                    ? { value: response.data.data.moduleId, label: response.data.data.module.name }
                    : "")

            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg)
                }
            }
        }

        const fetchModules = async () => {
            try {
                const response = await axiosInstance.get(`${baseUrl}/modules`);
                setModules(response.data.data);
            } catch (error) {
                console.error('Error fetching modules:', error);
            }
        };

        fetchModules();
        getPermissionById();
    }, [id]);

    const handleSelectChange = (selectedOption) => {
        setSelectedModule(selectedOption);
    };

    const selectOptions = modules.map((module) => ({
        value: module.id,
        label: module.name,
    }));

    const editPermission = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`${baseUrl}/permissions/${id}`, {
                keyName: keyName,
                name: name,
                description: description,
                moduleId: selectedModule && selectedModule.value
            })
            navigate('/admin/permissions');
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg)
            }
        }
    }
    return (
        <>
            <Header />
            <Container className="mt--8" fluid>
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <h3 className="mb-0">Form Edit Permission</h3>
                            </CardHeader>
                            <CardBody>
                                {msg && <Alert color="danger" isOpen={visible} toggle={onDismiss}>
                                    {msg}
                                </Alert>}
                                <Form onSubmit={editPermission}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <FormGroup row>
                                                <Label sm={3}>Key Name</Label>
                                                <Col sm={9}>
                                                    <Input type="text" placeholder="Key Name" value={keyName} onChange={(e) => setKeyName(e.target.value)} />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={3}>Name</Label>
                                                <Col sm={9}>
                                                    <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                                                </Col>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-6">
                                            <FormGroup row>
                                                <Label sm={3}>Description</Label>
                                                <Col sm={9}>
                                                    <Input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm={3}>Module</Label>
                                                <Col sm={9}>
                                                    <Select
                                                        options={selectOptions}
                                                        value={selectedModule}
                                                        onChange={handleSelectChange}
                                                        placeholder="Select a module..."
                                                        isClearable
                                                    />
                                                </Col>
                                            </FormGroup>

                                        </div>
                                    </div>

                                    <FormGroup row>
                                        <Col sm={6}>
                                            <Button type='submit' color='primary' size='sm'>Save</Button>
                                            <Link className='btn btn-sm btn-danger' to={"/admin/permissions"}>Back</Link>
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    )
}

export default Edit