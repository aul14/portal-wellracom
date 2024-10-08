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
import ErrorAlerts from 'components/alerts/ErrorAlerts.js';
import axiosInstance from 'app/axiosInstance.js';

const Create = () => {
    const [name, setName] = useState("");
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

    const saveCuti = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post(`${baseUrl}/modules`, {
                name: name,
            })
            navigate('/admin/modules');
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
                                <h3 className="mb-0">Form Add Cuti</h3>
                            </CardHeader>
                            <CardBody>
                                <ErrorAlerts errors={errors} />
                                <Form onSubmit={saveCuti}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <FormGroup row>
                                                <Label sm={2}>Name <span className="text-danger">*</span></Label>
                                                <Col sm={10}>
                                                    <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                                                </Col>
                                            </FormGroup>

                                        </div>
                                    </div>

                                    <FormGroup row>
                                        <Col sm={6}>
                                            <Button type='submit' color='primary' size='sm'>Save</Button>
                                            <Link className='btn btn-sm btn-danger' to={"/admin/cuti"}>Back</Link>
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