import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import {
  getAuth, signOut,
} from 'firebase/auth';
import {
  useUserStore,
} from '@/store/user';
import {
  ERouteName, router,
} from '@/router';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'maudau-fc4f1.firebaseapp.com',
  projectId: 'maudau-fc4f1',
  storageBucket: 'maudau-fc4f1.appspot.com',
  messagingSenderId: '408697709487',
  appId: '1:408697709487:web:a5c0ff76543e47856a455a',
  measurementId: 'G-QC6B4Y2LM8',
};

export default function useFirebase() {
  const {
    setUser,
    setSignedInStatus,
  } = useUserStore();

  let ui = firebaseui.auth.AuthUI.getInstance();
  if (!ui) {
    ui = new firebaseui.auth.AuthUI(firebase.auth());
  }

  const uiConfig = {
    signInFlow: 'popup',
    signInSuccessUrl: '/',
    signInOptions: [
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      },
      {
        provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      },
      {
        provider: firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      },
      {
        provider: firebase.auth.GithubAuthProvider.PROVIDER_ID,
      },
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
      },
    ],
    callbacks: {
      signInSuccessWithAuthResult(authResult: any) {
        setUser(authResult.user.displayName);
        setSignedInStatus(true);
        router.push({
          name: ERouteName.GAME,
        });
        return false;
      },
      uiShown() {
        document.getElementById('loader')!.style.display = 'none';
      },
    },
  };

  function uiSignOut() {
    signOut(getAuth()).then(() => {
      // Sign-out successful.
      setUser(null);
      setSignedInStatus(false);
      router.push({
        name: ERouteName.LOGIN,
      });
    }).catch((error) => {
      // An error happened.
      console.error(error);
    });
  }

  return {
    ui,
    uiConfig,
    uiSignOut,
  };
}
