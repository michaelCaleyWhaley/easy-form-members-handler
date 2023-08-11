import { authorisedResponse } from './authorised-response';

describe('authorisedResponse', () => {
  it('should return the expected response object', () => {
    const response = authorisedResponse({
      success: { body: { uuid: 'test', userEmail: 'ddsd' }, message: 'sddsf' },
    });

    const expectedResponse = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: '{"success":{"body":{"uuid":"test","userEmail":"ddsd"},"message":"sddsf"}}',
    };

    expect(response).toEqual(expectedResponse);
  });
});
