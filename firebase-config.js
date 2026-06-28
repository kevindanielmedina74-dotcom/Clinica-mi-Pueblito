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
  console.warn('Firebase no disponible, usando localStorage');
}

function localGet() {
  return JSON.parse(localStorage.getItem('clinica-pacientes') || '[]');
}
function localSet(lista) {
  localStorage.setItem('clinica-pacientes', JSON.stringify(lista));
}

window.cargarPacientesFirebase = async function () {
  if (db) {
    try {
      const snap = await db.collection('pacientes').orderBy('fecha', 'desc').get();
      const firebaseData = snap.docs.map(d => ({ ...d.data(), id: d.id }));
      localSet(firebaseData);
      return firebaseData;
    } catch (e) {
      console.warn('Firestore no disponible, usando localStorage');
    }
  }
  return localGet();
};

window.agregarPacienteFirebase = async function (p) {
  p.id = Date.now();
  const lista = localGet();
  lista.unshift(p);
  localSet(lista);

  if (db) {
    try {
      await db.collection('pacientes').add(p);
    } catch (e) {
      console.warn('Firestore no disponible, dato guardado solo localmente');
    }
  }
  return p;
};

window.borrarPacienteFirebase = async function (id) {
  let lista = localGet().filter(x => x.id !== id);
  localSet(lista);

  if (db) {
    try {
      const snap = await db.collection('pacientes').where('id', '==', id).get();
      snap.forEach(doc => doc.ref.delete());
    } catch (e) {
      console.warn('Firestore no disponible');
    }
  }
};
