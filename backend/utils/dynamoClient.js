import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: "eu-north-1"
});

const dynamo = DynamoDBDocumentClient.from(client);

export default dynamo;
