import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

const AddVehicle = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const [vehicleType, setVehicleType] = React.useState('');
  const [vehicleManufacturer, setVehicleManufacturer] = React.useState('');
  const [vehicleLicensePlate, setVehicleLicensePlate] = React.useState('');

  const onClose = () => {
    setOpenModal(false);
  };

  const onCreateVehicle = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Button
        className="w-100"
        variant="outline-success"
        onClick={() => setOpenModal(true)}
      >
        Add
      </Button>
      <Modal show={openModal} onHide={onClose}>
        <Modal.Header closeButton>Add</Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Vehicle Type</Form.Label>
              <Form.Control
                type="text"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Vehicle Manufacturer</Form.Label>
              <Form.Control
                type="text"
                value={vehicleManufacturer}
                onChange={(e) => setVehicleManufacturer(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Vehicle License Plate</Form.Label>
              <Form.Control
                type="text"
                value={vehicleLicensePlate}
                onChange={(e) => setVehicleLicensePlate(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={onCreateVehicle}>
            Create
          </Button>
          <Button variant="danger" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddVehicle;
