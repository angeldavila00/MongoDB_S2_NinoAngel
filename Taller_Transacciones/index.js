use(incautaciones_db2);

const s = db.getMongo().startSession();

const adb = s.getDatabase("incautaciones_db2");

s.withTransaction(() => {
    adb.municipios.find({ nombre_muni: { $regex: /^San\b/i } });

    adb.municipios.find({ nombre_muni: { $regex: /ito$/i } });

    adb.municipios.find({ nombre_muni: { $regex: /Valle/i } });

    adb.municipios.find({ nombre_muni: { $regex: /^[AEIOUÁÉÍÓÚ]/i } });

    adb.municipios.find({ nombre_muni: { $regex: /(al|el)$/i } });
    
    adb.municipios.find({ nombre_muni: { $regex: /[aeiouáéíóú]{2}/i } });
});