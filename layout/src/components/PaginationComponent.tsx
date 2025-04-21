import React from 'react';
import { Row, Col, Button, Container } from 'react-bootstrap';

interface IProps {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

const PaginationComponent: React.FC<IProps> = ({
  page,
  totalPages,
  onPrevious,
  onNext,
}) => {
  return (
    <Container>
      <Row className="align-items-center justify-content-between">
        {/* Nút Previous bên trái */}
        <Col xs="auto">
          <Button onClick={onPrevious} disabled={page === 1}>
            Previous
          </Button>
        </Col>

        {/* Chữ Page X/Y ở giữa */}
        <Col className="text-center">
          <span className="fw-bold">
            Page {page} / {totalPages}
          </span>
        </Col>

        {/* Nút Next bên phải */}
        <Col xs="auto">
          <Button onClick={onNext} disabled={page === totalPages}>
            Next
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default PaginationComponent;
