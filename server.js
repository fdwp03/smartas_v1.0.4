require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set true jika pakai https
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Root route - redirect ke login
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Routing
const authRoutes = require('./routes/auth')(supabase);
const adminRoutes = require('./routes/admin')(supabase);
const guruRoutes = require('./routes/guru')(supabase);
const siswaRoutes = require('./routes/siswa')(supabase);
const { isAuthenticated, isRole } = require('./middleware/auth');

app.use('/', authRoutes);
app.use('/admin', isAuthenticated, isRole(['admin']), adminRoutes);
app.use('/guru', isAuthenticated, isRole(['guru']), guruRoutes);
app.use('/siswa', isAuthenticated, isRole(['siswa']), siswaRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});