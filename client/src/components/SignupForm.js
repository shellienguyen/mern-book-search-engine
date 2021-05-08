import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { createUser } from '../utils/API';
import Auth from '../utils/auth';
import { useMutation } from '@apollo/react-hooks';
import { ADD_USER } from '../utils/mutations';
import { NoUnusedFragmentsRule } from 'graphql';


const SignupForm = () => {
   // Set initial form state
   const [ userFormData, setUserFormData ] = useState({ username: '', email: '', password: '' });
   
   // Set state for form validation
   const [ validated ] = useState( false );
   
   // Set state for alert
   const [ showAlert, setShowAlert ] = useState( false );

   const [ addUser, { error } ] = useMutation( ADD_USER );
   
   const handleInputChange = ( event ) => {
      const { name, value } = event.target;

      console.log( 'SignupForm.js handleInputChange' );

      setUserFormData({ ...userFormData, [ name ]: value });

      console.log( 'name: ' + name );
      console.log( 'value: ' + value );
   };

   const handleFormSubmit = async ( event ) => {
      event.preventDefault();

      console.log( 'SignupForm.js before try' );
      console.log( 'validated: ' );
      console.log( validated );
      
      try {
         console.log( 'SignupForm.js inside try' );

         // Execute addUser mutation, pass in data from the form
         const { data } = await addUser({
            variables: { ...userFormData }
         });

         console.log( data );
         console.log( data.addUser.token );

         Auth.login( data.addUser.token );
      }
      catch ( err ) {
         console.log( 'SignupForm.js catch' );
         console.error( err );
         setShowAlert( true );
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