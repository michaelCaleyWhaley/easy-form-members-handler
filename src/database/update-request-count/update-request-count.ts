import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

import { AWS_REGION, TABLE_NAME } from '../../constants/aws';

type UpdateRequestCountArgs = { metadataAccessKey: string };
type UpdateRequestCountReturn = {
  requestCount: number;
  registeredDestination: string;
};

async function updateRequestCount({
  metadataAccessKey,
}: UpdateRequestCountArgs): Promise<UpdateRequestCountReturn> {
  const client = new DynamoDBClient({ region: AWS_REGION });

  const command = new UpdateItemCommand({
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

  try {
    const results = await client.send(command);
    console.log('dynamoResponse: ', results);
    const {
      requestCount: { N: requestCount },
      destination: { S: registeredDestination },
    } = results.Attributes;
    return { requestCount: parseInt(requestCount, 10), registeredDestination };
  } catch (err) {
    console.error(err);
    return { requestCount: 0, registeredDestination: null };
  }
}

export { updateRequestCount };
