import React, {Component} from 'react'
// import {Button, Layout} from 'antd'

import firebase from './firebaseConfig'
import './login.css'

class Login extends Component {

  loginGmail() {
    console.log('Login pakai Gmail')
    var provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/userinfo.email')
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile')
    firebase.auth().signInWithRedirect(provider).then(result => {
      console.log('username>> ', result.user.displayName)
      console.log('email>> ', result.user.email)
      console.log('photoURL>> ', result.user.photoURL)
    })
    .catch(e => {
      console.log('Gagal login pakai Gmail')
      console.log(e)
    })
  } // login gmail

  logout() {
    console.log('Logout')
    firebase.auth().signOut().then(() => {
      console.log('signed out')
    })
  }

  registerNewUser(id, name) {
    firebase.database().ref('/users').child(id).set({ name: name })
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
            this.registerNewUser(user.uid, user.displayName)
            this.props.history.push('/dashboard')
          } else {
            console.log('Registered')
            this.props.history.push('/dashboard')
          }
        })
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
      <div style={{
        position: 'relative',
        height: '100vh'
      }}>
      <div className='blur' style={{
        position: 'relative',
        height: '100vh',
        backgroundColor: 'rgba(255,255,255,0.5)',
      }}></div>
        <div
          id='dalemnya-div'
          style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginRight: '-50%',
          transform: "translate(-50%, -50%)",
          zIndex: 10,
        }}>
          <img
            id="minutes"
            alt='logo'
            src='MainLogo.png'
            style={{
            width: 'auto',
            height: '40vh'
          }}/>
          <br/>
          <div style={{
            textAlign: 'center'
          }}>
            <button className="loginBtn loginBtn--google" onClick={this.loginGmail}>
              Login With Google
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default Login