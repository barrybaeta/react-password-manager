import React from "react";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import * as yup from "yup";
import PropTypes from "prop-types";
import { addPassword, getPasswords, editPassword } from "./requests";
import Notification from "react-web-notifications";
const schema = yup.object({
  name: yup.string().required("Name is required"),
  url: yup
    .string()
    .url()
    .required("URL is required"),
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required")
});
function PasswordForm({
  edit,
  onSave,
  contact,
  onCancelAdd,
  onCancelEdit,
  passwordsStore
}) {
  const [notificationTitle, setNotificationTitle] = React.useState("");
  const handleSubmit = async evt => {
    const isValid = await schema.validate(evt);
    if (!isValid) {
      return;
    }
    if (!edit) {
      await addPassword(evt);
      setNotificationTitle("Password added");
    } else {
      await editPassword(evt);
      setNotificationTitle("Password edited");
    }
    const response = await getPasswords();
    passwordsStore.setPasswords(response.data);
    onSave();
  };
  return (
    <>
      <Formik
        validationSchema={schema}
        onSubmit={handleSubmit}
        initialValues={contact || {}}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          touched,
          isInvalid,
          errors
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Row>
              <Form.Group as={Col} md="12" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={values.name || ""}
                  onChange={handleChange}
                  isInvalid={touched.name && errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="12" controlId="url">
                <Form.Label>URL</Form.Label>
                <Form.Control
                  type="text"
                  name="url"
                  placeholder="URL"
                  value={values.url || ""}
                  onChange={handleChange}
                  isInvalid={touched.url && errors.url}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.url}
                </Form.Control.Feedback>
              </Form.Group>
             <Form.Group as={Col} md="12" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={values.username || ""}
                  onChange={handleChange}
                  isInvalid={touched.username && errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="12" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={values.password || ""}
                  onChange={handleChange}
                  isInvalid={touched.password && errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Button type="submit" style={{ marginRight: "10px" }}>
              Save
            </Button>
            <Button type="button" onClick={edit ? onCancelEdit : onCancelAdd}>
              Cancel
            </Button>
          </Form>
        )}
      </Formik>
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
    </>
  );
}
PasswordForm.propTypes = {
  edit: PropTypes.bool,
  onSave: PropTypes.func,
  onCancelAdd: PropTypes.func,
  onCancelEdit: PropTypes.func,
  contact: PropTypes.object,
  contactsStore: PropTypes.object
};
export default PasswordForm;