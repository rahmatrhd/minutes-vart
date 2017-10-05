import React, { Component } from 'react'
import { Button } from 'antd'

import firebase from './firebaseConfig'

class Login extends Component {

  loginGmail() {
    console.log('Login pakai Gmail')
    var provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/userinfo.email')
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile')
    firebase.auth().signInWithPopup(provider)
    .then(result => {
      console.log('username>> ', result.user.displayName)
      console.log('email>> ', result.user.email)
      // var token = result.credential.accessToken  // token gmail seandainya mau disimpen atau dipakai
    })
    .catch(e => {
      console.log('Gagal login pakai Gmail')
      console.log(e)
    })
  } // login gmail

  render() {
    return (
      <Button type="primary"
      onClick={this.loginGmail}>
        Login Gmail
      </Button>
    )
  }
}

export default Login