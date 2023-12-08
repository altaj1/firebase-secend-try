
import './App.css';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import firebaseConfig from './firebaseConfig';
import { useState } from 'react';
import { FacebookAuthProvider } from "firebase/auth";



const app = initializeApp(firebaseConfig);
 

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSingnedIn: false,
    //newUser:false,
    name:"",
    email:"",
    password:"",
    photo:""
  })



  const googleProvider = new GoogleAuthProvider();
  const fbProvider = new FacebookAuthProvider();
  
  
  const handeSignIn =() =>{
    const auth = getAuth();
    signInWithPopup(auth, googleProvider)
    .then(res=> {
      const {displayName, photoURL,email}= res.user;
      const signedInUser ={
        isSingnedIn: true,
        name:displayName,
        email: email,
        photo:photoURL
      }
     setUser(signedInUser);
    })

    .catch( err => {
      console.log(err);
      console.log(err.message)
    })

  }

  const handelSingOut = ()=>{
    const auth = getAuth();
     signOut(auth)
     .then(res => {
     const signedOutUser ={
      isSingnedIn: false, 
      name: "",
      phot:"",
      email:"",
      error:'',
      success: false

     } 
     setUser(signedOutUser);
   })
   .catch((error) => {
     
   });
  }

  const handleBlur = (event)=>{
    debugger;
    let isFildValid =true;
    if(event.target.name === "email"){
      isFildValid = /^\S+@\S+\.\S+$/.test(event.target.value)
    }
    if(event.target.name === "password"){
      const isPasswordValid = event.target.value.length > 6;
      const passwordHasNumber = /\d{3,5}/.test(event.target.value);
      isFildValid = isPasswordValid && passwordHasNumber
    }
    if(isFildValid){
      //[...cart, newItem]
      const newUserInfo = {...user};
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo)
    }
    
  }

  const handleSubmit =(event)=>{
    //console.log(user.email, user.password)
    if(newUser && user.email && user.password){
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((res) => {
          const newUserInfo = {...user};
          newUserInfo.error = "";
          newUserInfo.success = true;
          setUser(newUserInfo);
          updateUserName(user.name)
        })
        .catch((error) => {
          const newUserInfo = {...user};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    if(!newUser && user.email && user.password){
      const auth = getAuth();
      signInWithEmailAndPassword(auth, user.email, user.password)
      .then((res) => {
        const newUserInfo = {...user};
          newUserInfo.error = "";
          newUserInfo.succes = true;
          setUser(newUserInfo);
          console.log("sign in user info", res.user);
      })
      .catch((error) => {
      const newUserInfo = {...user};
          newUserInfo.error = error.Message;
          newUserInfo.success = false;
          setUser(newUserInfo);
          
      });
  
    }
    event.preventDefault();
  }

   const handelFbSignIn = () =>{
    const auth = getAuth();
    signInWithPopup(auth, fbProvider)
    .then((result) => {
    // The signed-in user info.
    const user = result.user;
    console.log("fb User click",user);

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;

    // IdP data available using getAdditionalUserInfo(result)
    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = FacebookAuthProvider.credentialFromError(error);

    // ...
  });

   }

   const updateUserName = name =>{
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName: name
    })
    .then(() => {
      console.log('user name successfully')
    }).catch((error) => {
      console.log(error)
    });
   }
  


  return (
    <div className="App">
     this is firebaseapp
     <br />
     { user.isSingnedIn ? <button onClick={handelSingOut}>sing out</button> : <button onClick={handeSignIn}>sing in</button>
      }
      <br />
      <button onClick={handelFbSignIn}>sign in using Facebook</button>
     
     {
      user.isSingnedIn && <div className="">
        <p>Welcome, {user.name}</p>
        <p>Your email:{user.email}</p>
        <img src={user.photo} alt="" />
      </div>
     }

     <h1>Our own Authentication </h1>
     <input type="checkbox" name="newUser" id="" onChange={()=> setNewUser(!newUser)} />
     <label htmlFor="newUser">New user sign up </label>
    
    <form onSubmit={handleSubmit}>
      {newUser&& <input type="text" placeholder='Your name'onBlur={handleBlur} name='name' />}
      <br />
    <input type="text" placeholder='Your Email address' onBlur={handleBlur} required name='email'/> 
     <br />
     <input type="password" onBlur={handleBlur} placeholder='Password' required name='password'/>
     <br />
     <input type="submit" value={newUser ? "sign up ": "sign in"} />
    </form>
    <p style={{color:"red"}}>{user.error}</p>
    {
      user.success && <p style={{color:"green"}}>User { newUser ? "created": "logged In"} successfully</p>
    }
    </div>
    
  );
}

export default App;
