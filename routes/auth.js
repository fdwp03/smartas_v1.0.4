const bcrypt = require('bcrypt');

module.exports = (supabase) => {
    const router = require('express').Router();

    router.get('/login', (req, res) => {
        if (req.session.user) {
            return redirectBasedOnRole(req.session.user.peran, res);
        }
        res.render('login', { error: null });
    });

    router.post('/login', async (req, res) => {
        const { email, password } = req.body;

        const { data: user, error } = await supabase
            .from('akun')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.render('login', { error: 'Email tidak ditemukan' });
        }

        // Gunakan kolom kata_sandi
        const validPassword = await bcrypt.compare(password, user.kata_sandi);
        if (!validPassword) {
            return res.render('login', { error: 'Password salah' });
        }

        req.session.user = {
            id_akun: user.id_akun,
            nama: user.nama,
            email: user.email,
            peran: user.peran,
            id_guru: user.id_guru,
            id_siswa: user.id_siswa
        };

        redirectBasedOnRole(user.peran, res);
    });

    router.get('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/login');
    });

    function redirectBasedOnRole(role, res) {
        if (role === 'admin') return res.redirect('/admin/dashboard');
        if (role === 'guru') return res.redirect('/guru/dashboard');
        if (role === 'siswa') return res.redirect('/siswa/dashboard');
        return res.redirect('/login');
    }

    return router;
};