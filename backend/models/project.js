import { PutCommand, GetCommand, ScanCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import dynamo from "../utils/dynamoClient.js";
import { v4 as uuidv4 } from "uuid";

const TABLE = "ProjectsTable";

// Create a new project
export const createProject = async (projectData) => {
  const project = {
    projectId: uuidv4(),
    ...projectData,
    createdAt: new Date().toISOString(),
  };

  await dynamo.send(new PutCommand({
    TableName: TABLE,
    Item: project,
  }));
  return project;
};

// Get one project
export const getProject = async (projectId) => {
  const res = await dynamo.send(new GetCommand({
    TableName: TABLE,
    Key: { projectId },
  }));
  return res.Item;
};

// List all projects
export const listProjects = async () => {
  const res = await dynamo.send(new ScanCommand({ TableName: TABLE }));
  return res.Items || [];
};

// Delete a project
export const deleteProject = async (projectId) => {
  await dynamo.send(new DeleteCommand({
    TableName: TABLE,
    Key: { projectId },
  }));
  return { message: "Project deleted" };
};
