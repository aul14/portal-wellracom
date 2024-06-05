// reactstrap components
import {
    Card,
    CardHeader,
    Container,
    Row,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";

const Tables = () => {
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
                                        <h3 className="mb-0">List Pengajuan Cuti</h3>
                                    </div>
                                    <div className="text-right col-4">
                                        <p className="mb-0">Sisa cuti anda: 12</p>
                                    </div>
                                </div>
                            </CardHeader>

                        </Card>
                    </div>
                </Row>

            </Container>
        </>
    );
};

export default Tables;
