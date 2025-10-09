use incautaciones_Marihuana;


//¿Cuántos municipios comienzan con "La" y cuál es la cantidad total incautada en ellos?

db.incautaciones.aggregate([
    {
        $lookup:  //llamar otra coleccion en este caso seria municipios
        {
            from: "municipios",
            localField: "cod_muni", //el elemento que esta en la lista incautaciones
            foreignField: "codMuni", //el elemento de la lista que estamos llamando identificador unico(llave foranea)
            as: "municipioInfo" //ponerle el nuevo nombre a la lista que estoy llamando para crear
        }
    },
    {
        $match:{
            "municipioInfo.nombre_muni": { $regex: "^(La)", $options: "i"}
        }
    },
    {
        $group: {
            _id: "municipioInfo.cod_muni",
            nombre_muni:{$first: "municipioInfo.nombre_muni"},
            cantidadTotal: { $sum: "$cantidad"}
        }
    }
]);
// Top 5 departamentos donde los municipios terminan en "al" y la cantidad incautada.

db.incautaciones.aggregate([
    {
        $lookup:  //llamar otra coleccion en este caso seria municipios
        {
            from: "municipios",
            localField: "cod_muni", //el elemento que esta en la lista incautaciones
            foreignField: "codMuni", //el elemento de la lista que estamos llamando identificador unico(llave foranea)
            as: "municipioInfo" //ponerle el nuevo nombre a la lista que estoy llamando para crear
        }
    },
    {
        $match:{
            "municipioInfo.nombre_muni": { $regex: "(al)$", $options: "i"} //"(al)$"" significa que debe terminar en esas letras
        }
    },
    {
        $group: {
            _id: "municipioInfo.cod_muni",
            nombre_muni:{$first: "municipioInfo.nombre_muni"},
            cantidadTotal: { $sum: "$cantidad"}
        }
    },
    {
        $sort: { cantidadTotal: -1 }
    },
    {
        $limit: 5
    }
]);