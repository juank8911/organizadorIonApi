const bcrypt = require('bcrypt');
const Task = require('../models/Task');
const User = require('../models/User');
const jwt = require('../config/jwt');
const passwordGenerate = require('../config/passwordGenerate');
const { generateToken } = require('../config/jwt');
const LogTask = require('../middlewares/LogTask');

const TaskController = {
  async create(req, res) {
    try {
      // Verificar si el usuario tiene perfil de administrador
      const userReq = req.user;
            const token = req.headers.authorization;
      // Asignar la tarea a un usuario ejecutor
      const decoded = await jwt.verifyToken(token);

      console.log(decoded);

      

      const { titulo, descripcion, fechaVencimiento, asignadoA } = req.body;

      console.log(asignadoA);

      await User.findById(asignadoA).then(async (user) => {

        if (user.perfil == 'ejec') {

          const nuevaTarea = new Task({
            creadoPor: decoded.id,
            titulo,
            descripcion,
            fechaVencimiento,
            asignadoA: user.id,
          });

            nuevaTarea.save().then((task) => {
            res.status(200).send({ task, ok: true });
          });
        } else {
          // LogTask.logAction(nuevaTarea._id, userReq.id, 'Creación de tarea');
          res.status(500).send({ ok: false, msj: 'Solo se puede asignar tareas a usuarios con perfil de ejecutor' });
        }
      });
    } catch (error) {
      console.log('Error al crear una tarea:', error);
      res.status(500).send({ error: 'Error al crear una tarea' });
    }
  },

  async update(req, res) {
    try {
      // Verificar si el usuario tiene perfil de administrador
      if (req.user.perfil === 'admin') {
        // Actualizar la tarea en la base de datos
        const taskId = req.params.id;
        const { estado, fechaVencimiento, comentario } = req.body;
  
        const updatedTask = await Task.findByIdAndUpdate(taskId, { estado, fechaVencimiento }, { new: true });
  
        if (!updatedTask) {
          return res.status(404).send({ error: 'Tarea no encontrada', ok: false });
        }
  
        // Agregar comentario a la tarea
        if (comentario) {
          updatedTask.comentarios.push(comentario);
          await updatedTask.save();
        }
  
        // Registrar la acción de actualización
        await LogTask.logAction(taskId, req.user.userId, 'Actualización de tarea');
  
        // Enviar la respuesta con la tarea actualizada
        res.status(200).send(updatedTask);
      } else if (req.user.perfil === 'ejec') {
        // Verificar si la tarea está en estado asignado
        const taskId = req.params.id;
        const task = await Task.findById(taskId);
  
        if (!task) {
          return res.status(404).send({ error: 'Tarea no encontrada', ok: false });
        }
  
        if (task.estado !== 'asignado') {
          return res.status(403).send({ error: 'No tienes permiso para actualizar la tarea', ok: false });
        }
  
        // Solo permitir actualizar la fecha de vencimiento si la tarea no se ha cumplido
        if (task.fechaVencimiento > Date.now()) {
          const { fechaVencimiento, comentario } = req.body;
  
          const updatedTask = await Task.findByIdAndUpdate(taskId, { fechaVencimiento }, { new: true });
  
          if (!updatedTask) {
            return res.status(404).send({ error: 'Tarea no encontrada', ok: false });
          }
  
          // Agregar comentario a la tarea
          if (comentario) {
            updatedTask.comentarios.push(comentario);
            await updatedTask.save();
          }
  
          // Registrar la acción de actualización
          await LogTask.logAction(taskId, req.user.userId, 'Actualización de tarea (fecha de vencimiento)');
  
          // Enviar la respuesta con la tarea actualizada
          res.status(200).send(updatedTask);
        } else {
          return res.status(403).send({ error: 'No puedes actualizar la tarea porque ya se ha cumplido', ok: false });
        }
      } else {
        return res.status(403).send({ error: 'No tienes permiso para actualizar la tarea', ok: false });
      }
    } catch (error) {
      console.error('Error al actualizar una tarea:', error);
      res.status(500).send({ error: 'Error al actualizar una tarea', ok: false });
    }
  },
  
  async updateEstado(req, res) {
    try {
      // Verificar si el usuario tiene perfil de administrador

      // Verificar si la tarea está en estado asignado

      // Actualizar la tarea en la base de datos
      const taskId = req.params.id;
      const { estado } = req.body;
      const user = req.user;
      const updatedTask = await Task.findByIdAndUpdate(taskId, { estado }, { new: true });

      if (!updatedTask) {
        return res.status(404).send({ error: 'Tarea no encontrada', ok: false });
      }

      // Registrar la acción de actualización
      await LogTask.logAction(taskId, req.user.id, 'Actualización de estado de tarea');

      // Enviar la respuesta con la tarea actualizada
      res.status(200).send(updatedTask);
    } catch (error) {
      console.error('Error al actualizar una tarea:', error);
      res.status(500).send({ error: 'Error al actualizar una tarea', ok: false });
    }
  },

  async delete(req, res) {
    try {
      // Verificar si el usuario tiene perfil de administrador
      const taskId = req.params.id;
      // Verificar si la tarea está en estado asignado
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).send({ error: 'Tarea no encontrada' });
      }

      if (task.estado !== 'asignado') {
        return res.status(300).send({
          error: 'Tarea con Estado diferente al permitido para realizar esta acción',
          ok: false,
        });
      }

      // Registrar la acción de eliminación
      await LogTask.logAction(taskId, req.user.id, 'Eliminación de tarea');

      await Task.findByIdAndDelete(taskId);

      res.status(200).send({ message: 'Tarea eliminada exitosamente', ok: true });
    } catch (error) {
      console.error('Error al eliminar una tarea:', error);
      res.status(500).send({ error: 'Error al eliminar una tarea', ok: false });
    }
  },

  async list(req, res) {
    try {
   
        var Tasks = await Task.find();
        if (Tasks) {
          res.status(200).send({ Tasks, ok: true });
        } else {
          res.status(404).send({ ok: false });
        }
      
    } catch (errors) {
      console.error(errors);
    }
  },


  async listTaskAsignedEject(req, res) {
    try {
      const userId = req.params.id;
      
      const tasks = await Task.find({ asignadoA: userId });

      if (tasks.length === 0) {
        return res.status(404).send({ error: 'No se encontraron tareas asignadas al usuario', ok: false });
      }

      res.status(200).send({ tasks, ok: true });
    } catch (error) {
      console.error('Error al listar tareas asignadas a un usuario:', error);
      res.status(500).send({ error: 'Error al listar tareas asignadas a un usuario', ok: false });
    }
  },

  async listTaskCreatedAdmin(req, res) {
    try {
      const userId = req.params.id;
      
      const tasks = await Task.find({ creadoPor: userId });

      if (tasks.length === 0) {
        return res.status(404).send({ error: 'No se encontraron tareas asignadas al usuario', ok: false });
      }

      res.status(200).send({ tasks, ok: true });
    } catch (error) {
      console.error('Error al listar tareas asignadas a un usuario:', error);
      res.status(500).send({ error: 'Error al listar tareas asignadas a un usuario', ok: false });
    }
  },

};

module.exports = TaskController;
