# Proyecto: Sistema de Información de Víctimas de Minas (MAP/AEI/MUSE)

## Introducción

El registro del núcleo básico de las víctimas de minas antipersonal (MAP), artefactos explosivos improvisados (AEI) con características de minas antipersonal y municiones sin explotar (MUSE) constituye una herramienta esencial para comprender la magnitud e impacto de la problemática de contaminación por explosivos en Colombia.

Este registro consolida la información de todos los eventos ocurridos en el país desde 1990 hasta la fecha de corte, permitiendo un análisis histórico y actualizado de las consecuencias humanitarias.  

La base de datos incluye detalles sobre:
- Departamentos y municipios.
- Tipo de área y sitio del evento.
- Año y mes del evento.
- Información sociodemográfica de las víctimas (edad, género, grupo étnico, condición).
- Estado de la víctima (herido o fallecido).
- Contexto del evento (labores agrícolas, erradicación, tránsito, etc.).
- Coordenadas geográficas para georreferenciación.

Este sistema busca servir como:
- Fuente de datos estadísticos.
- Herramienta de memoria histórica y reparación integral.
- Insumo para políticas públicas y acciones de desminado humanitario.

---

## Caso de Estudio

Entre 1990 y 2023 se han documentado más de **12.000 víctimas** de MAP, AEI y MUSE en Colombia.  

### Problemas actuales:
- Dificultad para analizar cifras de manera rápida y confiable.
- Falta de localización geográfica para priorizar el desminado.
- Complejidad en el seguimiento de víctimas (rehabilitación, ayudas).
- Limitada generación de reportes dinámicos para tomadores de decisión.

### Solución propuesta:
Diseñar un sistema de información centralizado que organice, almacene y permita consultar la información de manera estructurada.

**Objetivo:**  
Desarrollar una base de datos relacional que permita:
- Registrar eventos con ubicación, fecha y actividad.
- Almacenar información sociodemográfica de víctimas.
- Generar consultas y reportes por departamento, municipio y periodo.

---

## Planificación

### Modelo Conceptual
Representa de forma abstracta los elementos principales y sus relaciones.

**Relaciones principales:**
- **Departamentos – Municipios:** 1:N  
- **Municipios – Eventos:** 1:N  
- **Eventos – Fechas:** 1:N  
- **Eventos – Ubicaciones:** N:1  
- **Ubicaciones – Víctimas:** 1:N  
- **Víctimas – Género:** 1:N  

---

### Modelo Lógico

Transformación del modelo conceptual en diseño para un SGBD (MySQL).  
Cada entidad se convierte en tabla con atributos, tipos de datos y claves.

**Relaciones en tablas:**
- Departamento (1) — (N) Municipio  
- Municipio (1) — (N) Evento  
- Evento (N) — (1) Fecha  
- Evento (N) — (1) Ubicación  
- Evento (1) — (N) Víctima  
- Género (1) — (N) Víctima  

---