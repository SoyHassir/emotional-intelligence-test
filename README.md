# 🧠 Emotional Intelligence Test 

A responsive web application that measures emotional intelligence using a standardized questionnaire based on José Andrés Ocaña's model from his work "Mapas mentales y estilos de aprendizaje" (2010).

## ✨ Features

- 📝 45-question emotional intelligence assessment
- 📱 Responsive design that works on desktop and mobile devices
- 🌙 Dark mode toggle for comfortable viewing in any environment
- 💾 Progress tracking that saves user responses
- 📊 Demographic data collection
- 🔍 Result interpretation with personalized feedback
- 🔥 Data storage with Firebase Firestore integration
- ✨ Smooth animations and transitions for an engaging user experience

## 🛠️ Technologies Used

- 🌐 HTML5
- 🎨 CSS3 (with custom properties and modern styling techniques)
- 💻 Vanilla JavaScript (ES6+)
- 🔥 Firebase Firestore for database functionality

## 🚀 Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/emotional-intelligence-test.git
   ```

2. Navigate to the project directory:
   ```
   cd emotional-intelligence-test
   ```

3. Update the Firebase configuration in `script.js` with your own Firebase project details:
   ```javascript
   const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID",
       measurementId: "YOUR_MEASUREMENT_ID"
   };
   ```

4. Open the `index.html` file in your browser or use a local server.

## 🌐 Deployment

To deploy this application, you can use any web hosting service that allows static website hosting, such as:

- 📂 GitHub Pages
- 🚀 Netlify
- ⚡ Vercel
- 🔥 Firebase Hosting

For Firebase Hosting, follow these steps:

1. Install Firebase CLI:
   ```
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```
   firebase login
   ```

3. Initialize your project:
   ```
   firebase init
   ```

4. Deploy your website:
   ```
   firebase deploy
   ```

## 📁 Project Structure

- 📄 `index.html` - Main HTML structure of the application
- 🎨 `styles.css` - Styling for the entire application
- ⚙️ `script.js` - JavaScript logic including Firebase integration

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- 📚 Based on the emotional intelligence model by José Andrés Ocaña
- 🔥 Firebase for providing the database infrastructure