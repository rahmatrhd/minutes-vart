import React, { Component } from 'react'
import { Button, Layout } from 'antd'

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
      console.log('photoURL>> ', result.user.photoURL);
      // var token = result.credential.accessToken  // token gmail seandainya mau disimpen atau dipakai
    })
    .catch(e => {
      console.log('Gagal login pakai Gmail')
      console.log(e)
    })
  } // login gmail

  logout() {
    console.log('Logout')
    firebase.auth().signOut()
    .then(() => {
      console.log('signed out')
    })
  }

  stateChangeListener() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('Logged')
        console.log(user)
        this.props.history.push('/dashboard')
      } else {
        console.log('Not Logged')
      }
    })
  }

  componentDidMount() {
    this.stateChangeListener()
  }

  authChecker() {
    let user = firebase.auth().currentUser
    return console.log(firebase.auth().currentUser)
  }

  render() {
    return (
      <Layout>
        <Button type="primary"
        onClick={this.loginGmail}>
          Login Gmail
        </Button>
        <Button type="primary"
        onClick={this.logout}>
          Logout
        </Button>
        <Button type="primary"
        onClick={this.authChecker}>
          Auth check
        </Button>
      </Layout>
    )
  }
}

export default Login