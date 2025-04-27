const express = require('express');
const app = express();
const port = 3000;

// მარტივი მარშრუტი (route) მთავარ გვერდზე
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// სერვერის გაშვება
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});