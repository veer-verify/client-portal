  export const createUserFields = [
    {
      key: 'firstName',
      questionId: 1,
      questionType: 'text',
      questionOptions: [],
      hasDependent: false,
      templateOptions: {
        Label: 'First Name*',
        required: true,
      },
    },
    {
      key: 'lastName',
      questionId: 2,
      questionType: 'text',
      questionOptions: [],
      hasDependent: false,
      templateOptions: {
        Label: 'Last Name*',
        required: true,
      },
    },
    {
      key: 'userName',
      questionId: 3,
      questionType: 'text',
      questionOptions: [],
      hasDependent: false,
      templateOptions: {
        Label: 'User Name*',
        required: true,
      },
    },
    {
      key: 'emailId',
      questionId: 4,
      questionType: 'text',
      questionOptions: [],
      hasDependent: false,
      templateOptions: {
        Label: 'Email*',
        required: true,
      },
    },
    {
      key: 'roleList',
      questionId: 5,
      image: 'assets/images/icons8-info-128.png',
      title: `Member (Default): Has view-only access to the sites assigned to them.
        Site/Support Admin: Has administrative privileges for the sites assigned. Can also create and manage users within their allocated scope.
        Client Admin: Has full administrative access to all sites under their respective client account.`,
      questionType: 'select',
      multiple: true,
      questionOptions: [],
      hasDependent: false,
      templateOptions: {
        Label: 'Select Role*',
        required: true,
      },
    },
    {
      key: 'remarks',
      questionId: 6,
      questionType: 'text',
      questionOptions: [],
      hasDependent: false,
      templateOptions: {
        Label: 'Remarks',
        required: false,
      },
    }
  ];