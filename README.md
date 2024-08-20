<h1 align="center">
     StreamVerse
  <br>
</h1>


## 📜 Installation Guide

### Frontend Installation

Clone this project (Frontend repository)
```
git clone https://github.com/Wongsodillon/StreamVerse.git
```

Enter Project Directory
```
cd StreamVerse
```

Run these commands
- Run `npm install`
- Run `npm run dev`

### Backend Installation

Clone the backend repository
```
git clone https://github.com/Marcodave03/StreamVerse-Hedera.git
```

Enter Project Directory
```
cd StreamVerse-Hedera
```

Use XAMPP to start Apache and MySQL. Alternatively, you can use a different database of your choice.

Create the .env file by copying the .env.example

Run these commands
- Run `npm install`
- Run `nodemon index.js`

If there is an error on when running `nodemon index.js` after `npm install`. 

Run these commands
- `npm uninstall bcrypt`
- `npm install bcrypt`
- `nodemon index.js`
