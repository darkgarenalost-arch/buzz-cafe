import { firebaseConfig, ADMIN_EMAIL } from "../firebase/firebase-config.js";

const CDN = "https://www.gstatic.com/firebasejs/10.12.4";

let firebaseReady = false;
let app;
let auth;
let db;
let storage;
let authFns = {};
let storeFns = {};
let storageFns = {};

export async function initFirebase() {
  if (firebaseReady) return { app, auth, db, storage };

  try {
    const appMod = await import(`${CDN}/firebase-app.js`);
    const authMod = await import(`${CDN}/firebase-auth.js`);
    const firestoreMod = await import(`${CDN}/firebase-firestore.js`);
    const storageMod = await import(`${CDN}/firebase-storage.js`);

    app = appMod.initializeApp(firebaseConfig);
    auth = authMod.getAuth(app);
    db = firestoreMod.getFirestore(app);
    storage = storageMod.getStorage(app);

    authFns = authMod;
    storeFns = firestoreMod;
    storageFns = storageMod;
    firebaseReady = true;
  } catch (error) {
    console.warn("Firebase could not be initialized. Local fallback is active.", error);
  }

  return { app, auth, db, storage };
}

export function onUserChanged(callback) {
  if (!auth || !authFns.onAuthStateChanged) {
    callback(null);
    return () => {};
  }
  return authFns.onAuthStateChanged(auth, callback);
}

export async function signInEmail(email, password) {
  await initFirebase();
  return authFns.signInWithEmailAndPassword(auth, email, password);
}

export async function signUpEmail(email, password, name) {
  await initFirebase();
  const result = await authFns.createUserWithEmailAndPassword(auth, email, password);
  if (name) await authFns.updateProfile(result.user, { displayName: name });
  return result;
}

export async function signInGoogle() {
  await initFirebase();
  const provider = new authFns.GoogleAuthProvider();
  return authFns.signInWithPopup(auth, provider);
}

export async function signOutUser() {
  await initFirebase();
  return authFns.signOut(auth);
}

export async function isAdminUser(user) {
  if (!user?.email) return false;
  if (user.email.toLowerCase() === ADMIN_EMAIL) return true;
  try {
    const snap = await storeFns.getDoc(storeFns.doc(db, "admins", user.email.toLowerCase()));
    return snap.exists() && snap.data().active !== false;
  } catch {
    const admins = JSON.parse(localStorage.getItem("cw_admins") || "[]");
    return admins.includes(user.email.toLowerCase());
  }
}

export async function saveOrder(order) {
  await initFirebase();
  try {
    const payload = { ...order, createdAt: storeFns.serverTimestamp() };
    const ref = await storeFns.addDoc(storeFns.collection(db, "orders"), payload);
    return ref.id;
  } catch {
    const orders = JSON.parse(localStorage.getItem("cw_orders") || "[]");
    const id = `local-${Date.now()}`;
    orders.push({ ...order, id, createdAt: new Date().toISOString() });
    localStorage.setItem("cw_orders", JSON.stringify(orders));
    return id;
  }
}

export async function fetchCollection(name) {
  await initFirebase();
  try {
    const snap = await storeFns.getDocs(storeFns.collection(db, name));
    return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  } catch {
    return JSON.parse(localStorage.getItem(`cw_${name}`) || "[]");
  }
}

export async function upsertDocument(collectionName, id, data) {
  await initFirebase();
  try {
    await storeFns.setDoc(storeFns.doc(db, collectionName, id), data, { merge: true });
  } catch {
    const items = JSON.parse(localStorage.getItem(`cw_${collectionName}`) || "[]");
    const next = items.filter((item) => item.id !== id);
    next.push({ ...data, id });
    localStorage.setItem(`cw_${collectionName}`, JSON.stringify(next));
  }
}

export async function deleteDocument(collectionName, id) {
  await initFirebase();
  try {
    await storeFns.deleteDoc(storeFns.doc(db, collectionName, id));
  } catch {
    const items = JSON.parse(localStorage.getItem(`cw_${collectionName}`) || "[]");
    localStorage.setItem(`cw_${collectionName}`, JSON.stringify(items.filter((item) => item.id !== id)));
  }
}

export async function uploadProductImage(file) {
  await initFirebase();
  const imageRef = storageFns.ref(storage, `products/${Date.now()}-${file.name}`);
  await storageFns.uploadBytes(imageRef, file);
  return storageFns.getDownloadURL(imageRef);
}
