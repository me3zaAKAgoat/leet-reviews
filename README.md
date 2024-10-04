<h1 align="center"><strong>Student Internship Review Platform</strong></h1>

## Discord Server

https://discord.gg/cjfAPpw4uX

## Overview

    How to contribute
    How to run the project

## Introduction

This platform is designed for 1337 students (and possibly students from other schools) to leave reviews of their internships and work experiences. The goal is to provide a trusted resource where students can share feedback on companies they have worked for, including ratings, descriptions, and insights into their internship experiences.

Students can anonymously post their reviews after logging in with 42 OAuth, ensuring only verified 42 students can access and contribute to the platform. Users can comment, upvote/downvote reviews, and explore companies based on ratings and feedback.

## Key Features

- Star rating for companies.
- Text reviews of the student’s experience.
- Option to post reviews anonymously.
- City and remote/on-site specification for internships.
- Commenting, upvoting/downvoting, and filtering reviews by company or rating.
- User dashboard to manage and delete comments and reviews.
- Custom OAuth login with 42 authentication.
- Clean landing page explaining the platform’s purpose.
- Database of companies to prevent duplicate entries and allow users to filter by company.
- Company-specific pages displaying reviews and overall ratings.

## Tech Stack

- Frontend: Next.js v14 (App Router), Tailwind CSS, Shadcn UI
- Backend: Prisma + PostgreSQL, Zod for validation, React Query for caching
- Authentication: 42 OAuth
- CI/CD: GitHub Actions, Husky for pre-commit hooks

## For Contributors

### How to Contribute

If you'd like to contribute, here’s how you can get started:

1. **Fork the Repository:** Click the "Fork" button on the top right of this repository page.
2. **Clone the Forked Repo:** Clone it to your local machine using Git. Replace `[your-username]` with your GitHub username.

   ```bash
   git clone https://github.com/[your-username]/intern-review-platform.git
   ```

3. **Create a New Branch:** Create a branch for your contribution with a descriptive name.

   ```bash
   git checkout -b feature/your-feature
   ```

4. **Make Changes:** Edit the codebase according to your desired changes.
5. **Commit Changes:** Stage and commit your changes.

   ```bash
   git add .
   git commit -m "Your commit message"
   ```

6. **Push Changes:** Push your changes to your forked repo.

   ```bash
   git push origin feature/your-feature
   ```

7. **Open a Pull Request:** Head over to the original repository and open a pull request for your branch. Compare it with the base branch (`main` or `master`) and submit it.
8. **Review & Merge:** Once reviewed and approved, your contribution will be merged.

### How to Run the Project in Development Mode

1. fill out the ENVS
2. npm run dev
3. ta da!
