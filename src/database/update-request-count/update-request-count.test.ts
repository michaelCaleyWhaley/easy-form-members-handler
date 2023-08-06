import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

import { AWS_REGION, TABLE_NAME } from '../../constants/aws';
import { updateRequestCount } from './update-request-count';

jest.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: jest.fn(() => ({
    send: jest.fn().mockResolvedValue({
      Attributes: {
        requestCount: { N: '2' },
        destination: { S: 'recipient@example.com' },
      },
    }),
  })),
  UpdateItemCommand: jest.fn(),
}));

describe('updateRequestCount', () => {
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should return updated request count and registered destination', async () => {
    const metadataAccessKey = 'access-key';

    const result = await updateRequestCount({ metadataAccessKey });

    expect(result).toEqual({
      requestCount: 2,
      registeredDestination: 'recipient@example.com',
    });

    expect(DynamoDBClient).toHaveBeenCalledWith({ region: AWS_REGION });
    expect(UpdateItemCommand).toHaveBeenCalledWith({
      TableName: TABLE_NAME,
      Key: {
        accessKey: { S: metadataAccessKey },
      },
      UpdateExpression:
        'SET requestCount = if_not_exists(requestCount, :start) + :incrementValue',
      ExpressionAttributeValues: {
        ':incrementValue': { N: '1' },
        ':start': { N: '0' },
      },
      ReturnValues: 'ALL_NEW',
    });
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should handle error and return default values', async () => {
    const metadataAccessKey = 'access-key';

    (DynamoDBClient as jest.Mock).mockImplementation(() => ({
      send: jest.fn().mockRejectedValue(new Error('DynamoDB error')),
    }));

    const result = await updateRequestCount({ metadataAccessKey });

    expect(result).toEqual({
      requestCount: 0,
      registeredDestination: null,
    });
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});
