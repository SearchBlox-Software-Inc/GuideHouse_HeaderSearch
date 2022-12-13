import React from 'react';
import {
  Col,
  Row,
} from "reactstrap";

export default class Copyright extends React.Component{

  constructor(){
    super();
  }


  render(){
    return(
      <React.Fragment>
        <div className="container footer-container d-flex justify-content-center">
          <Row>
            <Col sm="12">
              <p className="font-class-4 font-size-12">© {new Date().getFullYear()}. All Rights Reserved. SearchBlox Software, Inc.</p>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}
