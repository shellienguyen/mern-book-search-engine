// See SignupForm.js for comments
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import Auth from '../utils/auth';
import { useMutation } from '@apollo/react-hooks';
import { LOGIN_USER } from '../utils/mutations';


const LoginForm = () => {
   const [ userFormData, setUserFormData] = useState({ email: '', password: '' });
   const [ validated ] = useState(false);
   const [ showAlert, setShowAlert ] = useState( false );
   const [ loginUser, { error }] = useMutation( LOGIN_USER );

   const handleInputChange = ( event ) => {
      const { name, value } = event.target;

      console.log( 'LoginForm.js handleInputChange' );

      setUserFormData({ ...userFormData, [ name ]: value });

      console.log( 'name: ' + name );
      console.log( 'value: ' + value );
   };

   
   const handleFormSubmit = async ( event ) => {
      event.preventDefault();

      console.log( 'LoginForm.js before try' );
      console.log( 'validated: ' );
      console.log( validated );
      
      try {
         console.log( 'LoginForm.js inside try' );
//debugger;
         const { data } = await loginUser({ variables: { ...userFormData }});

         console.log( data );
         console.log( data.login.token );

         Auth.login( data.login.token );
      }
      catch ( err ) {
         console.log( 'LoginForm.js catch' );

         console.error( err );
         //setShowAlert( true );
      };

      setUserFormData({ username: '', email: '', password: '', });
   };

   return (
      <>
         <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
            <Alert dismissible onClose={() => setShowAlert( false )} show={showAlert} variant='danger'>
               An error was detected with your login credentials!
            </Alert>

            {error && <div>An error has occurred!!  Unable to login.</div>}<br></br>

            <Form.Group>
               <Form.Label htmlFor='email'>Email</Form.Label>

               <Form.Control type='text'
                             placeholder='Your email'
                             name='email'
                             onChange={handleInputChange}
                             value={userFormData.email}
                             required />
               <Form.Control.Feedback type='invalid'>An Email Address is Required!</Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
               <Form.Label htmlFor='password'>Password</Form.Label>
               <Form.Control type='password'
                             placeholder='Your password'
                             name='password'
                             onChange={handleInputChange}
                             value={userFormData.password}
                             required />
               <Form.Control.Feedback type='invalid'>A Password is Required!</Form.Control.Feedback>
            </Form.Group>

            <Button disabled={!( userFormData.email && userFormData.password )}
                    type='submit'
                    variant='success'>
               Submit
           </Button>
         </Form>
      </>
   );
};


export default LoginForm;