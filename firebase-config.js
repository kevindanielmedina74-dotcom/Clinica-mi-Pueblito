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

let _db = null;
try {
  firebase.initializeApp(firebaseConfig);
  _db = firebase.firestore();
} catch (_) {}

function _get() { return JSON.parse(localStorage.getItem('cp') || '[]'); }
function _set(d) { localStorage.setItem('cp', JSON.stringify(d)); }

window.cargarPacientesFirebase = function () {
  var local = _get();
  if (_db) {
    Promise.race([
      _db.collection('pacientes').orderBy('fecha', 'desc').get(),
      new Promise(function (_, rej) { setTimeout(function () { rej('timeout'); }, 3000); })
    ]).then(function (snap) {
      var arr = snap.docs.map(function (d) { return { ...d.data(), id: d.id }; });
      _set(arr);
      if (window._onPacientesCargados) window._onPacientesCargados(arr);
    }).catch(function () {});
  }
  return local;
};

window.agregarPacienteFirebase = function (p) {
  if (_db) _db.collection('pacientes').add(Object.assign({}, p)).catch(function () {});
};

window.borrarPacienteFirebase = function (id) {
  if (_db) {
    _db.collection('pacientes').where('id', '==', id).get()
      .then(function (snap) { snap.forEach(function (d) { d.ref.delete(); }); })
      .catch(function () {});
  }
};
