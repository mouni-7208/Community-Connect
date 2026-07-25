import express from "express";
import AWS from "aws-sdk";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();
const dynamo = new AWS.DynamoDB.DocumentClient({ region: "ap-south-1" });
const USERS_TABLE = "VolunteersTable"; // DynamoDB table name

// Generate JWT Token
const generateToken = (volunteerId) =>
  jwt.sign({ volunteerId }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });

// ✅ Register User
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    //const existingUsers = await dynamo
      //.scan({
        //TableName: USERS_TABLE,
        //FilterExpression: "email = :email",
        //ExpressionAttributeValues: { ":email": email },
     // })
      const existingUsers = await dynamo
  	.query({
   	 TableName: USERS_TABLE,
    	IndexName: 'email-index',
    	KeyConditionExpression: 'email = :email',
    	ExpressionAttributeValues: { ':email': email },
    	Limit: 1
  	})
      .promise();

    if (existingUsers.Items && existingUsers.Items.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const volunteerId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user in DynamoDB
    await dynamo
      .put({
        TableName: USERS_TABLE,
        Item: {
          volunteerId,
          name,
          email,
          password: hashedPassword,
          role,
          createdAt: new Date().toISOString(),
        },
      })
      .promise();

    const token = generateToken(volunteerId);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      volunteerId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //const userResult = await dynamo
      //.scan({
        //TableName: USERS_TABLE,
        //FilterExpression: "email = :email",
        //ExpressionAttributeValues: { ":email": email },
      //})
      //.promise();

    //if (!userResult.Items || userResult.Items.length === 0) {
      //return res.status(400).json({ message: "Invalid credentials" });
    //}

    const userResult = await dynamo
  	.query({
    		TableName: USERS_TABLE,
    		IndexName: 'email-index',
    		KeyConditionExpression: 'email = :email',
    		ExpressionAttributeValues: { ':email': email },
    		Limit: 1
  		})
  	.promise();

	if (!userResult.Items || userResult.Items.length === 0) {
  	return res.status(400).json({ message: "Invalid credentials" });
	}
    const user = userResult.Items[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.volunteerId);
    res.json({ success: true, message: "Login successful", token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Verify Token
router.get("/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token missing" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    res.json({ valid: true, volunteerId: decoded.volunteerId });
  } catch {
    res.status(401).json({ valid: false, message: "Invalid token" });
  }
});

export default router;
