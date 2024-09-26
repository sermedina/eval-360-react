Prueba técnica para Nolatech


La aplicación se encuentra desplegada en https://prueba-nolatech-sermedina.netlify.app/

usuario admin
admin
admin123

usuario empleado
pedro1
pedro123

Decisiones de diseño y código:

  Lógica

  -Se comenzó por la persistencia, los datos son guardados en jsonbin.io.
    -Bin para los empleados/usuarios.
    -Bin para los formularios de evaluaciones.
    -Bin para las respuestas.

  -El login accede a usuarios alojados en jsonbin.io .Existen dos roles: admin y empleado.
  
  -El administrador puede ver el dashboard, crear empleados y crear evaluaciones.
  
  -El empleado puede acceder al formulario de su evaluación. El formulario de evaluación es seleccionado por el admin.

  -Por simplicidad, al momento de crearse un empleado por el admin también se le puede crear el usuario y la contraseña.


  Código:

  -El proyecto está enteramente hecho en Typescript.

  -Para la autenticación se usó un contexto. Los datos de estado global que se obtienen son: usuario y contraseña,
  token de sesión y nombre del empleado.

  -La sesión es guardada en el localstorage.

  -Se usó react-router-dom para las rutas.

  -Todas las peticiones a API están hechas con fetch



  Bibliotecas:

   -Para la UI se usó Tremor para los componentes.

   -Para los estilos se uso Tailwind CSS.

   -Para los gráficos se usó Chart.js
