import { HandlerContext, HandlerEvent } from '../../index';
import { authorisedResponse } from './authorised-response';

describe('authorisedResponse', () => {
  it('should return the expected response object', () => {
    const event: HandlerEvent = {
      path: '/example',
      queryStringParameters: { key: 'value' },
    };
    const context: HandlerContext = {};

    const response = authorisedResponse({ event, context });

    const expectedResponse = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        flag: 'member',
        event,
        context,
      }),
    };

    expect(response).toEqual(expectedResponse);
  });
});
