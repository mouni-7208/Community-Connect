import express from "express";
import {
  createProject,
  getProject,
  listProjects,
  deleteProject
} from "../models/Project.js";

const router = express.Router();

// ✅ Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await listProjects();
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (err) {
    console.error("Error listing projects:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Get single project
router.get("/:id", async (req, res) => {
  try {
    const project = await getProject(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Create new project
router.post("/", async (req, res) => {
  try {
    const project = await createProject(req.body);
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project
    });
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Delete project
router.delete("/:id", async (req, res) => {
  try {
    await deleteProject(req.params.id);
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

// ✅ Volunteer Apply to Project
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const dynamo = new AWS.DynamoDB.DocumentClient({ region: "ap-south-1" });
const APPLICATIONS_TABLE = "ApplicationsTable";
const sns = new AWS.SNS({ region: "ap-south-1" }); // ✅ initialize SNS client

router.post("/:id/apply", async (req, res) => {
  try {
    const { volunteerId, name, email } = req.body;
    const projectId = req.params.id;

    if (!volunteerId || !projectId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Prevent duplicate applications
    const existing = await dynamo
      .scan({
        TableName: APPLICATIONS_TABLE,
        FilterExpression: "projectId = :p AND volunteerId = :v",
        ExpressionAttributeValues: { ":p": projectId, ":v": volunteerId }
      })
      .promise();

    if (existing.Items && existing.Items.length > 0) {
      return res.status(400).json({ success: false, message: "Already applied" });
    }

    const applicationId = uuidv4();
    const appliedAt = new Date().toISOString();
    
    const item = {
      applicationId, // <-- required partition key
      projectId,
      volunteerId,
      name,
      email,
      status: "Pending",
      appliedAt
    };

    console.log("DEBUG: putting item into ApplicationsTable:", JSON.stringify(item));
    await dynamo.put({
        TableName: APPLICATIONS_TABLE,
        Item: item
	    //{
          //applicationId,
          //projectId,
          //volunteerId,
          //name,
          //email,
          //status: "Pending",
          //appliedAt
        //}
       }).promise();

    try {
      const sns = new AWS.SNS({ region: "ap-south-1" });
      const message = `New volunteer "${name}" (${email}) has applied to project ID: ${projectId}`;
      await sns.publish({
        Message: message,
        Subject: "New Volunteer Application - Community Connect",
        TopicArn: process.env.SNS_TOPIC_ARN, // must be in .env file
      }).promise();
     } catch (snsError){
       console.warm("SNS notification failed:" , snsError.message);
     }

    res.status(201).json({ success: true, message: "Application submitted successfully" });
  } catch (err) {
    console.error("Apply error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});
