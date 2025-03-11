# 📖 MultiHimnario - Aplicación de Himnarios Multiplataforma  

MultiHimnario es una aplicación móvil que permite a los usuarios acceder a un catálogo de diferentes himnarios, facilitando la búsqueda y selección de himnos sin necesidad de múltiples libros físicos.  

## 🛠️ Tecnologías Utilizadas  
```plaintext
Frontend: React Native (JavaScript) con Expo  
Backend: Node.js con Express  
Base de Datos: MongoDB (Docker)  
Internacionalización: i18n para soporte multilingüe  
```

## 🚀 Instalación y Configuración  

### 1️⃣ Configurar la IP Local  
Busca la dirección **IPv4** de tu red local para conectarte correctamente al backend y la base de datos.  

#### 📌 Windows  
```sh
ipconfig
```
Busca en el apartado `"Adaptador de LAN inalámbrica Wi-Fi"` la dirección **IPv4** y cópiala.  

#### 📌 Linux / macOS  
```sh
ifconfig
```
Copia la dirección **inet** de la interfaz de red activa.  

> **Nota:** Agrega esta dirección en los archivos de configuración del **backend y frontend**.  

---

### 2️⃣ Iniciar la Base de Datos (MongoDB con Docker)  
Levanta MongoDB en un contenedor de Docker con el siguiente comando:  

```sh
docker run --name multihimnario-db -d -p 27017:27017 mongo
```
Verifica que el contenedor está corriendo:  

```sh
docker ps
```  

Si necesitas detener o reiniciar el contenedor:  

```sh
docker stop multihimnario-db
docker start multihimnario-db
```

---

### 3️⃣ Ejecutar el Backend  
Navega al directorio del backend:  
```sh
cd backend
```
Instala las dependencias necesarias:  
```sh
npm install
```
Inicia el servidor:  
```sh
npm start
```
Si todo está correcto, deberías ver:  
```plaintext
✅ Servidor corriendo en http://<TU_IP>:3000
```

📌 **Configuración de variables de entorno**  
Crea un archivo **.env** en el directorio `backend` con las siguientes variables:  
```plaintext
PORT=3000
MONGO_URI=mongodb://localhost:27017/multihimnario
```

---

### 4️⃣ Ejecutar el Frontend  
Navega al directorio del frontend:  
```sh
cd frontend
```
Instala las dependencias necesarias:  
```sh
npm install
```
Inicia la aplicación con Expo:  
```sh
npx expo start
```
📱 **Visualizar la aplicación**  
Escanea el código QR con la app de **Expo Go** en tu dispositivo móvil para ver la app en acción.  

📌 **Configuración de la API en el frontend**  
Edita el archivo de configuración `config.js` en el frontend y coloca la dirección del backend:  
```js
export const API_URL = "http://<TU_IP>:3000";
```

---

### 5️⃣ Probar la API con Postman  
Para verificar que el backend responde correctamente, realiza una petición GET a:  

```sh
http://<TU_IP>:3000/api/himnarios
```

Si el servidor está funcionando, recibirás una respuesta JSON como esta:  
```json
[
  {
    "id": 1,
    "nombre": "Himnario Adventista",
    "idioma": "Español"
  },
  {
    "id": 2,
    "nombre": "Himnario Cristiano",
    "idioma": "Inglés"
  }
]
```

---

## 📂 Estructura del Proyecto  
```plaintext
MultiHimnario/
│── backend/            # Código del backend (Node.js + Express)
│   ├── controllers/    # Controladores de las rutas
│   ├── models/         # Modelos de la base de datos (MongoDB)
│   ├── routes/         # Definición de las rutas API
│   ├── config.js       # Configuración del servidor
│   ├── server.js       # Archivo principal del servidor
│   ├── package.json    # Dependencias y configuración de Node.js
│── frontend/           # Código del frontend (React Native + Expo)
│   ├── components/     # Componentes reutilizables
│   ├── screens/        # Pantallas principales de la app
│   ├── assets/         # Imágenes y recursos estáticos
│   ├── App.js          # Archivo principal de la aplicación
│   ├── package.json    # Dependencias y configuración de React Native
│── docker-compose.yml  # Archivo para levantar MongoDB con Docker
│── README.md           # Documentación del proyecto
```

---

### ✅ Notas y Consideraciones  
- **Asegúrate de tener Docker corriendo** antes de iniciar la base de datos.  
- **Si cambias de red**, actualiza la dirección **IPv4** en los archivos de configuración.  
- **Si tienes problemas con Expo**, intenta limpiar la caché con:  
  ```sh
  expo start -c
  ```  

📌 **Contribuciones y mejoras**  
Si deseas contribuir, abre un **pull request** o reporta problemas en la sección de **issues** del repositorio. 🚀  
