// 1. 
db.productos.aggregate([{
    $match: { // Usa expresiones de agregación dentro del match
        $expr: { // ¿El tamaño del array de comentarios es > 3?
            $gt: [
                //$size necesita un array SÍ o SÍ; si 'comentarios' no existe o es null,
                // $ifNull lo reemplaza por []
                {
                    $size: { ifnull: ["$comentarios", []] }
                }, 3
            ]
        },
        // Y además, el precio debe ser > 100
        precio: { $gt: 100 }
    }
},
{
    $project: {
        _id: 0,
        nombre: 1,
        precio: 1,
        // recalcula el número de comentarios para mostrarlo
        totalComentarios: { $size: { ifnull: ["$comentarios", []] } }
    }
},
{ $sort: { precio: -1 } } // de mayor a menor
]);

//2.

db.productos.aggregate([
    {
        $match: {
            nombre: { $regex: "^(A|P)", $options: "i" }
        }
    },
    {
        $project: {
            _id: 0,
            nombre: 1,
            categoria: 1,
            precio: 1
        }
    },
    {
        $sort: { nombre: 1 }
    }
]);

//3.
db.productos.aggregate([
    {
        $group: {
            _id: "$categoria",
            cantidad: { $sum: 1 },
            promedioPrecio: { $avg: "$precio" },
            stockMaximo: { $max: "$stock" }
        }
    },
    { $sort: { cantidad: -1 } }
]);

//4.

db.productos.aggregate([
    {
        $match: {
            comentarios: {
                $elemMatch: {
                    comentario: { $regex: "(recomendado|perfecto)", $options: "i" }
                }
            }
        }
    },
    {
        $project: {
            _id: 0,
            nombre: 1,
            categoria: 1,
            comentarios: {
                $filter: {
                    input: "$comentarios",
                    as: "c",
                    cond: {
                        $regexMatch: {
                            input: "$$c.comentario",
                            regex: "(recomendado|perfecto)",
                            options: "i"
                        }
                    }
                }
            }
        }
    }
]);

//5.

db.productos.aggregate([
    {
        $unwind: "$comentarios"
    },
    {
        $match: {
            "comentarios.usuario": { $type: "string", $ne: ""}
        }
    },
    {
        $group: {
            _id: "$comentarios.usuario",
            totalComentarios: { $sum: 1}

        }
    },
    {
        $sort: { totalComentarios: -1}
    },
    {
        $limit: 5
    },
    {
        $project: {
            _id:0,
            usuarios: "$_id",
            totalComentarios: 1
        }
    }
]);