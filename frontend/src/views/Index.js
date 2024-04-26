import { useState } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";


import Header from "components/Headers/Header.js";

import { Calendar, Whisper, Popover, Badge } from 'rsuite';
import 'rsuite/dist/rsuite.css';

function getTodoList(date) {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  if (day === 10 && month === 3 && year === 2024) {
    return [
      { time: '10:30 am', title: 'Book mobil by Aul' },
      { title: 'Nana Cuti' }
    ];
  } else if (day === 15 && month === 3 && year === 2024) {
    return [
      { time: '09:30 pm', title: 'Products Introduction Meeting' },
      { time: '12:30 pm', title: 'Client entertaining' },
      { time: '02:00 pm', title: 'Product design discussion' },
      { time: '05:00 pm', title: 'Product test and acceptance' },
      { time: '06:30 pm', title: 'Reporting' },
      { time: '10:00 pm', title: 'Going home to walk the dog' },
      { title: 'Aul Cuti' }
    ];
  } else {
    return [];
  }

}

const Index = (props) => {
  function renderCell(date) {
    const list = getTodoList(date);
    const displayList = list.filter((item, index) => index < 2);

    if (list.length) {
      const moreCount = list.length - displayList.length;
      const moreItem = (
        <li>
          <Whisper
            placement="top"
            trigger="click"
            speaker={
              <Popover>
                {list.map((item, index) => (
                  <p key={index}>
                    {item.time != null ? <b>{item.time} -</b> : null}  <b>{item.title}</b>
                  </p>
                ))}
              </Popover>
            }
          >
            <a>{moreCount} more</a>
          </Whisper>
        </li>
      );

      return (
        <ul className="calendar-todo-list">
          {displayList.map((item, index) => (
            <li key={index}>
              <Badge />  {item.time != null ? <b>{item.time} -</b> : null}  <b>{item.title}</b>
            </li>
          ))}
          {moreCount ? moreItem : null}
        </ul>
      );
    }

    return null;
  }
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card>
              <Calendar bordered renderCell={renderCell} />
            </Card>
          </Col>
        </Row>

      </Container>
    </>
  );
};

export default Index;
