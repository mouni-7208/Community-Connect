Community Connect: A Volunteer Matching Platform

🌍 Project Overview Community Connect is a cloud-based web platform that bridges the gap between volunteers and organizations seeking help for community projects. It enables organizations to create projects, and volunteers can browse, apply, and collaborate seamlessly — all powered by AWS services and a scalable Node.js + React architecture.

🚀 Features ✅ User registration and login with JWT authentication ✅ Organizer-created volunteer projects stored in AWS DynamoDB ✅ Real-time notifications via Amazon SNS when volunteers apply ✅ Secure backend hosted on AWS EC2 (Ubuntu) ✅ Static frontend deployed to Amazon S3 (Static Website Hosting) ✅ RESTful API built with Express.js and Axios for frontend integration ✅ Cloud-native, fully serverless-ready design

🏗️ Architecture +-------------------+ | React Frontend | | (Hosted on S3) | +---------+---------+ | | HTTPS (Axios) v +---------+---------+ | Node.js Backend | | (EC2, Express.js)| +---------+---------+ | | AWS SDK v +--------------------------+ | DynamoDB (Projects, Apps)| | SNS (Email Notifications)| +--------------------------+

🧠 Tech Stack Frontend React.js, Axios, HTML5, CSS3 Backend Node.js, Express.js Database AWS DynamoDB Notifications AWS SNS Deployment AWS EC2, S3 Auth JSON Web Token (JWT) Version Control Git & GitHub

💡 Future Enhancements Role-based dashboards for Organizers and Volunteers Integration with AWS Lambda for asynchronous notifications Adding CloudWatch metrics for performance tracking Chat module for volunteer-organizer communication
