# tha_rupa_tes

T.E.S: Transactional Email Service, a take-home assessment.

## The problem

In order to prevent downtime during an email service provider outage, you're tasked
with creating a service that provides an abstraction between at least two different email
service providers. This way, if one of the services goes down, you can quickly fail over
to a different provider without affecting your customers.

## Requirements

MVP:

- A `/email` endpoint that accepts `POST` requests in order to send an email
- Safe handle of HTML content in the body of the email
- Basic Responses to `/email` signaling success or failures
- Safe handling of unsupported endpoints
- Safe handling of unsuported METHOD to `/email`
- Safe handling of non-json request body data
- Safe handling of CORS requests since endpoint is public
- Service provider outage detection and notification/timeouts
- Configurable service provider in order to recover quickly from a potential outage
- Fail fast if config is bad or missing info, informing of the error
- Fail fast if API keys for service providers are not set, informing of the error
- enable https

Additional

- Informative responses to `/email` endoing with detailed failure messages
- Verbose logging for debugging purposes
- DOS attack detection, too many requests (429 Code)
- Large request body processing error detection (413)

For testing purposes

- Potentially, a method to simulate service provider failures.
- Potentially, a method to check if a service provider is up or down.`npm run dev`

### TBD

- What happens if both/all services providers are down?
- Does it suffice to simply log an error to the console when a service provider is down?
- Should we worry about bounced messages?
- Should a user be able to email him/herself?
- Is there a maximum length for the body of the email?

## Documentation

### Getting Started

#### Prerequisites

- [Install nvm+npm+node](https://github.com/nvm-sh/nvm)
- [Sign up and obtain an API key from SendGrid](https://sendgrid.com/)
- [Sign up and obtain an API key from MainGun](https://www.mailgun.com/)

#### Installation

Below are the steps to build the application:

1. Clone the repo: `git clone https://github.com/javoltaire/tha_rupa_tes.git`
2. Install dependencies: `npm install`

#### Usage

##### TES Server

An HTTP server that listens on a pre-configured port. See [Endpoints](#endpoints) for a list of routes. To run the server, use:

```bash
$npm run dev
```

### Build with

- Node.js
- npm
- nvm
- babel
- yup

### Endpoints

#### Sending an email

Send an email using one of our providers

**URL:** `/email`  
**Method:** `POST`  
**Auth required:** NO  
**Request Body:**
| Parameter   | type     | constraints         | description                               |
| :---------- | :------- | :------------------ | :---------------------------------------- |
| `to`        | `string` | `[required][email]` | The address of the recipient of the email |
| `to_name`   | `string` | `[required]`        | The name of the recipient of the email    |
| `from`      | `string` | `[required][email]` | The address of the sender of the email    |
| `from_name` | `string` | `[required]`        | The name of the sender of the email       |
| `subject`   | `string` | `[required]`        | The subject line of the email             |
| `body`      | `string` | `[required]`        | The body of the email                     |

**Request Body Example:**

```json
{
  "to": "fake@example.com",
  "to_name": "Mr. Fake",
  "from": "no-reply@fake.com",
  "from_name":"Ms. Fake",
  "subject": "A message from The Fake Family",
  "body": "<h1>Your Bill</h1><p>$10</p>"
}
```

#### Success Responses

**Code:** `200 OK`  
**Content:**

```json
  {
    "message": "Email sucessfully sent"
  }
```

#### Error Responses

**Code:** `400 Bad Request`  
**Content:**

```json
  {
    "message": "Invalid request body: check content and try again"
  }
```

OR

**Code:** `415 Unsupported Media Type`  
**Content:**

```json
  {
    "message": "Unsupported Content Type: only JSON type allowed"
  }
```

OR

**Code:** `405 Method Not Allowed`  
**Content:**

```json
  {
    "message": "Unsupported Request Method: only POST method allowed"
  }
```

OR

**Code:** `500 Internal Server Error`  
**Content:**

```json
  {
    "message": "Unable to complete request, please try again later"
  }
```

### Architecture

This project was implemented using the [clean architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) by Robert C. Martin (Uncle Bob).

#### Project Layout

```text
TODO: <Show file structure here.>
```
