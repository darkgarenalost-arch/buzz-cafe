const firebaseConfig = {
  apiKey: "AIzaSyBCb9gjYCVpkxbZFFrKssneYrhKyC9Ek9k",
  authDomain: "track-u-fb116.firebaseapp.com",
  projectId: "track-u-fb116",
  storageBucket: "track-u-fb116.firebasestorage.app",
  messagingSenderId: "780812482768",
  appId: "1:780812482768:web:626ebf0789d1730b1146d5",
  measurementId: "G-PL2DEWLQET"
};

let auth = null;
let db = null;
let currentUser = null;
let authListeners = [];

export function initFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  auth = firebase.auth();
  db = firebase.firestore();

  // Enable offline persistence
  db.enablePersistence({ synchronizeTabs: true }).catch(err => {
    console.warn('Firestore persistence:', err);
  });

  auth.onAuthStateChanged((user) => {
    currentUser = user;
    authListeners.forEach(fn => fn(user));
  });

  return { auth, db };
}

export function getAuth() {
  if (!auth) initFirebase();
  return auth;
}

export function getDb() {
  if (!db) initFirebase();
  return db;
}

export function getCurrentUser() {
  return currentUser;
}

export function onAuthStateChanged(callback) {
  authListeners.push(callback);
  if (currentUser !== undefined) {
    callback(currentUser);
  }
  return () => {
    const idx = authListeners.indexOf(callback);
    if (idx > -1) authListeners.splice(idx, 1);
  };
}

export function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  return auth.signInWithPopup(provider);
}

export function signOut() {
  return auth.signOut();
}

export function userDoc() {
  if (!currentUser) throw new Error('No user logged in');
  return db.collection('users').doc(currentUser.uid);
}

export async function loadUserData() {
  if (!currentUser) return null;
  try {
    const snap = await userDoc().get();
    if (snap.exists) {
      const data = snap.data();
      return data;
    }
    return null;
  } catch (e) {
    console.warn('Firestore load error:', e);
    return null;
  }
}

export async function pushStateToFirestore() {
  if (!currentUser) return;
  try {
    const { state } = await import('./store.js');
    await userDoc().set({
      profile: {
        name: currentUser.displayName || '',
        email: currentUser.email || '',
        xp: state.stats.totalXP,
        level: state.stats.level,
        streak: state.stats.currentStreak,
        longestStreak: state.stats.longestStreak,
      },
      tasks: state.tasks,
      history: state.history,
      stats: state.stats,
      settings: state.settings,
      lastReset: state.lastReset || null,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  } catch (e) {
    console.warn('Firestore save error:', e);
  }
}