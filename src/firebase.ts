import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyCRUJNgPWKtYXbI66UfeQ7NXV2ehAn3vNo',
  authDomain: 'cards-online-d4d5a.firebaseapp.com',
  databaseURL: 'https://cards-online-d4d5a-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'cards-online-d4d5a',
  storageBucket: 'cards-online-d4d5a.firebasestorage.app',
  messagingSenderId: '20574256073',
  appId: '1:20574256073:web:506b6a1632eb3bcd8bc618',
}

const app = initializeApp(firebaseConfig)

export const db = getDatabase(app)

