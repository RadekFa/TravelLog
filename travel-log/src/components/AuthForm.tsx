import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../styles/componentsStyles/AuthForm.scss';

// Base validation schema
const BaseSchema = {
  email: Yup.string()
    .email('Invalid email format.')
    .required('Email is required.'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters.')
    .required('Password is required.'),
};

const LoginSchema = Yup.object(BaseSchema);

const SignupSchema = Yup.object({
  ...BaseSchema,
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters.')
    .required('Name is required.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match.')
    .required('Password confirmation is required.'),
});

interface AuthFormProps {
  isLogin: boolean;
  onSubmit: (values: any, actions: any) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, onSubmit }) => {
  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        name: '',
        confirmPassword: '',
      }}
      validationSchema={isLogin ? LoginSchema : SignupSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, errors, touched, submitCount }) => {
        const hasError = (field: string) =>
          errors[field as keyof typeof errors] &&
          (touched[field as keyof typeof touched] || submitCount > 0);

        const fieldClass = (field: string) =>
          `input-group ${hasError(field) ? 'shake-animation' : ''}`;

        const inputErrorClass = (field: string) =>
          hasError(field) ? 'error-field' : '';

        return (
          <Form className="auth-form">

            {!isLogin && (
              <div className={fieldClass('name')}>
                <label>Full Name</label>
                <Field
                  name="name"
                  placeholder="John Doe"
                  className={inputErrorClass('name')}
                />
                <ErrorMessage name="name" component="span" className="error-text" />
              </div>
            )}

            <div className={fieldClass('email')}>
              <label>Email Address</label>
              <Field
                name="email"
                type="email"
                placeholder="email@example.com"
                className={inputErrorClass('email')}
              />
              <ErrorMessage name="email" component="span" className="error-text" />
            </div>

            <div className={fieldClass('password')}>
              <label>Password</label>
              <Field
                name="password"
                type="password"
                placeholder="••••••••"
                className={inputErrorClass('password')}
              />
              <ErrorMessage name="password" component="span" className="error-text" />
            </div>

            {!isLogin && (
              <div className={fieldClass('confirmPassword')}>
                <label>Confirm Password</label>
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className={inputErrorClass('confirmPassword')}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="span"
                  className="error-text"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-btn"
            >
              {isSubmitting ? (
                <span className="loader"></span>
              ) : isLogin ? (
                'Log In'
              ) : (
                'Create Account'
              )}
            </button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AuthForm;
