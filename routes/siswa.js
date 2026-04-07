module.exports = (supabase) => {
    const router = require('express').Router();

    router.get('/dashboard', async (req, res) => {
        const id_siswa = req.session.user.id_siswa;

        // Ambil data siswa dan kelas (asumsikan ada tabel kelas_siswa, karena tidak ada di schema, contoh sederhana)
        // Untuk contoh, kita hanya tampilkan data siswa
        const { data: siswa, error } = await supabase
            .from('siswa')
            .select('nama, nis, gender')
            .eq('id_siswa', id_siswa)
            .single();

        res.render('siswa/dashboard', {
            user: req.session.user,
            siswa: siswa || {}
        });
    });

    return router;
};