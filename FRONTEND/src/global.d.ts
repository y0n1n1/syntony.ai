// this is needed for google auth
// global.d.ts
interface Window {
    onSignIn: (googleUser: any) => void;
  }