// firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  collection,
  addDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";

export let nameProfile = "";
// Додайте функцію для реєстрації користувача через email та пароль
const registerWithEmail = async (name, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      getAuth(),
      email,
      password
    );
    nameProfile = name;
    console.log("User registered:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error registering user:", error.message);
    throw error;
  }
};

// Додайте функцію для входу через email та пароль
const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      getAuth(),
      email,
      password
    );
    console.log("User logged in:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in user:", error.message);
    throw error;
  }
};

export { registerWithEmail, loginWithEmail };

// Ваші Firebase конфігураційні дані з консолі Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);

// Отримуємо доступ до аутентифікації
const auth = getAuth(app);

// Налаштовуємо постачальника Google для аутентифікації через Google
const googleAuthProvider = new GoogleAuthProvider();

// Функція для обробки входу через Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    const user = result.user;
    const displayName = user.displayName; // ім'я користувача

    console.log("Google login successful:", user);
    console.log("User display name:", displayName);
    nameProfile = displayName;
    // Створюємо новий об'єкт, що містить user та displayName
    const userWithDisplayName = {
      ...user, // Копіюємо всі властивості користувача
      displayName: displayName, // Додаємо displayName
    };

    // Повертаємо новий об'єкт
    return userWithDisplayName;
  } catch (error) {
    console.error("Google login error:", error.message);
    throw error;
  }
};

// Ініціалізація Firestore
const db = getFirestore(app);

// Функція для збереження даних профілю в Firestore
const saveUserProfile = async (userData) => {
  try {
    const user = getAuth().currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Використовуємо user.uid для унікальності документа
    const userRef = doc(db, "Users", user.uid); // Тепер для кожного користувача створюється окремий документ

    // Створюємо або оновлюємо документ для поточного користувача
    await setDoc(
      userRef,
      {
        ages: userData,
      },
      { merge: true }
    ); // merge: true дозволяє оновлювати тільки відповідні поля без перезапису всього документа

    console.log("User profile saved successfully!");
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
};
//функція дл стоврення рандомних стат
const creatRandomStats = async () => {
  try {
    const statsUser = getAuth().currentUser;
    if (!statsUser) {
      throw new Error("User not authenticated");
    }

    const userRef = doc(db, "StatsRandom", statsUser.uid); // Для кожного користувача створюється окремий документ

    // Генерація тестових даних
    const randomStats = {
      running: {
        distance: Math.floor(Math.random() * 10) + 1, // Відстань у км (1-10 км)
        time: Math.floor(Math.random() * 60) + 30, // Час бігу (30-90 хв)
        speed: Math.random() * 12 + 4, // Середня швидкість (4-16 км/год)
      },
      heartRate: {
        min: Math.floor(Math.random() * 40) + 60, // Мінімальний пульс (60-100 уд/хв)
        max: Math.floor(Math.random() * 30) + 100, // Максимальний пульс (100-130 уд/хв)
      },
      calories: Math.floor(Math.random() * 500) + 200, // Калорії (200-700 кал)
      steps: Math.floor(Math.random() * 10000) + 5000, // Кроки (5000-15000)
    };

    // Збереження статистики в Firestore
    await setDoc(
      userRef,
      {
        indicators: randomStats, // Зберігаємо випадкові дані
      },
      { merge: true }
    );

    console.log("User profile saved successfully with random stats!");
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
};
const getRandomStats = async () => {
  try {
    const user = getAuth().currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const userRef = doc(db, "Stats", user.uid); // Отримуємо документ користувача
    const userDoc = await getDoc(userRef); // Отримуємо дані документа

    if (userDoc.exists()) {
      console.log("User profile data:", userDoc.data());
      return userDoc.data(); // Повертаємо дані користувача
    } else {
      console.log("No profile found");
      return null; // Якщо документ не знайдений, повертаємо null
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};
// Функція для отримання даних профілю користувача з Firestore
const getUserProfile = async () => {
  try {
    const user = getAuth().currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const userRef = doc(db, "Users", user.uid); // Отримуємо документ користувача
    const userDoc = await getDoc(userRef); // Отримуємо дані документа

    if (userDoc.exists()) {
      console.log("User profile data:", userDoc.data());
      return userDoc.data(); // Повертаємо дані користувача
    } else {
      console.log("No profile found");
      return null; // Якщо документ не знайдений, повертаємо null
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};
const createStatsProfile = async (userData) => {
  try {
    const statsUser = getAuth().currentUser;
    if (!statsUser) {
      throw new Error("User not authenticated");
    }

    // Створення посилання на користувача
    const userRef = doc(db, "StatsProfile", statsUser.uid);

    // Створення підколекції "statsRecords" для кожного користувача
    const statsRecordsRef = collection(userRef, "statsRecords");

    // Додавання нового запису зі статистикою та датою
    const newRecord = {
      stats: userData,
      timestamp: new Date(), // Зберігаємо час створення запису
    };

    // Додаємо новий документ в підколекцію
    await addDoc(statsRecordsRef, newRecord);

    console.log("New stats record added successfully with timestamp!");
  } catch (error) {
    console.error("Error creating stats profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  const user = auth.currentUser;
  if (user) {
    const userDocRef = doc(db, "users", user.uid); // User collection in Firestore
    await setDoc(userDocRef, profileData, { merge: true });
  }
};
export {
  app,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  googleAuthProvider,
  signInWithGoogle,
  db,
  getUserProfile,
  creatRandomStats,
  getRandomStats,
  createStatsProfile,
  saveUserProfile, // Експортуємо функцію для збереження даних профілю
};
