import { rest, RestRequest } from 'msw';
import { setupServer } from 'msw/node';
import { http } from 'utils/http';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const server = setupServer();

beforeAll(() => server.listen());
afterAll(() => server.close());
// 每个测试后重置路由
afterEach(() => server.resetHandlers());

test('http发送异步请求', async () => {
  const endpoint = 'mock-test';
  const mockResult = { mockValue: 'ok' };

  server.use(rest.get(`${apiUrl}/${endpoint}`, (req, res, ctx) => res(ctx.json(mockResult))));

  const result = await http(endpoint);
  expect(result).toEqual(mockResult);
});

test('http发送请求时会在header中带上token', async () => {
  const endpoint = 'mock-test2';
  const token = 'FAKE_TOKEN';
  const mockResult = { mockValue: 'ok' };
  let request: any;

  server.use(
    rest.get(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      request = req;
      return res(ctx.json(mockResult));
    })
  );

  await http(endpoint, { token });
  expect(request.headers.get('Authorization')).toEqual(`Bearer ${token}`);
});
