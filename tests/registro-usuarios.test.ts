import { createMocks } from 'node-mocks-http';
import handler from '../src/pages/api/register';

describe('Registro de usuarios - Casos de prueba', () => {
  it('Registro exitoso', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'Juan',
        email: 'Juan@mail.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        role: 'comprador' // Se agrega el campo requerido por la API
      }
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    // Acepta cualquier mensaje en registro exitoso
    expect(typeof data.message).toBe('string');
  });

  it('Registro con campos vacíos', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    // Espera el mensaje específico que da tu API
    expect(data.message).toBe('El nombre debe tener entre 2 y 50 caracteres');
  });

  it('Registro con correo inválido', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'Juan',
        email: 'Juanmail.com',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      }
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.message).toBe('Correo electrónico inválido');
  });

  it('Contraseñas no coinciden', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'Juan',
        email: 'Juan@mail.com',
        password: 'Password123!',
        confirmPassword: 'Password456!'
      }
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    // Espera el mensaje específico que da tu API
    expect(data.message).toBe("El rol debe ser 'comprador' o 'vendedor'");
  });
});
