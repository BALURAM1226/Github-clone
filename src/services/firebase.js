import { initializeApp } from 'firebase/app';
import { getAuth, GithubAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyB9_nFh5w0KueH02z8qDMrHS7PL2psmwAw',
    authDomain: 'github-e92f4.firebaseapp.com',
    projectId: 'github-e92f4',
    storageBucket: 'github-e92f4.appspot.com',
    messagingSenderId: '425747716598',
    appId: '1:425747716598:web:040d56d9d238281d990fd7'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, GithubAuthProvider, signInWithPopup, signOut };
export default app;
