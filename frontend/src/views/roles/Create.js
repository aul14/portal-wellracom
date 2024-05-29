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
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import Header from "components/Headers/Header.js";
import ErrorAlerts from 'components/ErrorAlerts.js';
import axiosInstance from 'app/axiosInstance.js';

const Create = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    const saveRole = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post(`${baseUrl}/roles`, {
                name: name,
                description: description,
            })
            navigate('/admin/roles');
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
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <h3 className="mb-0">Form Add Role</h3>
                            </CardHeader>
                            <CardBody>
                                <ErrorAlerts errors={errors} />
                                <Form onSubmit={saveRole}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <FormGroup row>
                                                <Label sm={2}>Name</Label>
                                                <Col sm={10}>
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
                                        </div>
                                    </div>

                                    <FormGroup row>
                                        <Col sm={6}>
                                            <Button type='submit' color='primary' size='sm'>Save</Button>
                                            <Link className='btn btn-sm btn-danger' to={"/admin/roles"}>Back</Link>
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

export default Create