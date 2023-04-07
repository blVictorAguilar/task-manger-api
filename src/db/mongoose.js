const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URL.toString(), { useNewUrlParser: true });
