// ===== CONFIGURACION DE FIREBASE =====
// 1. Ve a https://console.firebase.google.com
// 2. Crea un proyecto
// 3. Ve a "Project settings" > "Tus apps" > Web (</>)
// 4. Copia el objeto firebaseConfig y pegalo abajo
// 5. En Firestore Database, crea la BD en modo prueba

const firebaseConfig = {
  apiKey: "AQUI_TU_API_KEY",
  authDomain: "AQUI_TU_PROJECT.firebaseapp.com",
  projectId: "AQUI_TU_PROJECT_ID",
  storageBucket: "AQUI_TU_PROJECT.appspot.com",
  messagingSenderId: "AQUI_TU_SENDER_ID",
  appId: "AQUI_TU_APP_ID"
};

let db = null;

try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
} catch (e) {
  console.warn('Firebase no configurado. Los datos se guardaran solo en este navegador.');
}

window.cargarPacientesFirebase = async function () {
  if (!db) return JSON.parse(localStorage.getItem('clinica-pacientes') || '[]');
  try {
    const snap = await db.collection('pacientes').orderBy('fecha', 'desc').get();
    return snap.docs.map(d => ({ ...d.data(), id: d.id }));
  } catch (e) {
    console.error('Error Firebase:', e);
    return JSON.parse(localStorage.getItem('clinica-pacientes') || '[]');
  }
};

window.agregarPacienteFirebase = async function (p) {
  if (!db) {
    const lista = JSON.parse(localStorage.getItem('clinica-pacientes') || '[]');
    p.id = Date.now();
    lista.unshift(p);
    localStorage.setItem('clinica-pacientes', JSON.stringify(lista));
    return p;
  }
  try {
    const ref = await db.collection('pacientes').add(p);
    return { ...p, id: ref.id };
  } catch (e) {
    console.error('Error Firebase:', e);
    return p;
  }
};

window.borrarPacienteFirebase = async function (id) {
  if (!db) {
    const lista = JSON.parse(localStorage.getItem('clinica-pacientes') || '[]');
    localStorage.setItem('clinica-pacientes', JSON.stringify(lista.filter(x => x.id !== id)));
    return;
  }
  try {
    await db.collection('pacientes').doc(id).delete();
  } catch (e) {
    console.error('Error Firebase:', e);
  }
};
