import Http from '../../utils/Http'
import {Constants as constant} from '../../utils/Constants'
import * as authActions from './store/actions'
import Transformer from '../../utils/Transformer'

/**
 * fetch the current logged in user
 *
 * @returns {function(*)}
 */
export function fetchUser() {
  return dispatch => {
    return Http.get(constant.FETCH_USER_API_LINK)
      .then(res => {
        const data = Transformer.fetch(res.data)
        dispatch(authActions.authUser(data))
      })
      .catch(err => {
        console.log(err)
      })
  }
}

/**
 * login user
 *
 * @param credentials
 * @returns {function(*)}
 */
export function login(credentials) {
  return dispatch => (
    new Promise((resolve, reject) => {
      Http.get('sanctum/csrf-cookie')
        .then(() => {
         // alert('i am here')
         //password_confirmation: 'secret',
         //credentials['password_confirmation'] = 'secret';
          Http.post(constant.LOGIN_API_LINK, credentials)
            .then(res => {
              const data = Transformer.fetch(res.data)
              //alert(data.accessToken)
              dispatch(authActions.authLogin(data.accessToken))
             
              return resolve()
            })
            .catch((err) => {
              const statusCode = err.response.status;
              const data = {
                error: null,
                statusCode,
              };

              if (statusCode === 422) {
                const resetErrors = {
                  errors: err.response.data.errors,
                  replace: false,
                  searchStr: '',
                  replaceStr: '',
                };
                data.error = Transformer.resetValidationFields(resetErrors);
              } else if (statusCode === 401) {
                data.error = err.response.data.message;
              }
              return reject(data);
            })
        })
    })
  )
}

export function register(credentials) {
  return dispatch => (
    new Promise((resolve, reject) => {
      Http.post(constant.REGISTER, Transformer.send(credentials))
        .then(res => {
          const data = Transformer.fetch(res.data)
          dispatch(authActions.authLogin(data.accessToken))
          return resolve()
        })
        .catch((err) => {
          const statusCode = err.response.status;
          const data = {
            error: null,
            statusCode,
          };

          if (statusCode === 422) {
            const resetErrors = {
              errors: err.response.data.errors,
              replace: false,
              searchStr: '',
              replaceStr: '',
            };
            data.error = Transformer.resetValidationFields(resetErrors);
          } else if (statusCode === 401) {
            data.error = err.response.data.message;
          }
          console.log(data)
          return reject(data);
        })
    })
  )
}

/**
 * logout user
 *
 * @returns {function(*)}
 */
export function logout() {
  return dispatch => {
    return Http.post(constant.LOGOUT)
      .then(() => {
        dispatch(authActions.authLogout())
      })
      .catch(err => {
        console.log(err)
      })
  }
}


/**
 * Request reset password link
 */
export function requestPasswordLink(data){
    return Http.post('password/email', data);
}


/**
 * Request reset password link
 */
export function resetPassword(data){
    return Http.post('password/reset', data);
}