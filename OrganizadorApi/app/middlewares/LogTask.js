const Task = require('../models/Task');

const LogTask = {
  async logAction(taskId, userId, action) {
    try {
      console.log(taskId, userId, action);
      console.log('taskId, userId--------------------------------');
      const task = await Task.findById(taskId);

      if (!task) {
        throw new Error('Tarea no encontrada');
      }

      task.log.push({
        usuario: userId,
        accion: action,
      });

      await task.save();
    } catch (error) {
      console.error('Error al registrar la acción:', error);
    }
  },

  async create(req, res, next) {
    try {
      // Código para crear la tarea

      // Registrar la acción de creación
      await LogTask.logAction(newTask._id, req.user.userId, 'Creación de tarea');

      // Enviar la respuesta con la tarea creada
      res.status(200).json({ task: newTask, ok: true });
    } catch (error) {
      console.error('Error al crear una tarea:', error);
      res.status(500).json({ error: 'Error al crear una tarea' });
    }
  },

  async update(req, res, next) {
    try {
      // Código para actualizar la tarea

      // Registrar la acción de actualización
      await LogTask.logAction(taskId, req.user.userId, 'Actualización de tarea');

      // Enviar la respuesta con la tarea actualizada
      res.status(200).json(updatedTask);
    } catch (error) {
      console.error('Error al actualizar una tarea:', error);
      res.status(500).json({ error: 'Error al actualizar una tarea', ok: false });
    }
  },

  async delete(req, res, next) {
    try {
      // Código para eliminar la tarea

      // Registrar la acción de eliminación
      await LogTask.logAction(taskId, req.user.userId, 'Eliminación de tarea');

      // Enviar la respuesta con el mensaje de éxito
      res.status(200).json({ message: 'Tarea eliminada exitosamente', ok: true });
    } catch (error) {
      console.error('Error al eliminar una tarea:', error);
      res.status(500).json({ error: 'Error al eliminar una tarea', ok: false });
    }
  },
};

module.exports = LogTask;
