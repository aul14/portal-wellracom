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
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from "components/Headers/Header.js";
import axiosInstance from '../../app/axiosInstance.js';

const Edit = () => {
    const [name, setName] = useState("");
    const [msg, setMsg] = useState("");
    const [visible, setVisible] = useState(true);
    const onDismiss = () => setVisible(false);
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    const { id } = useParams();

    useEffect(() => {
        const getModuleById = async () => {
            try {
                const response = await axiosInstance.get(`${baseUrl}/modules/${id}`);
                setName(response.data.data.name);

            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg)
                }
            }
        }

        getModuleById();
    }, [id])

    const editModule = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`${baseUrl}/modules/${id}`, {
                name: name,
            })
            navigate('/admin/modules');
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
                                <h3 className="mb-0">Form Edit Module</h3>
                            </CardHeader>
                            <CardBody>
                                {msg && <Alert color="danger" isOpen={visible} toggle={onDismiss}>
                                    {msg}
                                </Alert>}
                                <Form onSubmit={editModule}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <FormGroup row>
                                                <Label sm={2}>Name</Label>
                                                <Col sm={10}>
                                                    <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                                                </Col>
                                            </FormGroup>
                                        </div>
                                    </div>

                                    <FormGroup row>
                                        <Col sm={6}>
                                            <Button type='submit' color='primary' size='sm'>Save</Button>
                                            <Link className='btn btn-sm btn-danger' to={"/admin/modules"}>Back</Link>
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