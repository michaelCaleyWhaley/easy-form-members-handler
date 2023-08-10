import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

import { AWS_REGION, TABLE_NAME } from '../../constants/aws';

type CreateMemberCountArgs = { metadataAccessKey: string; userEmail: string };
type CreateMemberCountReturn = {
  registeredDestination: string;
};

async function createMember({
  metadataAccessKey,
  userEmail,
}: CreateMemberCountArgs): Promise<CreateMemberCountReturn> {
  const client = new DynamoDBClient({ region: AWS_REGION });

  const command = new UpdateItemCommand({
    TableName: TABLE_NAME,
    Key: {
      accessKey: { S: metadataAccessKey },
    },
    UpdateExpression: 'SET destination = if_not_exists(destination, :start)',
    ExpressionAttributeValues: {
      ':start': { S: userEmail },
    },
    ReturnValues: 'ALL_NEW',
  });

  try {
    const results = await client.send(command);
    console.log('dynamoResponse: ', results);
    const {
      destination: { S: registeredDestination },
    } = results.Attributes;
    return { registeredDestination };
  } catch (err) {
    console.error(err);
    return { registeredDestination: null };
  }
}

export { createMember };
