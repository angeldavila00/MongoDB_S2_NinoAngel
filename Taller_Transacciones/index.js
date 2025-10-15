use(incautaciones_db2);

const s = db.getMongo().startSession();

const adb = s.getDatabase("incautaciones_db2");

s.withTransaction(() => {
    //1. Encuentra todos los municipios que empiezan por “San”.
    adb.municipios.find({ nombre_muni: { $regex: /^San\b/i } });

    //2. Lista los municipios que terminan en “ito”.
    adb.municipios.find({ nombre_muni: { $regex: /ito$/i } });

    //3. Busca los municipios cuyo nombre contenga la palabra “Valle”.
    adb.municipios.find({ nombre_muni: { $regex: /Valle/i } });

    //4. Devuelve los municipios cuyo nombre empiece por vocal.
    adb.municipios.find({ nombre_muni: { $regex: /^[AEIOUÁÉÍÓÚ]/i } });

    //5. Filtra los municipios que terminen en “al” o “el”.
    adb.municipios.find({ nombre_muni: { $regex: /(al|el)$/i } });

    //6. Encuentra los municipios cuyo nombre contenga dos vocales seguidas.
    adb.municipios.find({ nombre_muni: { $regex: /[aeiouáéíóú]{2}/i } });

    //7. Obtén todos los municipios con nombres que contengan la letra “z”.
    adb.municipios.find({ nombre_muni: { $regex: /z/i } });

    //8. Lista los municipios que empiecen con “Santa” y tengan cualquier cosa después.
    adb.municipios.find({ nombre_muni: { $regex: /^Santa/i } });

    //9. Encuentra municipios cuyo nombre tenga exactamente 6 letras.
    adb.municipios.find({ nombre_muni: { $regex: /^[A-Za-z]{6}$/i } });

    //10. Filtra los municipios cuyo nombre tenga 2 palabras.
    adb.municipios.find({ nombre_muni: { $regex: /^\S+\s+\S+$/i } })

    //11. Encuentra municipios cuyos nombres terminen en “ito” o “ita”.
    adb.municipios.find({ nombre_muni: { $regex: /(ito|ita)$/i } });

    //12. Lista los municipios que contengan la sílaba “gua” en cualquier posición.
    adb.municipios.find({ nombre_muni: { $regex: /gua/i } });

    //13. Devuelve los municipios que empiecen por “Puerto” y terminen en “o”.
    adb.municipios.find({ nombre_muni: { $regex: /^Puerto.*o$/i } });

    //14. Encuentra municipios con nombres que tengan más de 10 caracteres.
    adb.municipios.find({ nombre_muni: { $regex: /^.{11,}$/i } });

    //15. Busca municipios que no contengan vocales.
    adb.municipios.find({ nombre_muni: { $regex: /^aeiou+$/i } });

    //16. Muestra la cantidad total incautada en municipios que empiezan con “La”.
    adb.incautaciones.aggregate([
        {
            $lookup: {
                from: "municipios",
                localField: "cod_muni",
                foreignField: "cod_muni",
                as: "total"
            }
        },
        {
            $unwind: "$total"
        },
        {
            $match: {
                "total.nombre_muni": { $regex: /^La\b/i }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$cantidad" }
            }
        },
        {
            $project: { _id: 0 }
        }

    ]);

    //17. Calcula el total de incautaciones en municipios cuyo nombre termine en “co”.
    adb.incautaciones.aggregate([
        {
            $lookup: {
                from: "municipios",
                localField: "cod_muni",
                foreignField: "cod_muni",
                as: "total"
            }
        },
        { $unwind: "$total" },
        { $match: { "total.nombre_muni": { $regex: /co$/i } } },
        {
            $group: {
                _id: null,
                totalIncautado: { $sum: "$cantidad" }
            }
        },
        {
            $project:
                { _id: 0 }
        }
    ]);


    //18. Obtén el top 5 de municipios con más incautaciones cuyo nombre contenga la letra “y”.
    adb.incautaciones.aggregate([
        {
            $lookup: {
                from: "municipios",
                localField: "cod_muni",
                foreignField: "cod_muni",
                as: "top"
            }
        },
        { $unwind: "$top" },
        { $match: { "top.nombre_muni": { $regex: /y/i } } },
        {
            $group: {
                _id: {
                    cod_muni: "$cod_muni",
                    nombre_muni: "$top.nombre_muni"
                },
                top: { $sum: "$cantidad" }
            }
        },
        { $sort: { top: -1 } },
        { $limit: 5 },
        {
            $project:
            {
                _id: 0,
                nombre_muni: "$_id.nombre_muni",
                top: 1
            }
        }
    ]);

    
    //19. Encuentra los municipios que empiecen por “San” y agrupa la cantidad incautada por año.

    //20. Lista los departamentos que tengan al menos un municipio cuyo nombre termine en “ito” o “ita”, y muestra la cantidad total incautada en ellos.

});

s.endSession();