
module.exports = (supabase) => {
    const router = require('express').Router();

    router.get('/dashboard', async (req, res) => {
        // Contoh data statistik dashboard admin
        const { count: totalGuru, error: errGuru } = await supabase
            .from('guru')
            .select('*', { count: 'exact', head: true });

        const { count: totalSiswa, error: errSiswa } = await supabase
            .from('siswa')
            .select('*', { count: 'exact', head: true });

        const { count: totalKelas, error: errKelas } = await supabase
            .from('kelas')
            .select('*', { count: 'exact', head: true });

        res.render('admin/dashboard', {
            user: req.session.user,
            stats: {
                guru: totalGuru || 0,
                siswa: totalSiswa || 0,
                kelas: totalKelas || 0
            }
        });
    });

    return router;
};