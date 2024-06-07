// reactstrap components
import {
  Button,
  Alert,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col,
} from "reactstrap";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LoginUser, reset } from 'features/AuthSlice';
import { setPermissions } from 'features/PermissionSlice';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(true);
  const onDismiss = () => setVisible(false);
  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isSuccess || user) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token.replace(/["']/g, ""));
          const permissions = decodedToken.data.role.permissions.map(permission => permission.keyName);
          dispatch(setPermissions(permissions));
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
      navigate("/admin/index");
    }
    dispatch(reset());
  }, [user, isSuccess, dispatch, navigate])

  const processAuth = async (e) => {
    e.preventDefault();
    dispatch(LoginUser({ username, password }));
  }

  return (
    <>
      <Col lg="5" md="7">
        <Card className="shadow border-0">
          <CardHeader className="bg-transparent pb-1">
            <div className="text-muted text-center mt-2">
              <h4>Login</h4>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-3">
            <Form onSubmit={processAuth} role="form">
              {isError && <Alert color="danger" isOpen={visible} toggle={onDismiss}>
                {message}
              </Alert>}
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoFocus
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              {/* <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id=" customCheckLogin"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor=" customCheckLogin"
                >
                  <span className="text-muted">Remember me</span>
                </label>
              </div> */}
              <div className="text-center">
                <Button className="mt-3" color="primary">
                  {isLoading ? 'Loading...' : "Login"}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Login;
