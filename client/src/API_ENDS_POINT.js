const backendDomain = process.env.REACT_APP_BACKEND_DOMAIN;

const Api = {
    register: {
        url: `${backendDomain}/api/register`,
        method: "post"
    },
    signin: {
        url: `${backendDomain}/api/signin`,
        method: "post"
    },
    userInfo: {
        url: `${backendDomain}/api/user-info`,
        method: "get"
    },
    logout_user: {
        url: `${backendDomain}/api/logout`,
        method: 'get'
    },
    getConversation:{
        url: `${backendDomain}/api/get-conversation`,
        method: 'get'
    },
    createConversation:{
        url: `${backendDomain}/api/create-conversation`,
        method: 'post'
    },
    getMessage:{
        url: `${backendDomain}/api/get-message`,
        method: 'get'
    },
    createMessage:{
        url: `${backendDomain}/api/create-message`,
        method: 'post'
    },
    searchUser:
    {
          url: `${backendDomain}/api/search`,
        method: 'post'
    },
    getUserDetails:{
         url: `${backendDomain}/api/user-info-by-id`,
        method: 'get'
    },
    editUserInfo:{
        url: `${backendDomain}/api/edit-user`,
       method: 'post'
   },
   updateSeen:{
    url: `${backendDomain}/api/update-seen`,
   method: 'post'
}


};

export default Api;
