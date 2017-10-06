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
      console.log('photoURL>> ', result.user.photoURL)
      // this.registeredChecker(result.user.uid)
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
        let ref = firebase.database().ref('/users')
        ref.once('value', snapshot => {
          let checker = snapshot.hasChild(user.uid)
          if (!checker) {
            console.log('Not Registered. Registering')
            ref.child(`${user.uid}`).set({name: user.displayName})
          } else {
            console.log('Registered')
          }
        })
        this.props.history.push('/dashboard')
      } else {
        console.log('Not Logged')
      }
    })
  }

  componentWillMount() {
    this.stateChangeListener()
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
      </Layout>
    )
  }
}

export default Login