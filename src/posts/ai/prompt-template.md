---
title: AI coding中prompt模板
icon: pen-to-square
date: 2025-06-26
order: 1
author: Rain Man
# this page is sticky in article list
sticky: true
# this page will appear in starred articles
star: true
category:
  - AI
---

# AI coding中prompt模板

## 需求分析

```text
I want to develop a software/application that helps [target audience] achieve [goal/problem being solved].

Please help me analyze the key user needs and define the project scope. I want you to answer the following:

1. Who are the potential users?
2. What problems are they trying to solve?
3. What are some example use cases?
4. What is the MVP (Minimum Viable Product)?
5. What are the risks or unclear parts I should consider?

Context:
- Platform: [Web / Mobile / Desktop / Cross-platform]
- Industry: [e.g., Finance, Education, Entertainment, etc.]
- Examples of similar products: [example app names, if any]

```

## 功能规划与技术选型
```text
Based on the following project idea:

[Brief description of the app and user needs, e.g., "An app that allows users to scan lottery tickets and check if they won. Users can save scanned results and receive notifications."]

Please help me do the following:

1. Break down the application into logical modules (e.g., Authentication, Image Upload, OCR Processing, Notification).
2. For each module, suggest the main responsibilities and API boundaries.
3. Suggest a suitable frontend and backend technology stack, considering:
   - Fast development
   - Ease of deployment
   - Scalability
   - Low learning curve
4. Optional: If applicable, suggest libraries or cloud services that can help (e.g., Firebase, Supabase, AWS, etc.)

```

## 数据库与接口设计
```text
Given the following features:

[List the features in bullet form. For example:
- Users can scan lottery tickets
- Tickets contain a draw number, date, selected numbers, and optional image
- Users can view past results
- The system can compare results with winning numbers]

Please help me:

1. Design a relational database schema, including table names, fields, types, constraints, and relationships.
2. Suggest improvements for data normalization or performance.
3. Define a set of RESTful API endpoints that match the features.
   - For each endpoint, include: method (GET/POST/etc), path, request parameters, request body, and example response.
4. Highlight any important security/authentication considerations.

```

## 模块开发
```text
I am building the [module name] of my application.

Module goal: [Briefly describe what this module does. E.g., "Allow users to upload and preview lottery ticket images."]

Technical stack: [e.g., Vue 3 + TypeScript for frontend, Node.js for backend]

Please help me:

1. Generate code for the frontend component (input fields, buttons, preview logic, API call).
2. Generate backend endpoint that receives the request and processes/stores the data.
3. Add comments to explain the logic.
4. Suggest edge cases and how to handle them.
5. (Optional) Generate tests for this module if possible.

```

## 测试与调试
```text
I want to test and debug the following module/function:

[Brief description of the functionality, or paste the code snippet]

Please help me:

1. Identify edge cases or failure scenarios this code/module might not handle.
2. Suggest test cases (unit/integration/e2e) that should be written.
3. Generate example unit tests using [your test framework, e.g., JUnit, Jest, etc.].
4. If applicable, help me debug this specific issue:

[Paste error message, stack trace, or bug description]

```

## 部署与环境配置
```text
I want to deploy my application to [target platform: e.g., Vercel, Netlify, Docker + VPS, AWS, Railway].

Project stack:
- Frontend: [e.g., React + Vite]
- Backend: [e.g., Spring Boot + PostgreSQL]
- Database: [e.g., SQLite / PostgreSQL / Firebase]

Please help me:

1. Create a deployment plan or step-by-step checklist.
2. Generate Dockerfile(s) and/or docker-compose.yml if needed.
3. Suggest the correct environment variables and how to manage them securely.
4. Recommend basic monitoring/logging tools for the stack.
5. If there are CI/CD best practices, mention them as well.

```

## 文档与用户支持
```text
I’ve completed development of the application. Please help me generate the following documentation:

1. A professional `README.md` file including:
   - Project description
   - Key features
   - Tech stack
   - Installation guide
   - Usage instructions
   - Screenshots (placeholder markdown links)
   - License

2. API documentation (Markdown or Swagger format)
3. A simple end-user guide:
   - How to use the app
   - Common problems and solutions (FAQ)
   - Support/contact info placeholder

```
