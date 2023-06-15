const bcrypt = require('bcrypt');
const User = require('../../models/User');
const UserController = require('../../controllers/UserController');
const jwt = require('jsonwebtoken');

// Mock para User.findOne
jest.mock('../models/User', () => ({
  findOne: jest.fn(),
}));

// Mock para bcrypt.compare
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

// Mock para jwt.verify
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('UserController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const req = {
        body: {
          nombres:"Usuario",
          apellidos:"Prueba",
          correo:"prueba@prueba.com",
          username:"UsuPrueba",
          perfil:"admin"
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock para User.save
      User.prototype.save = jest.fn().mockResolvedValueOnce({});

      // Mock para bcrypt.hash
      bcrypt.hash = jest.fn().mockResolvedValueOnce('hashedPassword');

      await UserController.register(req, res);

      expect(User.prototype.save).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ usuario: expect.any(Object), password: expect.any(String), ok: true });
    });

    it('should handle errors during registration', async () => {
      const req = {
        body: {
          nombres:"Usuario2",
          apellidos:"Prueba2",
          correo:"prueba2@prueba.com",
          username:"UsuPrueba2",
          perfil:"admin"
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock para User.save que devuelve un error
      User.prototype.save = jest.fn().mockRejectedValueOnce('Registration error');

      await UserController.register(req, res);

      expect(User.prototype.save).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error al registrar un usuario', ok: false, msj: 'Registration error' });
    });
  });

  describe('login', () => {
    it('should login a user with correct credentials', async () => {
      const req = {
        body: {
          username:"jk",
          password:"4D5F2?t9fs"
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const user = {
        
          username:"jk",
          password:"4D5F2?t9fs",
        primerInicioSesion: false,
        
      };

      // Mock para User.findOne que devuelve un usuario existente
      User.findOne.mockResolvedValueOnce(user);

      // Mock para bcrypt.compare que devuelve true
      bcrypt.compare.mockResolvedValueOnce(true);

      // Mock para jwt.verify que devuelve el token decodificado
      jwt.verify.mockResolvedValueOnce({ username: 'testuser', perfil: 'ejec', id: 'user_id' });

      await UserController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        usuario: expect.any(Object),
        token: expect.any(String),
        ok: true,
      });
    });

    it('should handle incorrect credentials during login', async () => {
      const req = {
        body: {
          username:"jk",
          password:"4D5F2?t9fs"
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock para User.findOne que no encuentra un usuario
      User.findOne.mockResolvedValueOnce(null);

      await UserController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Credenciales inválidas',
        ok: false,
      });
    });

    it('should handle errors during login', async () => {
      const req = {
        body: {
          username:"jk",
          password:"4D5F2?t9fs"
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const user = {
          username:"jk",
          password:"4D5F2?t9fs",
        primerInicioSesion: false,
        // ...
      };

      // Mock para User.findOne que devuelve un usuario existente
      User.findOne.mockResolvedValueOnce(user);

      // Mock para bcrypt.compare que devuelve false
      bcrypt.compare.mockResolvedValueOnce(false);

      await UserController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Credenciales inválidas',
        ok: false,
      });
    });
  });
});
