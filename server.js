const path = require('path');
const express = require('express');

const app = express(path.join(__dirname, 'public'));
app.use(express.static());

const PORT = 3000 || process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
