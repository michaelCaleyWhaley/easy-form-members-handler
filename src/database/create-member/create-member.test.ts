import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

import { AWS_REGION, TABLE_NAME } from '../../constants/aws';
import { createMember } from './create-member';

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

describe('createMember', () => {
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should return updated request count and registered destination', async () => {
    const metadataAccessKey = 'access-key';

    const result = await createMember({
      metadataAccessKey,
      userEmail: 'fakeemail',
    });

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
      UpdateExpression: 'SET destination = if_not_exists(destination, :start)',
      ExpressionAttributeValues: {
        ':start': { S: 'fakeemail' },
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

    const result = await createMember({
      metadataAccessKey,
      userEmail: 'fakeemail',
    });

    expect(result).toEqual({
      requestCount: 0,
      registeredDestination: null,
    });
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});
