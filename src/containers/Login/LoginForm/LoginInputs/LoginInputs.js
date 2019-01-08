export const RegisterInputs = {
        firstName: {
            html: { 
                type: 'text',
                placeholder: 'Your First Name',
            },
            label: 'First Name',
            value: '',
            validation: {
                required: true,
                errMessage: ''
            }
        },
        lastName: {
            html: {
                type: 'text',
                placeholder: 'Your Last Name',
            },
            label: 'Last Name',
            value: '',
            validation: {
                required: true,
                errMessage: ''
            }
        },
        age: {
            html: {
                type: 'number',
                min: '18',
                max: '120',
            },
            label: 'Your Age',
            value: '',
            validation: {
                required: true,
                errMessage: '',
            }
        },
        location: {
            type: 'location',
            value: '',
            validation: {
                required: true,
                errMessage: ''
            }
    
        },
        email: {
            html: { 
                type: 'email',
                placeholder: 'Your Email Address',
            },
            label: 'Email',
            value: '',
            validation: {
                required: true,
                errMessage: ''
            }
        },
        password: {
            html: { 
                type: 'password',
            },
            label: 'Password',
            value: '',
            validation: {
                required: true,
                errMessage: '',
                minLength: 6
            }
    }
    
}

export const LoginInputs = {
        email: {
            html: { 
                type: 'email',
                placeholder: 'Your Email Address',
            },
            label: 'Email',
            value: '',
            validation: {
                required: true,
                errMessage: ''
            }
        },
        password: {
            html: { 
                type: 'password',
            },
            label: 'Password',
            value: '',
            validation: {
                required: true,
                errMessage: '',
                minLength: 6
            }
    }
    
}




export const RevisionInputs = {
    firstName: {
        html: { 
            type: 'text',
            placeholder: 'Your First Name',
        },
        label: 'First Name',
        value: '',
        validation: {
            required: true,
            errMessage: ''
        }
    },
    lastName: {
        html: {
            type: 'text',
            placeholder: 'Your Last Name',
        },
        label: 'Last Name',
        value: '',
        validation: {
            required: true,
            errMessage: ''
        }
    },
    age: {
        html: {
            type: 'number',
            min: '18',
            max: '120',
        },
        label: 'Your Age',
        value: '',
        validation: {
            required: true,
            errMessage: '',
        }
    },
    location: {
        type: 'location',
        value: '',
        validation: {
            required: true,
            errMessage: ''
        }

    },
    email: {
        html: { 
            type: 'email',
            placeholder: 'READONLY',
        },
        label: 'Email',
        value: '',
        validation: {
            required: true,
            errMessage: ''
        }
    },

}