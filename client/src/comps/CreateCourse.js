/**
 * CreateCourse.js
 * This component provides the 'Create Course' screen by rendering a
 * form that allows a user to create a new course. The component also
 * renders a 'Create Course' button that when clicked sends a
 * POST request to the REST API's /api/courses route. This component
 * also renders a 'Cancel' button that returns the user to the default
 * route (i.e. the list of courses).
 */

import React, { Component } from 'react';
import Form from './Form';

export default class CreateCourse extends Component {
  state = {
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
    userId: '',
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    errors: [],
  };

  /**
   * Save user data in the React State.
   */
  componentDidMount() {
    const { context } = this.props;
    this.setState(() => {
      return {
        userId: context.authenticatedUser.id,
        firstName: context.authenticatedUser.firstName,
        lastName: context.authenticatedUser.lastName,
      };
    });
  }

  render() {
    const { errors } = this.state;

    return (
      <div className='bounds course--detail'>
        <h1>Create Course</h1>
        <div>
          <Form
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText='Create Course'
            elements={() => (
              <React.Fragment>
                <div className='grid-66'>
                  <div className='course--header'>
                    <h4 className='course--label'>Course</h4>
                    <div>
                      <input
                        id='title'
                        name='title'
                        type='text'
                        className='input-title course--title--input'
                        onChange={this.change}
                        placeholder='Course title...'
                      />
                    </div>
                    <p>By {this.state.firstName + ' ' + this.state.lastName}</p>
                  </div>
                  <div className='course--description'>
                    <div>
                      <textarea
                        id='description'
                        name='description'
                        type='text'
                        onChange={this.change}
                        placeholder='Course description...'
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className='grid-25 grid-right'>
                  <div className='course--stats'>
                    <ul className='course--stats--list'>
                      <li className='course--stats--list--item'>
                        <h4>Estimated Time</h4>
                        <div>
                          <input
                            id='estimatedTime'
                            name='estimatedTime'
                            type='text'
                            className='course--time--input'
                            onChange={this.change}
                            placeholder='Hours'
                          />
                        </div>
                      </li>
                      <li className='course--stats--list--item'>
                        <h4>Materials Needed</h4>
                        <div>
                          <textarea
                            id='materialsNeeded'
                            name='materialsNeeded'
                            onChange={this.change}
                            placeholder='List materials...'
                          ></textarea>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </React.Fragment>
            )}
          />
        </div>
      </div>
    );
  }

  /**
   * Process changes to activity
   */
  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value,
      };
    });
  };

  /**
   * Process submitting data
   */
  submit = () => {
    const { context } = this.props;
    const authUser = context.authenticatedUser;

    const emailAddress = authUser.emailAddress;
    const password = authUser.password;

    const {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      userId,
      errors,
    } = this.state;

    const course = {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      userId,
      errors,
    };

    context.data
      .createCourse(emailAddress, password, course)
      .then((errors) => {
        if (errors.length) {
          this.setState({ errors });
        } else {
          console.info('The new course has been created.');
          this.props.history.push('/courses');
        }
      })
      .catch((err) => {
        console.error(err);
        this.props.history.push('/error');
      });
  };

  // Help abort current operation
  cancel = () => {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    this.props.history.push(from);
  };
}
