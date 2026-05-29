import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import type { FieldProps, FormikHelpers } from 'formik'; 
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
// IMPORT NOVÉHO KONTEXTU
import { useAlertToast } from '../context/AlertToastContext'; 
import '../styles/componentsStyles/AuthForm.scss';

interface AuthValues {
  email: string;
  password: string;
  confirmPassword: string; 
  name: string;
  username: string;
  birthDate: Date | null;
}

interface AuthFormProps {
  isLogin: boolean;
  toggleAuth: () => void;
}

const BirthdaySelects = ({ form, field }: FieldProps) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const [partialDate, setPartialDate] = useState(() => {
    if (field.value instanceof Date) {
      return {
        d: field.value.getDate().toString(),
        m: months[field.value.getMonth()],
        y: field.value.getFullYear().toString()
      };
    }
    return { d: '', m: '', y: '' };
  });

  const handleSelectChange = (type: 'd' | 'm' | 'y', value: string) => {
    const newPartial = { ...partialDate, [type]: value };
    setPartialDate(newPartial);

    if (newPartial.d && newPartial.m && newPartial.y) {
      const monthIndex = months.indexOf(newPartial.m);
      const newDate = new Date(parseInt(newPartial.y), monthIndex, parseInt(newPartial.d), 12, 0, 0);
      
      if (newDate.getMonth() === monthIndex) {
        form.setFieldValue(field.name, newDate);
        return;
      }
    }
    form.setFieldValue(field.name, null);
  };

  return (
    <div className="birthday-select-grid">
      <select value={partialDate.d} className="auth-select" onChange={(e) => handleSelectChange('d', e.target.value)}>
        <option value="" disabled>Day</option>
        {days.map(d => <option key={d} value={d.toString()}>{d}</option>)}
      </select>
      
      <select value={partialDate.m} className="auth-select" onChange={(e) => handleSelectChange('m', e.target.value)}>
        <option value="" disabled>Month</option>
        {months.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      
      <select value={partialDate.y} className="auth-select" onChange={(e) => handleSelectChange('y', e.target.value)}>
        <option value="" disabled>Year</option>
        {years.map(y => <option key={y} value={y.toString()}>{y}</option>)}
      </select>
    </div>
  );
};

const passwordValidation = Yup.string()
  .min(8, 'At least 8 characters.')
  .matches(/[A-Z]/, 'Must contain an uppercase letter.')
  .matches(/[0-9]/, 'Must contain a number.')
  .required('Required.');

const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email.').required('Required.'),
  password: passwordValidation,
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match.').required('Required.'),
  name: Yup.string().min(2, 'Too short.').required('Required.'),
  username: Yup.string().min(3, 'Too short.').required('Required.'),
  birthDate: Yup.date().nullable().required('Birth date is required.'),
});

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email.').required('Required.'),
  password: Yup.string().required('Required.'),
});

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, toggleAuth }) => {
  const navigate = useNavigate(); 
  const { login } = useAuth(); 
  const { showAlert } = useAlertToast(); // Použití nového kontextu
  const [step, setStep] = useState(1);

  useEffect(() => {
    setStep(1);
  }, [isLogin]);

  const handleSubmit = async (values: AuthValues, helpers: FormikHelpers<AuthValues>) => {
    try {
      const payload = {
        email: values.email,
        password: values.password,
        username: values.username,
        fullName: values.name, 
        birthDate: values.birthDate ? values.birthDate.toISOString().split('T')[0] : null
      };

      const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });

      // 1. Nejprve zkusíme z backendu vyždímat tělo (ideálně tam bude smysluplný text/JSON)
      let data = null;
      let responseText = "";
      try {
        responseText = await response.text();
        if (responseText) {
            data = JSON.parse(responseText);
        }
      } catch (e) {
        // Ignorujeme, prostě to nebyl JSON
      }

      if (response.ok) {
        helpers.setSubmitting(false);
        
        await login({
          token: data.token,
          username: data.username,
          role: data.role,
          registrationYear: data.registrationYear,
          fullName: data.fullName,
          id: data.id || 0,
          email: data.email || values.email
        });
        
        if (data.role === 'ROLE_ADMIN') {
          navigate('/admin');
        } else {
          navigate('/map'); 
        }
      } else {
        helpers.setSubmitting(false);

        // 2. Obsluha HTTP chyb podle statusu
        if (response.status === 404 && isLogin) {
            showAlert('This email does not exist.', 'error');
            return;
        }

        if (response.status === 401 || response.status === 403) {
            showAlert('Invalid email or password.', 'error');
            return;
        }

        // 3. Obsluha chyb z případného JSON těla (tvůj původní kód)
        if (data && typeof data === 'object') {
            if (data.message && data.message.toLowerCase().includes("email")) {
                showAlert('This email is already registered.', 'error');
            } else if (data.email) {
                showAlert(data.email, 'error');
            } else {
                helpers.setErrors(data);
            }
        } else {
            // Pokud tu nemáme JSON, ale máme text, ukážeme ten (jinak fallback)
            showAlert(responseText || `Authentication failed (Error ${response.status})`, 'error');
        }
      }
    } catch (error) {
      // Sem to spadne JEDINĚ TEHDY, pokud backend vůbec neběží (např. spadne server)
      console.error(error);
      showAlert('Could not connect to the server. Please check if backend is running.', 'error');
      helpers.setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-header">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{isLogin ? 'Please enter your details to continue' : 'Join our community of travelers'}</p>
        </div>
        <div className="auth-toggle">
          <button type="button" className={isLogin ? 'active' : ''} onClick={() => !isLogin && toggleAuth()}>Log In</button>
          <button type="button" className={!isLogin ? 'active' : ''} onClick={() => isLogin && toggleAuth()}>Sign Up</button>
        </div>
        
        <Formik<AuthValues>
          initialValues={{ email: '', password: '', confirmPassword: '', name: '', username: '', birthDate: null }}
          validationSchema={isLogin ? LoginSchema : SignupSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldTouched, errors, values, touched }) => (
            <Form className="auth-form">
              <AnimatePresence mode="wait">
                {(isLogin || step === 1) && (
                  <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="form-body">
                    <div className="input-group">
                      <label>Email Address</label>
                      <Field name="email" type="email" placeholder="email@example.com" className={errors.email && touched.email ? 'input-error' : ''} />
                      <ErrorMessage name="email" component="span" className="error-text" />
                    </div>
                    <div className="input-group">
                      <label>Password</label>
                      <Field name="password" type="password" placeholder="••••••••" className={errors.password && touched.password ? 'input-error' : ''} />
                      <ErrorMessage name="password" component="span" className="error-text" />
                    </div>
                    {!isLogin && (
                      <div className="input-group">
                        <label>Confirm Password</label>
                        <Field name="confirmPassword" type="password" placeholder="••••••••" className={errors.confirmPassword && touched.confirmPassword ? 'input-error' : ''} />
                        <ErrorMessage name="confirmPassword" component="span" className="error-text" />
                      </div>
                    )}
                    {isLogin ? (
                      <button type="submit" disabled={isSubmitting} className="submit-btn">
                        {isSubmitting ? "Logging in..." : "Log In"}
                      </button>
                    ) : (
                      <button type="button" className="submit-btn" onClick={async () => {
                        setFieldTouched('email', true); setFieldTouched('password', true); setFieldTouched('confirmPassword', true);
                        if (!errors.email && !errors.password && !errors.confirmPassword && values.email && values.password && values.confirmPassword) {
                          setStep(2);
                        }
                      }}>Continue</button>
                    )}
                  </motion.div>
                )}
                
                {!isLogin && step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="form-body">
                    <div className="input-group">
                      <label>Full Name</label>
                      <Field name="name" placeholder="John Doe" className={errors.name && touched.name ? 'input-error' : ''} />
                      <ErrorMessage name="name" component="span" className="error-text" />
                    </div>
                    <div className="input-group">
                      <label>Username</label>
                      <Field name="username" placeholder="john_explorer" className={errors.username && touched.username ? 'input-error' : ''} />
                      <ErrorMessage name="username" component="span" className="error-text" />
                    </div>
                    <div className="input-group">
                      <label>Date of Birth</label>
                      <Field name="birthDate" component={BirthdaySelects} />
                      <ErrorMessage name="birthDate" component="span" className="error-text" />
                    </div>
                    <div className="btn-row" style={{ display: 'flex', gap: '10px' }}>
                      <button type="button" className="submit-btn" style={{ background: '#f1f5f9', color: '#64748b' }} onClick={() => setStep(1)}>Back</button>
                      <button type="submit" disabled={isSubmitting} className="submit-btn">
                        {isSubmitting ? "Creating..." : "Create Account"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="footer-text">
                {isLogin ? (
                  <p>Don't have an account? <button type="button" onClick={toggleAuth}>Sign Up</button></p>
                ) : (
                  <p>Already have an account? <button type="button" onClick={toggleAuth}>Log In</button></p>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div className="auth-right"></div>
    </div>
  );
};

export default AuthForm;