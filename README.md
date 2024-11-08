# EVAL360: Administrador de evaluaciones de 360 grados

Este proyecto es un administrador de evaluaciones hechas por los empleados de una determinada empresa. Cada empleado autenticado responde a una serie de preguntas
y en base a los resultados se muestra una serie de métricas en el dashboard, que refleja una tendencia general de ciertas aptitudes. A nivel de flujos la aplicación consta de lo siguiente:

-Login

-Dashboard

-Perfil

-Evaluación

-Creación de empleados/usuarios (rol administrador)

-Creación de evaluaciones (rol administrador)



## Instalación

Para instalar las dependencias, ejecuta el siguiente comando:

`npm install`

## Ejecución

Para ejecutar la aplicación (modo desarrollo), utiliza:

`npm run dev`


## Pruebas

Para ejecutar las pruebas unitarias e integrales:

`npm test`


## Despliegue

La aplicación está desplegada en: [eval360-sermedina.netlify.app](https://eval360-sermedina.netlify.app/)

### Credenciales para pruebas:

- **Administrador**  
  Usuario: `admin`  
  Contraseña: `admin123`

- **Empleado**  
  Usuario: `pedro1`  
  Contraseña: `pedro123`

## Descripción

Este proyecto es una aplicación React que permite a un **administrador** gestionar empleados y evaluaciones, y a los **empleados** responder sus evaluaciones asignadas.

### Funcionalidades:

- **Roles de usuario**:  
  - Administrador: Puede ver el Dashboard, gestionar empleados y evaluaciones.
  - Empleado: Puede ver su perfil y responder a la evaluación asignada.
  
- **Persistencia**:  
  Los datos (empleados, evaluaciones y respuestas) se almacenan en [jsonbin.io](https://jsonbin.io/).
  
- **Evaluaciones**:  
  El administrador puede crear evaluaciones con una fecha límite (visible en un calendario). Los empleados pueden completar la evaluación activa.
  
- **Gráficos**:  
  El Dashboard incluye gráficos que muestran estadísticas basadas en las respuestas de los empleados.
  
- **Calendario**:  
  Las fechas límite de las evaluaciones se muestran en rojo dentro del calendario.

  - **Modo oscuro**:  
  Dentro del menú de perfil, se puede cambiar toda la aplicación a modo oscuro.

### Decisiones de diseño:

- **Persistencia de datos**: Se utilizan tres bins en jsonbin.io:  
  1. Para empleados/usuarios.  
  2. Para evaluaciones.  
  3. Para respuestas.
  
- **Sesiones**:  
  - La autenticación se gestiona con la API Context de React.  
  - La sesión se almacena en el localStorage.
  
- **API**:  
  - Todas las peticiones de datos se realizan mediante `fetch`.

## Tecnologías utilizadas

- [**React**](https://reactjs.org/): Framework principal para la creación de la aplicación.
- [**TypeScript**](https://www.typescriptlang.org/): Se utilizó para asegurar tipado estático y mayor robustez en el código.
- [**React Router**](https://reactrouter.com/): Manejo de rutas dentro de la aplicación.
- [**Tailwind CSS**](https://tailwindcss.com/): Biblioteca para el diseño y estilizado de los componentes.
- [**Tremor**](https://www.tremor.so/): Biblioteca utilizada para la construcción de los componentes de UI.
- [**Recharts**](https://recharts.org/en-US/): Se utilizó para la creación de gráficos estadísticos en el dashboard.
- [**React Calendar**](https://www.npmjs.com/package/react-calendar): Para la visualización de fechas límite en el calendario.
- [**Jest**](https://jestjs.io/): Framework utilizado para las pruebas unitarias e integrales.
- [**jsonbin.io**](https://jsonbin.io/): Servicio utilizado para el almacenamiento de datos persistentes.


