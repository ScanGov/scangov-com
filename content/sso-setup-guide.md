---
layout: layouts/default-plain
date: 2026-02-10
modified: 2026-02-10
author: ScanGov
title: "SSO Setup Guide"
description: "Set up Single Sign-On (SSO) with Okta using OpenID Connect (OIDC) to let your team log in to ScanGov with their existing credentials."
---

ScanGov supports Single Sign-On (SSO) via Okta using the OpenID Connect (OIDC) protocol. This allows your team members to log in to ScanGov using their existing Okta credentials.

## Prerequisites

- A ScanGov organization account with a paid enterprise plan
- An Okta administrator account with permission to create applications

## Step 1: Create an OIDC Application in Okta

1. Log in to your Okta Admin Console
2. Go to **Applications** > **Applications** > **Create App Integration**
3. Select **OIDC - OpenID Connect** as the sign-in method
4. Select **Web Application** as the application type
5. Click **Next**

Configure the application with the following settings:

| Setting | Value |
|---------|-------|
| App integration name | ScanGov |
| Grant type | Authorization Code |
| Sign-in redirect URI | `https://my.scangov.com/auth/callback` |
| Sign-out redirect URI | (leave blank) |
| Controlled access | Assign to the groups or people who should have access |

6. Click **Save**

After saving, Okta will display your **Client ID** and **Client Secret**. You will need these in the next step.

Also note your **Okta domain**, which looks like `https://your-org.okta.com`. You can find this in the top-right corner of the Okta Admin Console.

## Step 2: Configure SSO in ScanGov

1. Log in to ScanGov at [my.scangov.com](https://my.scangov.com)
2. Go to your organization settings and click **SSO** in the sidebar
3. Enter the following values:
   - **Email Domain** — The email domain your team uses (e.g., `acme.gov`). Users with this email domain will be routed to your Okta for SSO login.
   - **Okta Domain** — Your Okta org URL (e.g., `https://your-org.okta.com`)
   - **Client ID** — The Client ID from your Okta application
   - **Client Secret** — The Client Secret from your Okta application
4. Click **Save**

## Step 3: Log In with SSO

Once configured, team members can log in via SSO:

1. Go to [my.scangov.com](https://my.scangov.com) and click **Sign in with SSO**
2. Enter your email address and click **Continue**
3. You will be redirected to your organization's Okta login page
4. Authenticate with Okta
5. You will be redirected back to ScanGov and logged in

## FAQ

**Can team members still log in with a password?**
Yes. Password login remains available for users who were directly invited and setup a password. SSO is an additional login method.

**What happens if I update the Client Secret in Okta?**
You will need to update the Client Secret in ScanGov's SSO configuration page to match.

**Who can configure SSO in ScanGov?**
Any logged-in member of your organization with a paid plan can access the SSO configuration page.

## Support

If you run into any issues setting up SSO, contact us at support@scangov.com.
