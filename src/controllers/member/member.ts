import { QueryStringParameters } from '../..';
import { MEMBER_FAIL, MEMBER_SUCCESS } from '../../constants/response';
import { createMember } from '../../database/create-member';

export type SuccessReturn = {
  success: {
    message: string;
    body: { uuid: string; userEmail: string };
  };
};

export type ErrorReturn = { error?: { message: string } };

async function member({
  uuid,
  userEmail,
  queryStringParameters,
}: {
  uuid: string;
  userEmail: string;
  queryStringParameters: QueryStringParameters;
}): Promise<SuccessReturn | ErrorReturn> {
  console.log('uuid,: ', uuid);
  console.log('queryStringParameters,: ', queryStringParameters);

  const memberCreated = await createMember({
    metadataAccessKey: uuid,
    userEmail,
  });

  if (!memberCreated.registeredDestination) {
    return { error: { message: MEMBER_FAIL } };
  }

  return {
    success: { message: MEMBER_SUCCESS, body: { uuid, userEmail } },
  };
}

export { member };
