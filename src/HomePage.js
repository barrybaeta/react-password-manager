import React from "react";
import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PasswordForm from "./PasswordForm";
import "./HomePage.css";
import { deletePassword, getPasswords } from "./requests";
import { observer } from "mobx-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Notification from "react-web-notifications";
function HomePage({ passwordsStore }) {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState({});
  const [notificationTitle, setNotificationTitle] = React.useState("");
  const openModal = () => {
    setOpenAddModal(true);
  };
  const closeModal = () => {
    setOpenAddModal(false);
    setOpenEditModal(false);
    getData();
  };
  const cancelAddModal = () => {
    setOpenAddModal(false);
  };
  const editPassword = contact => {
    setSelectedPassword(contact);
    setOpenEditModal(true);
  };
  const cancelEditModal = () => {
    setOpenEditModal(false);
  };
  const getData = async () => {
    const response = await getPasswords();
    passwordsStore.setPasswords(response.data);
    setInitialized(true);
  };
  const deleteSelectedPassword = async id => {
    await deletePassword(id);
    setNotificationTitle("Password deleted");
    getData();
  };
  useEffect(() => {
    if (!initialized) {
      getData();
    }
  });
  return (
    <div className="home-page">
      <h1>Password Manager</h1>
      <Modal show={openAddModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PasswordForm
            edit={false}
            onSave={closeModal.bind(this)}
            onCancelAdd={cancelAddModal}
            passwordsStore={passwordsStore}
          />
        </Modal.Body>
      </Modal>
      <Modal show={openEditModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PasswordForm
            edit={true}
            onSave={closeModal.bind(this)}
            contact={selectedPassword}
            onCancelEdit={cancelEditModal}
            passwordsStore={passwordsStore}
          />
        </Modal.Body>
      </Modal>
      <ButtonToolbar onClick={openModal}>
        <Button variant="outline-primary">Add Password</Button>
      </ButtonToolbar>
      <br />
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>URL</th>
              <th>Username</th>
              <th>Password</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {passwordsStore.passwords.map(c => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.url}</td>
                <td>{c.username}</td>
                <td>******</td>
                <td>
                  <CopyToClipboard text={c.username}>
                    <Button
                      variant="outline-primary"
                      onClick={() => setNotificationTitle("Username copied")}
                    >
                      Copy Username to Clipboard
                    </Button>
                  </CopyToClipboard>
                </td>
                <td>
                  <CopyToClipboard text={c.password}>
                    <Button
                      variant="outline-primary"
                      onClick={() => setNotificationTitle("Password copied")}
                    >
                      Copy Password to Clipboard
                    </Button>
                  </CopyToClipboard>
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    onClick={editPassword.bind(this, c)}
                  >
                    Edit
                  </Button>
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    onClick={deleteSelectedPassword.bind(this, c.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {notificationTitle ? (
        <Notification
          title={notificationTitle}
          options={{
            icon:
              "http://mobilusoss.github.io/react-web-notification/example/Notifications_button_24.png"
          }}
          onClose={() => setNotificationTitle(undefined)}
        />
      ) : null}
    </div>
  );
}
export default observer(HomePage);