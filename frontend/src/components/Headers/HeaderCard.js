// reactstrap components
import { Card, CardBody, CardTitle, CardFooter, Container, Row, Col } from "reactstrap";
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <>
            <div className="header bg-gradient-danger pb-8 pt-md-7">
                <Container fluid>
                    <div className="header-body">
                        {/* Card stats */}
                        <Row>
                            <Col lg="6" xl="4">
                                <Card className="card-stats h-100 mb-4 mb-xl-0">
                                    <div className="d-flex justify-content-center">
                                        <img src={require("../../assets/img/icons/form-cuti.png")} className="card-img-top w-50 text-image" alt="..." />
                                    </div>
                                    <CardBody className="d-flex flex-column">
                                        <Row>
                                            <div className="col">
                                                <CardTitle
                                                    tag="h2"
                                                    className="text-uppercase text-muted mb-0"
                                                >
                                                    Form Cuti
                                                </CardTitle>
                                            </div>
                                            <Col className="col-auto">
                                                <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                                    <i className="fas fa-users" />
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                    <CardFooter>
                                        <p className="mt-3 mb-0 text-muted text-sm">
                                            <Link to="#" className="text-reset"><span>Lihat selengkapnya...</span></Link>
                                        </p>
                                    </CardFooter>
                                </Card>
                            </Col>
                            <Col lg="6" xl="4">
                                <Card className="card-stats h-100 mb-4 mb-xl-0">
                                    <div className="d-flex justify-content-center">
                                        <img src={require("../../assets/img/icons/form-rembes.png")} className="card-img-top w-50 text-image" alt="..." />
                                    </div>
                                    <CardBody className="d-flex flex-column">
                                        <Row>
                                            <div className="col">
                                                <CardTitle
                                                    tag="h2"
                                                    className="text-uppercase text-muted mb-0"
                                                >
                                                    Form Rembes
                                                </CardTitle>
                                            </div>
                                            <Col className="col-auto">
                                                <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                                                    <i className="fas fa-file" />
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                    <CardFooter>
                                        <p className="mt-3 mb-0 text-muted text-sm">
                                            <Link to="#" className="text-reset"><span>Lihat selengkapnya...</span></Link>
                                        </p>
                                    </CardFooter>
                                </Card>
                            </Col>
                            <Col lg="6" xl="4">
                                <Card className="card-stats h-100 mb-4 mb-xl-0">
                                    <div className="d-flex justify-content-center">
                                        <img src={require("../../assets/img/icons/form-booking.png")} className="card-img-top w-50 text-image" alt="..." />
                                    </div>
                                    <CardBody className="d-flex flex-column">
                                        <Row>
                                            <div className="col">
                                                <CardTitle
                                                    tag="h2"
                                                    className="text-uppercase text-muted mb-0"
                                                >
                                                    Form Booking Mobil
                                                </CardTitle>
                                            </div>
                                            <Col className="col-auto">
                                                <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                                                    <i className="fas fa-car" />
                                                </div>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                    <CardFooter>
                                        <p className="mt-3 mb-0 text-muted text-sm">
                                            <Link to="#" className="text-reset"><span>Lihat selengkapnya...</span></Link>
                                        </p>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>
        </>
    );
};

export default Header;
