import { authorisedResponse } from './authorised-response';

describe('authorisedResponse', () => {
  it('should return the expected response object', () => {
    const response = authorisedResponse({ body: 'test' });

    const expectedResponse = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify('test'),
    };

    expect(response).toEqual(expectedResponse);
  });
});
