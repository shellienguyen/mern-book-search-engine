import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import Auth from '../utils/auth';
import { useMutation } from '@apollo/react-hooks';
import { ADD_USER } from '../utils/mutations';


const SignupForm = () => {
   // Set initial form state
   const [ userFormData, setUserFormData ] = useState({ username: '', email: '', password: '' });
   
   // Set state for form validation
   const [ validated ] = useState( false );
   
   // Set state for alert
   const [ showAlert, setShowAlert ] = useState( false );

   const [ addUser ] = useMutation( ADD_USER );
   
   const handleInputChange = ( event ) => {
      const { name, value } = event.target;

      setUserFormData({ ...userFormData, [ name ]: value });
   };

   const handleFormSubmit = async ( event ) => {
      event.preventDefault();
      try {
         // Execute addUser mutation, pass in data from the form
         const { data } = await addUser({
            variables: { ...userFormData }
         });

         Auth.login( data.addUser.token );
      }
      catch ( err ) {
         console.error( err );
      };

      setUserFormData({ username: '', email: '', password: '' });
   };

   return (
      <>
         {/* This is needed for the validation functionality above */}
         <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
            {/* Show alert if server response is bad */}
            <Alert dismissible onClose={() => setShowAlert( false )} show={showAlert} variant='danger'>
               An error was detected! Unable to signup!
            </Alert>

            <Form.Group>
               <Form.Label htmlFor='username'>Username</Form.Label>
               <Form.Control type='text'
                             placeholder='Your username'
                             name='username'
                             onChange={handleInputChange}
                             value={userFormData.username}
                             required />

               <Form.Control.Feedback type='invalid'>A Username is Required!</Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
               <Form.Label htmlFor='email'>Email</Form.Label>
               <Form.Control type='email'
                             placeholder='Your email address'
                             name='email'
                             onChange={handleInputChange}
                             value={userFormData.email}
                             required />

               <Form.Control.Feedback type='invalid'>An Email Address is required!</Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
               <Form.Label htmlFor='password'>Password</Form.Label>
               <Form.Control type='password'
                             placeholder='Your password'
                             name='password'
                             onChange={handleInputChange}
                             value={userFormData.password}
                             required />

               <Form.Control.Feedback type='invalid'>A Password is required!</Form.Control.Feedback>
            </Form.Group>

            <Button
               disabled={!(userFormData.username && userFormData.email && userFormData.password)}
               type='submit'
               variant='success'>
               Submit
           </Button>
         </Form>
      </>
   );
};


export default SignupForm;