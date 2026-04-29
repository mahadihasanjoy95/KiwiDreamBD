# KiwiDream BD - AWS Deployment & CI/CD Guide

This guide provides step-by-step instructions for deploying your KiwiDream BD application using AWS Elastic Beanstalk (Backend) and AWS S3 + CloudFront (Frontend), complete with GitHub Actions CI/CD and custom domain setup via Namecheap.

## Architecture Overview
- **Backend (Spring Boot):** AWS Elastic Beanstalk (Single Instance Environment - `t3.micro`)
- **Database (MySQL):** AWS RDS (`db.t3.micro`)
- **Frontend (React):** AWS S3 Bucket with CloudFront CDN
- **DNS:** AWS Route 53
- **CI/CD:** GitHub Actions (automatically builds and deploys on push to `dev` branch)

---

## Step 1: Configure Your Domain (Namecheap to AWS Route 53)

By moving your DNS management to AWS Route 53, you can easily route traffic to your Beanstalk and CloudFront resources.

1. Log into your **AWS Console** and search for **Route 53**.
2. Click **Hosted zones** -> **Create hosted zone**.
3. Enter your domain name (e.g., `kiwidream.com`) and choose **Public hosted zone**, then click **Create**.
4. In your newly created Hosted Zone, look for the `NS` (Name Server) record. It will list 4 addresses (e.g., `ns-123.awsdns-45.com`).
5. Open a new tab, log into your **Namecheap Dashboard**.
6. Find your domain and click **Manage**.
7. Scroll down to the **Nameservers** section. Select **Custom DNS**.
8. Paste the 4 AWS Name Server addresses from step 4. Click the green checkmark to save.
*(Note: DNS propagation can take 24-48 hours, though it usually happens within an hour).*

---

## Step 2: Set Up the Database (AWS RDS)

You need a database running before you spin up the backend.

1. In AWS Console, search for **RDS**. Click **Create database**.
2. Choose **Standard create** and **MySQL**.
3. **Templates:** Choose **Free tier** (this selects `db.t3.micro` under the hood).
4. Under **Settings**, set the DB instance identifier (e.g., `kiwidream-db`), master username (e.g., `admin`), and password.
5. Under **Connectivity**, ensure **Public access** is set to **No**. Select the default VPC.
6. Click **Create database**.
7. Once created, click on the database to find the **Endpoint** (e.g., `kiwidream-db.xxxxx.region.rds.amazonaws.com`). You will need this for your backend environment variables.

---

## Step 3: Set Up Backend (AWS Elastic Beanstalk)

We use a "Single Instance" environment to avoid Load Balancer costs.

1. In AWS Console, search for **Elastic Beanstalk**. Click **Create application**.
2. **Application name:** `kiwidream-backend`.
3. **Platform:** Choose **Java** (Corretto 21 or 25, depending on your build).
4. **Application code:** Choose **Sample application** (we will deploy the real code via GitHub Actions later).
5. Click **Configure more options**.
6. Under **Presets**, choose **Single instance (free tier eligible)**. This ensures you do not get charged for an Application Load Balancer.
7. Under **Instances**, ensure `t3.micro` is selected.
8. Under **Software**, add your Environment Properties (Env Vars):
   - `DB_URL`: `jdbc:mysql://<your-rds-endpoint>:3306/kiwi_dream_bd`
   - `DB_USERNAME`: `<your-db-username>`
   - `DB_PASSWORD`: `<your-db-password>`
   - `JWT_SECRET`: `<your-random-secret-key>`
   - *Add any others specified in your `AGENTS.md`.*
9. Click **Create app**. Wait 5-10 minutes for the environment to provision.

---

## Step 4: Set Up Frontend (AWS S3 + CloudFront)

1. In AWS Console, search for **S3**. Click **Create bucket**.
2. Name it (e.g., `kiwidream-frontend-prod`). Ensure Block Public Access is **ON** (we will access it securely via CloudFront).
3. Search for **CloudFront**. Click **Create Distribution**.
4. **Origin domain:** Select your S3 bucket.
5. Choose **Origin access control settings (OAC)** and click **Create control setting**. This gives CloudFront permission to read your private bucket.
6. **Viewer protocol policy:** Select **Redirect HTTP to HTTPS**.
7. **Default root object:** Type `index.html`.
8. Click **Create distribution**.
9. Once created, CloudFront will give you a policy block to paste into S3. Go back to your S3 Bucket -> **Permissions** -> **Bucket Policy**, and paste it there.

---

## Step 5: Configure GitHub Actions CI/CD

To make the provided `.github/workflows` YAML files work, you need to create an IAM User in AWS and add Secrets to your GitHub repository.

### Create AWS IAM User for GitHub
1. In AWS Console, search for **IAM**. Go to **Users** -> **Create user**. Name it `github-actions-deploy`.
2. Attach policies directly. You need:
   - `AWSElasticBeanstalkWebTier`
   - `AmazonS3FullAccess`
   - `CloudFrontFullAccess`
   *(For maximum security, you should create custom restricted policies later, but these work for MVP).*
3. Create the user, then go to **Security credentials** -> **Create access key**.
4. Save the **Access Key ID** and **Secret Access Key**.

### Add Secrets to GitHub
Go to your GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**.

Add the following exactly as named:
- `AWS_ACCESS_KEY_ID`: From step above
- `AWS_SECRET_ACCESS_KEY`: From step above
- `AWS_REGION`: Your AWS region (e.g., `ap-southeast-2`)
- `EB_APPLICATION_NAME`: `kiwidream-backend`
- `EB_ENVIRONMENT_NAME`: The name of the env Beanstalk created (e.g., `Kiwidreambackend-env`)
- `AWS_S3_BUCKET_NAME`: The S3 bucket name (e.g., `kiwidream-frontend-prod`)
- `AWS_CLOUDFRONT_DISTRIBUTION_ID`: Found in the CloudFront console.
- `VITE_API_URL`: Your Elastic Beanstalk URL (e.g., `http://kiwidreambackend-env.eba-xxxx.ap-southeast-2.elasticbeanstalk.com/api/v1`)

---

## Step 6: Link Your Domain (Route 53 to CloudFront & EB)

Now tie the domain you set up in Step 1 to your resources.

1. In **Route 53**, go to your Hosted Zone.
2. Click **Create record**.
3. Leave record name blank (for `kiwidream.com`).
4. Turn **Alias** toggle **ON**.
5. **Route traffic to:** Choose **Alias to CloudFront distribution**.
6. Select your CloudFront distribution and click **Create records**.
7. Create another record for your backend (e.g., `api.kiwidream.com`).
8. Turn **Alias** toggle **ON**.
9. **Route traffic to:** Choose **Alias to Elastic Beanstalk environment**.
10. Select your region and environment. Click **Create records**.

> [!NOTE] 
> After pushing code to your `dev` branch, GitHub Actions will automatically deploy to S3 and Beanstalk. Ensure you update `VITE_API_URL` to point to `https://api.kiwidream.com` once SSL is configured via AWS Certificate Manager (ACM).
