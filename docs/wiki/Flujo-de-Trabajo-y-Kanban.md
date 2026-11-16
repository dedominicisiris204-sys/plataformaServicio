# 📊 Flujo de Trabajo y Tablero Kanban

---

## 🔄 1. El Ciclo de Vida del Trabajo en SERVIRE

Uno de los aportes arquitectónicos más significativos inspirados en el diseño modular de **Odonto** es la formalización del ciclo de vida de una contratación de oficio. En lugar de tratar un servicio como un simple mensaje de texto informal, SERVIRE lo modela como una máquina de estados determinista:

```
+---------------------------+
| 1. PRESUPUESTO SOLICITADO | <=== El cliente publica la necesidad o solicita cotización
+-------------+-------------+
              |
              | (Especialista envía presupuesto formal y cliente acepta)
              v
+---------------------------+
|   2. ACEPTADO / EN CURSO  | <=== Se ejecutan las tareas pactadas
+-------------+-------------+
              |
              | (Especialista finaliza la obra o reparación)
              v
+---------------------------+
|   3. TRABAJO FINALIZADO   | <=== Listo para inspección y conformidad del cliente
+-------------+-------------+
              |
              | (Cliente califica con estrellas y deja reseña)
              v
+---------------------------+
|   4. CALIFICADO / CERRADO | <=== Cierre exitoso y consolidación de reputación
+---------------------------+
```

---

## 📌 2. Detalle de las 4 Columnas del Tablero

### 🟡 Columna 1: Presupuesto Solicitado
* **Definición:** El requerimiento ha sido creado por el cliente o ingresado como cotización tentativa.
* **Datos Visibles:** Categoría del oficio, prioridad (Normal, Media, Alta, Urgente), descripción de la tarea, cliente solicitante y monto presupuestado estimado.
* **Acción Disponible:** `Aceptar Trabajo →` (Transiciona el estado hacia la Columna 2).

### 🔵 Columna 2: Aceptado / En Curso
* **Definición:** El presupuesto fue aceptado por ambas partes. El profesional adquiere los materiales e inicia la intervención técnica.
* **Acciones Disponibles:**
  * `← Volver`: Permite retrotraer a revisión en caso de ajustes presupuestarios.
  * `Marcar Finalizado ✓`: Notifica la conclusión de las obras técnicas hacia la Columna 3.

### 🟢 Columna 3: Finalizado (Listo para Calificar)
* **Definición:** La obra física o reparación está concluida. Se encuentra en etapa de validación de conformidad por parte del usuario contratante.
* **Acciones Disponibles:**
  * `← Volver`: En caso de requerir retoques o detalles de terminación.
  * `Calificar Servicio ⭐`: Abre el modal de evaluación para asignar estrellas (1 a 5) y comentario de satisfacción.

### 🟣 Columna 4: Calificado / Cerrado
* **Definición:** El trabajo ha finalizado formalmente. La reseña queda registrada e impacta directamente en el promedio de valoración del perfil del profesional.
* **Datos Visibles:** Monto total facturado, estrellas otorgadas y testimonio del cliente.
* **Acción:** Registro histórico permanente con opción de consulta o reapertura justificada.

---

## ⚙️ 3. Implementación Técnica en React

El componente [`TrabajosKanbanView.jsx`](https://github.com/dedominicisiris204-sys/plataformaServicio/blob/main/frontend/src/components/TrabajosKanbanView.jsx) maneja el estado local y las transiciones mediante:

```javascript
const [trabajos, setTrabajos] = useState([...]);

const avanzarEstado = (id) => {
  setTrabajos(prev => prev.map(t => {
    if (t.id === id) {
      if (t.estado === "presupuesto") return { ...t, estado: "en_curso" };
      if (t.estado === "en_curso") return { ...t, estado: "finalizado" };
      if (t.estado === "finalizado") return { ...t, estado: "calificado", calificacion: 5 };
    }
    return t;
  }));
};
```
