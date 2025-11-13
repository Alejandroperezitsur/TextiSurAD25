import { createMocks } from 'node-mocks-http';
import seedHandler from '../src/pages/api/seed';
import loginHandler from '../src/pages/api/login';

async function run() {
  const { req: seedReq, res: seedRes } = createMocks({ method: 'GET' });
  await seedHandler(seedReq as any, seedRes as any);
  const seedStatus = seedRes._getStatusCode();
  const seedData = seedRes._getData();
  console.log('Seed Status:', seedStatus);
  console.log('Seed Data:', seedData);

  const { req: loginReq, res: loginRes } = createMocks({ method: 'POST', body: { email: 'denis@textisur.com', password: 'password123' } });
  await loginHandler(loginReq as any, loginRes as any);
  const loginStatus = loginRes._getStatusCode();
  const loginData = loginRes._getData();
  console.log('Login Status:', loginStatus);
  console.log('Login Data:', loginData);
}

run().catch((e) => { console.error(e); process.exit(1); });
