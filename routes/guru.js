module.exports = (supabase) => {
    const router = require('express').Router();

    router.get('/dashboard', async (req, res) => {
        const id_guru = req.session.user.id_guru;

        // Ambil jadwal mengajar guru ini
        const { data: jadwal, error } = await supabase
            .from('jadwal')
            .select(`
                id_jadwal,
                hari,
                jam,
                kelas:nama,
                mata_pelajaran:nama
            `)
            .eq('id_guru', id_guru)
            .eq('aktif', true);

        res.render('guru/dashboard', {
            user: req.session.user,
            jadwal: jadwal || []
        });
    });

    return router;
};