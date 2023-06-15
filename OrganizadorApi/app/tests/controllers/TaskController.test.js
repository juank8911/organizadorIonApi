describe('TaskController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    test('should create a new task', async () => {
      const req = {
        headers: { authorization: 'Bearer toeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImprIiwicGVyZmlsIjoiYWRtaW4iLCJpZCI6IjY0ODc3MmVmOWZhYzI0YWI2MDc5MDFiMCIsInBhc3N3b3JkIjoiJDJiJDEwJHdvYVdLWGNGS05pUW5kWmFhbnBmM2V2NS83SHhNSlU1MzBreVhhRGlSLzNxOTBibjdKSTdHIiwiaWF0IjoxNjg2NzI4OTE5fQ.Cfw3zTAPGeZHZ3xe3AggJf-_7Y_5pvh40nICRP7CtSgken' },
        body: {
          creadoPor: "648772ef9fac24ab607901b0",
          titulo: "Planeacion_3",
          descripcion: "tareas de Planeacion_2 para el Desarrollo",
          fechaVencimiento: "2023-06-17T05:00:00.000Z",
          asignadoA: "6487c64431e411191a6cde3f",
          estado: "asignado",
          _id: "648918748f191f0ccda8cd25",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockVerifyToken = jest.fn().mockResolvedValue({ id: '6489721eab7a4611ea8b6821' });
      jwt.verifyToken.mockImplementationOnce(mockVerifyToken);
      User.findById.mockResolvedValue({ _id: '648772ef9fac24ab607901b0', perfil: 'ejec' });
      const mockSave = jest.fn().mockResolvedValue({ _id: 'new_task_id' });
      Task.prototype.save = mockSave;
      LogTask.logAction.mockResolvedValue();

      await TaskController.create(req, res);

      expect(mockVerifyToken).toHaveBeenCalledWith('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImprIiwicGVyZmlsIjoiYWRtaW4iLCJpZCI6IjY0ODc3MmVmOWZhYzI0YWI2MDc5MDFiMCIsInBhc3N3b3JkIjoiJDJiJDEwJHdvYVdLWGNGS05pUW5kWmFhbnBmM2V2NS83SHhNSlU1MzBreVhhRGlSLzNxOTBibjdKSTdHIiwiaWF0IjoxNjg2NzI4OTE5fQ.Cfw3zTAPGeZHZ3xe3AggJf-_7Y_5pvh40nICRP7CtSg');
      expect(User.findById).toHaveBeenCalledWith('648772ef9fac24ab607901b0');
      expect(mockSave).toHaveBeenCalled();
      // expect(LogTask.logAction).toHaveBeenCalledWith('new_task_id', 'created', 'assigned_user_id');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task created successfully' });
    });

    test('should send an error if assigned user does not have the correct profile', async () => {
      const req = {
        headers: { authorization: 'Bearer toeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImprIiwicGVyZmlsIjoiYWRtaW4iLCJpZCI6IjY0ODc3MmVmOWZhYzI0YWI2MDc5MDFiMCIsInBhc3N3b3JkIjoiJDJiJDEwJHdvYVdLWGNGS05pUW5kWmFhbnBmM2V2NS83SHhNSlU1MzBreVhhRGlSLzNxOTBibjdKSTdHIiwiaWF0IjoxNjg2NzI4OTE5fQ.Cfw3zTAPGeZHZ3xe3AggJf-_7Y_5pvh40nICRP7CtSgken' },
        body: {
          creadoPor: "648772ef9fac24ab607901b0",
          titulo: "Planeacion_3",
          descripcion: "tareas de Planeacion_2 para el Desarrollo",
          fechaVencimiento: "2023-06-17T05:00:00.000Z",
          asignadoA: "6487c64431e411191a6cde3f",
          estado: "asignado",
          _id: "648918748f191f0ccda8cd25",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockVerifyToken = jest.fn().mockResolvedValue({ id: '648772ef9fac24ab607901b0' });
      jwt.verifyToken.mockImplementationOnce(mockVerifyToken);
      User.findById.mockResolvedValue({ _id: '6487c64431e411191a6cde3f', perfil: '648772ef9fac24ab607901b0' });

      await TaskController.create(req, res);

      expect(mockVerifyToken).toHaveBeenCalledWith('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImprIiwicGVyZmlsIjoiYWRtaW4iLCJpZCI6IjY0ODc3MmVmOWZhYzI0YWI2MDc5MDFiMCIsInBhc3N3b3JkIjoiJDJiJDEwJHdvYVdLWGNGS05pUW5kWmFhbnBmM2V2NS83SHhNSlU1MzBreVhhRGlSLzNxOTBibjdKSTdHIiwiaWF0IjoxNjg2NzI4OTE5fQ.Cfw3zTAPGeZHZ3xe3AggJf-_7Y_5pvh40nICRP7CtSg');
      expect(User.findById).toHaveBeenCalledWith('6487c64431e411191a6cde3f');
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'User does not have the required profile' });
    });

    test('should handle general errors', async () => {
      const req = {
        headers: { authorization: 'Bearer toeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImprIiwicGVyZmlsIjoiYWRtaW4iLCJpZCI6IjY0ODc3MmVmOWZhYzI0YWI2MDc5MDFiMCIsInBhc3N3b3JkIjoiJDJiJDEwJHdvYVdLWGNGS05pUW5kWmFhbnBmM2V2NS83SHhNSlU1MzBreVhhRGlSLzNxOTBibjdKSTdHIiwiaWF0IjoxNjg2NzI4OTE5fQ.Cfw3zTAPGeZHZ3xe3AggJf-_7Y_5pvh40nICRP7CtSgken' },
        body: {
          creadoPor: "648772ef9fac24ab607901b0",
          titulo: "Planeacion_3",
          descripcion: "tareas de Planeacion_2 para el Desarrollo",
          fechaVencimiento: "2023-06-17T05:00:00.000Z",
          asignadoA: "6487c64431e411191a6cde3f",
          estado: "asignado",
          _id: "648918748f191f0ccda8cd25",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockVerifyToken = jest.fn().mockRejectedValue(new Error('Token verification failed'));
      jwt.verifyToken.mockImplementationOnce(mockVerifyToken);

      await TaskController.create(req, res);

      expect(mockVerifyToken).toHaveBeenCalledWith('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImprIiwicGVyZmlsIjoiYWRtaW4iLCJpZCI6IjY0ODc3MmVmOWZhYzI0YWI2MDc5MDFiMCIsInBhc3N3b3JkIjoiJDJiJDEwJHdvYVdLWGNGS05pUW5kWmFhbnBmM2V2NS83SHhNSlU1MzBreVhhRGlSLzNxOTBibjdKSTdHIiwiaWF0IjoxNjg2NzI4OTE5fQ.Cfw3zTAPGeZHZ3xe3AggJf-_7Y_5pvh40nICRP7CtSg');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});
