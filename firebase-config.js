// ===== CONFIGURACION DE FIREBASE =====
// Pega aqui tus credenciales de Firebase.
// Para obtenerlas:
//   1. Ve a https://console.firebase.google.com
//   2. Crea un proyecto (o usa uno existente)
//   3. Ve a "Project settings" > "General" > "Tus apps"
//   4. Click en "Web" (icono </>)
//   5. Copia el objeto "firebaseConfig" y pegalo abajo

const firebaseConfig = {
  apiKey: "AQUI_TU_API_KEY",
  authDomain: "AQUI_TU_PROJECT.firebaseapp.com",
  projectId: "AQUI_TU_PROJECT_ID",
  storageBucket: "AQUI_TU_PROJECT.appspot.com",
  messagingSenderId: "AQUI_TU_SENDER_ID",
  appId: "AQUI_TU_APP_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

async function cargarPacientes() {
  try {
    const snapshot = await db.collection('pacientes').orderBy('fecha', 'desc').get();
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (e) {
    console.error('Error al cargar:', e);
    return [];
  }
}

async function agregarPaciente(paciente) {
  try {
    const docRef = await db.collection('pacientes').add(paciente);
    return { ...paciente, id: docRef.id };
  } catch (e) {
    console.error('Error al guardar:', e);
    return paciente;
  }
}

async function borrarPaciente(id) {
  try {
    await db.collection('pacientes').doc(id).delete();
  } catch (e) {
    console.error('Error al eliminar:', e);
  }
}
