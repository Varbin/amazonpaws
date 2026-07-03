# Amazon Paws - the paw prints of Amazon

This is a journalistic satire project, collecting negative impact of Amazon to the society and environment.

## Technology & Deployment

It is based on Next.js and MongoDB.
Optionally you can store images on an S3-compatible storage.

For development use the docker-compose.dev.yml paired with the sample.env file.
This exposes a MongoDB and Minio instance on localhost.
You can then run a local instance of Amazon Paws with `npm run dev`.