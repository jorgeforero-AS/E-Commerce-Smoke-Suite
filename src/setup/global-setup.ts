import * as dotenv from 'dotenv';

// runs once before anything else – just loads the .env so config can read it
async function globalSetup(): Promise<void> {
  dotenv.config();
}

export default globalSetup;
