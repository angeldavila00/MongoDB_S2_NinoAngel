use (incautaciones_db2);

//collecciones

db.createCollection("departamentos");
db.createCollection("municipios");
db.createCollection("unidades");
db.createCollection("incautaciones");

//indices

db.departamentos.createIndex({cod_depto:1 }, {unique: true});
db.municipios.createIndex({cod_muni: 1}, {unique:true});
db.unidades.createIndex({nombre_unidad:1},{unique: true});
db.incautaciones.createIndex({fecha_hecho:1});
db.incautaciones.createIndex({cod_muni:1});
db.incautaciones.createIndex({id_unidad:1});

//pobrar catalogos(departamentos, municipios, unidades)

db.incautaciones_raw.aggregate([
    {
    $group:{
        _id: "$COD_DEPTO",
        nombre_depto: {$first: "$DEPARTAMENTO"}
    }
    },
    {
    $project:{
        cod_depto: "$_id",
        nombre_depto: 1,
        _id:0

    }
    },
    {
    $merge:{
        into:"departamentos",
        on:"cod_depto",
        whenMatched: "merge",
        whenNotMatched: "insert"
    }}

]);
db.incautaciones_raw.findOne();

db.incautaciones_raw.aggregate([{
    $group:{
    _id:"$COD_MUNI",
    nombre_muni: {$first: "$MUNICIPIO"},
    cod_depto: {$first: "$COD_DEPTO"}
    }
    },
    {
    $project:{
    _id:0,
    nombre_muni:1,
    cod_muni: "$_id",
    cod_depto:1
    }
    },
    {
    $merge: {
        into:"municipios",
        on: "cod_muni",
        whenMatched: "merge",
        whenNotMatched: "insert"

    }
    }
]);

db.incautaciones_raw.aggregate([{
$group:{
    _id:"$UNIDAD"
}

},
    {
    $project:{
        _id:0,
        nombre_unidad: "$_id"

    }
    },
    {
    $merge:{
        into:"unidades",
        on: "nombre_unidad",
        whenMatched: "merge",
        whenNotMatched: "insert"
    }
    }
]);

db.departamentos.find();
db.municipios.find();
db.unidades.find();

db.incautaciones_raw.aggregate([
    {
        $addFields:{
            fecha_hecho:{
                $dateFromString:{
                    dateString:"$FECHA HECHO",
                    format:"%d/%m/%Y",
                    timezone:"UTC",
                }
            }
        }
    },
    {
        $lookup:{
            from:"unidades",
            localField:"UNIDAD",
            foreignField:"nombre_unidad",
            as:"unidadInfo"
        }
    },

    {
        $set:{
            id_unidad:{
                $arrayElemAt:["$unidadInfo._id",0]
            }
        }
    },

    {
        $project:{
            fecha_hecho:1,
            cod_muni:"$COD_MUNI",
            cantidad:"$CANTIDAD",
            id_unidad:1,
        }
    },
    {
        $merge:{
            into:"incautaciones"
        }
    }
]);


db.incautaciones.find();

//contar los documentos que estan almacenados

db.incautaciones.aggregate([
    {
    $count: "total_registros"
    }
]);

db.incautaciones.findOne();
//Cantidad total incautada
db.incautaciones.aggregate([
    {
        $group:{
            _id:null,
            total_cantidad:{
                $sum:"$cantidad"
                }
            }
        }
    ]);
//Agrupar por año
db.incautaciones.aggregate([
    {
        $addFields:{
            anio:{$year:'$fecha_hecho'}
            }
        },
    {
        $group:{
            _id:'$anio',
            total:{$sum:'$cantidad'}
            }
        },
    {
        $sort:{
            _id:1
            }
        }
    ]);

//Agrupación por año y mes
db.incautaciones.aggregate([
    {
        $group:{
            _id:{
                anio:{$year:'$fecha_hecho'},
                mes:{$month:"$fecha_hecho"}
                },
            total:{
                $sum:'$cantidad'
                }
            }
        },
    {
        $sort:{
            "_id.anio":1,"_id.mes":1
            }
        },
    ]);

//Top 5 Municipios de mayor incautación
db.incautaciones.aggregate([
    {
        $group:{
            _id:"$cod_muni",
            total:{$sum:'$cantidad'}
            }
        },{
        $sort:{total:-1}
        },{
        $limit:5
        },{
        $lookup:{
            from:"municipios",
            localField:"_id",
            foreignField:"cod_muni",
            as:"muni"
            }
        },{
        $unwind:'$muni'
        },{
        $project:{
            municipio:"$muni.nombre_muni",
            total:1,
            _id:0
            }
        }

    ]);

//Promedio por municipio --> Top 10 promedios de incautacion
//por municipio
db.incautaciones.aggregate(
    [{
        $group:{
            _id: "$cod_muni",
            promedio: {$avg: "$cantidad"}}
        },
        {$lookup:{
            from: "municipios",
            localField: "_id",
            foreignField: "cod_muni",
            as: "municipioSerio"
            } },
        {$unwind: "$municipioSerio"},{
        $project:{
            municipio:'$municipioSerio.nombre_muni',
            total:'$promedio'
            }
        },{
        $sort:{total :-1}
        },
        {
            $limit:10
            }]);

//Ranking de Departamentos por Incautación
db.departamentos.findOne();
db.incautaciones.aggregate([
    {
        $lookup:{
            from:'municipios',
            localField:"cod_muni",
            foreignField:"cod_muni",
            as:'muni'
            }
        },{
        $unwind:'$muni'
        },
    {
        $lookup:{
            from:'departamentos',
            localField:'muni.cod_depto',
            foreignField:'cod_depto',
            as:'depto'
            }
        },{
        $unwind:'$depto'
        },{
        $group:{
            _id:'$depto.nombre_depto',
            total:{$sum:'$cantidad'}
            }
        },{
        $sort:{total:-1}
        }
    ]);

//Ranking de los municipios con
//más incautaciones que empiezan por "Puerto"
db.incautaciones.aggregate([
    {
        $lookup:{
            from:'municipios',
            localField:"cod_muni",
            foreignField:"cod_muni",
            as:'muni'
            }
        },
    {$unwind:'$muni'}
    ,{
        $match:{
            'muni.nombre_muni':{$regex:/^Puerto/i}
        }
        },{
        $sort:{total:-1}
        },{
        $group:{
            _id:'$muni.nombre_muni',
            total:{$sum:'$cantidad'}
        }
        }]);