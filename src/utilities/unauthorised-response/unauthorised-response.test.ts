import { unauthorisedResponse } from './unauthorised-response';

describe('unauthorisedResponse', () => {
  it('should return the expected unauthorized response', () => {
    const errorMessage = 'Unauthorized access';
    const message = { error: { message: errorMessage } };

    const response = unauthorisedResponse(message);

    const expectedResponse = {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    };

    expect(response).toEqual(expectedResponse);
  });
});
