#!/usr/bin/env node

/**
 * ============================================================
 *  MongoDB Atlas Connection Tester  (Native Driver)
 * ============================================================
 *
 *  HOW TO RUN:
 *    1.  cd into the project root
 *    2.  npm install mongodb        (one-time, adds the native driver)
 *    3.  node backend/test-db.js
 *
 *  This script:
 *    • Loads backend/.env via dotenv
 *    • Resolves the Atlas hostname through DNS first (catches DNS / network issues early)
 *    • Connects with the native mongodb driver (NOT Mongoose)
 *    • Runs a "ping" admin command
 *    • Lists collections in the target database
 *    • Prints the FULL error stack + error code on failure with remediation hints
 * ============================================================
 */

const path = require('path');

// ── 1. Load environment variables ────────────────────────────
require('dotenv').config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

// ── 2. Validate the URI before doing anything ────────────────
if (!MONGODB_URI) {
  console.error('\n❌  MONGODB_URI is not defined in backend/.env');
  console.error('    Create or edit  backend/.env  and add a line like:');
  console.error('    MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority\n');
  process.exit(1);
}

if (MONGODB_URI.includes('<username>') || MONGODB_URI.includes('<password>')) {
  console.error('\n❌  MONGODB_URI still contains placeholder <username> or <password>.');
  console.error('    Replace them with your actual Atlas credentials in backend/.env\n');
  process.exit(1);
}

// ── Helper: extract hostname from the URI for a DNS pre-check ─
function extractHost(uri) {
  try {
    // mongodb+srv://user:pass@cluster0.dwvheld.mongodb.net/db?...
    const afterAt = uri.split('@')[1];
    if (!afterAt) return null;
    return afterAt.split('/')[0].split('?')[0];
  } catch {
    return null;
  }
}

// ── Helper: extract database name from the URI ────────────────
function extractDbName(uri) {
  try {
    const afterAt = uri.split('@')[1];
    if (!afterAt) return null;
    const afterHost = afterAt.split('/')[1];
    if (!afterHost) return null;
    return afterHost.split('?')[0] || null;
  } catch {
    return null;
  }
}

// ── 3. DNS resolution pre-check ──────────────────────────────
async function dnsCheck(hostname) {
  const dns = require('dns').promises;
  console.log(`\n🔍  Step 1/4 — DNS lookup for "${hostname}" ...`);
  try {
    // SRV lookup (mongodb+srv uses SRV records)
    const srvRecords = await dns.resolveSrv(`_mongodb._tcp.${hostname}`);
    console.log(`   ✅  SRV records resolved (${srvRecords.length} host(s) found)`);
    srvRecords.forEach((r, i) => console.log(`       ${i + 1}. ${r.name}:${r.port}`));
    return true;
  } catch (err) {
    console.error(`   ❌  SRV lookup failed: ${err.code || err.message}`);
    if (err.code === 'ENOTFOUND') {
      console.error('   💡  The hostname could not be resolved. Possible causes:');
      console.error('       • Typo in the cluster hostname in MONGODB_URI');
      console.error('       • No internet connection or DNS server unreachable');
      console.error('       • Corporate firewall/proxy blocking DNS for mongodb.net');
    }
    if (err.code === 'ENODATA') {
      console.error('   💡  No SRV records found. The cluster may have been deleted or paused.');
    }
    return false;
  }
}

// ── 4. Main connection test ──────────────────────────────────
async function testConnection() {
  let MongoClient;
  try {
    ({ MongoClient } = require('mongodb'));
  } catch {
    console.error('\n❌  The "mongodb" package is not installed.');
    console.error('    Run this from the project root:\n');
    console.error('      npm install mongodb\n');
    console.error('    Then re-run:  node backend/test-db.js\n');
    process.exit(1);
  }

  const hostname = extractHost(MONGODB_URI);
  const dbName = extractDbName(MONGODB_URI) || 'test';

  console.log('═══════════════════════════════════════════════════════');
  console.log('   MongoDB Atlas Connection Tester');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`   URI        : ${MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);
  console.log(`   Hostname   : ${hostname || '(could not parse)'}`);
  console.log(`   Database   : ${dbName}`);
  console.log(`   Timestamp  : ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
  console.log('═══════════════════════════════════════════════════════');

  // ── Step 1: DNS ─────────────────────────────────────────────
  if (hostname) {
    const dnsOk = await dnsCheck(hostname);
    if (!dnsOk) {
      console.error('\n⛔  Aborting: Fix the DNS issue above before retrying.\n');
      process.exit(1);
    }
  }

  // ── Step 2: Connect ─────────────────────────────────────────
  console.log('\n🔌  Step 2/4 — Connecting to MongoDB Atlas ...');
  let client;
  try {
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,   // 10s to find a suitable server
      connectTimeoutMS: 10000,           // 10s TCP connect timeout
      socketTimeoutMS: 15000,            // 15s socket timeout
      tls: true,                         // Atlas always requires TLS
    });

    await client.connect();
    console.log('   ✅  Connected to Atlas cluster successfully!');
  } catch (err) {
    console.error('   ❌  Connection FAILED\n');
    printDetailedError(err);
    process.exit(1);
  }

  // ── Step 3: Ping ────────────────────────────────────────────
  console.log('\n📡  Step 3/4 — Running admin "ping" command ...');
  try {
    const adminDb = client.db('admin');
    const result = await adminDb.command({ ping: 1 });
    console.log(`   ✅  Ping response: ${JSON.stringify(result)}`);
  } catch (err) {
    console.error('   ❌  Ping failed\n');
    printDetailedError(err);
    await client.close();
    process.exit(1);
  }

  // ── Step 4: List collections ────────────────────────────────
  console.log(`\n📂  Step 4/4 — Listing collections in "${dbName}" ...`);
  try {
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    if (collections.length === 0) {
      console.log('   ⚠️  No collections found (database may be empty or new)');
    } else {
      console.log(`   ✅  Found ${collections.length} collection(s):`);
      collections.forEach((col, i) => console.log(`       ${i + 1}. ${col.name} (${col.type})`));
    }
  } catch (err) {
    console.error('   ❌  Could not list collections\n');
    printDetailedError(err);
  }

  // ── Done ────────────────────────────────────────────────────
  await client.close();
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('   🎉  ALL CHECKS PASSED — Atlas connection is healthy!');
  console.log('═══════════════════════════════════════════════════════\n');
  process.exit(0);
}

// ── 5. Detailed error printer with remediation hints ─────────
function printDetailedError(err) {
  console.error('┌──────────────────────────────────────────────────┐');
  console.error('│              ERROR DETAILS                       │');
  console.error('└──────────────────────────────────────────────────┘');
  console.error(`  Name    : ${err.name}`);
  console.error(`  Message : ${err.message}`);
  if (err.code)      console.error(`  Code    : ${err.code}`);
  if (err.codeName)  console.error(`  CodeName: ${err.codeName}`);
  if (err.errInfo)   console.error(`  ErrInfo : ${JSON.stringify(err.errInfo)}`);
  console.error('');
  console.error('── Full Stack Trace ──────────────────────────────');
  console.error(err.stack);
  console.error('──────────────────────────────────────────────────\n');

  // ── Remediation hints based on error signatures ─────────────
  const msg = (err.message || '').toLowerCase();
  const code = err.code;

  if (msg.includes('authentication') || msg.includes('auth') || code === 18) {
    console.error('💡  DIAGNOSIS: Authentication failure');
    console.error('    • Check the username and password in MONGODB_URI');
    console.error('    • Make sure the database user exists in Atlas → Database Access');
    console.error('    • The password must be URL-encoded if it has special chars (@ # % etc.)');
    console.error('      Use encodeURIComponent("your_password") in Node to get the encoded value');
  } else if (msg.includes('getaddrinfo') || msg.includes('enotfound') || msg.includes('dns')) {
    console.error('💡  DIAGNOSIS: DNS / Network resolution failure');
    console.error('    • Verify the cluster hostname in MONGODB_URI');
    console.error('    • Check your internet connection');
    console.error('    • If behind a corporate proxy/VPN, try disconnecting or adding DNS exceptions');
  } else if (msg.includes('timed out') || msg.includes('timeout') || msg.includes('serverselectiontimeout')) {
    console.error('💡  DIAGNOSIS: Connection timed out');
    console.error('    • Your IP is likely NOT whitelisted in Atlas.');
    console.error('      → Go to MongoDB Atlas → Security → Network Access');
    console.error('      → Click "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0)');
    console.error('      → Or add your current public IP (Google "what is my IP")');
    console.error('    • If on a corporate network, the firewall may block port 27017');
    console.error('    • The Atlas cluster might be paused — check the Atlas console');
  } else if (msg.includes('ssl') || msg.includes('tls') || msg.includes('certificate')) {
    console.error('💡  DIAGNOSIS: SSL/TLS handshake failure');
    console.error('    • Make sure your Node.js version supports TLS 1.2+ (Atlas requires it)');
    console.error('    • Run: node -e "console.log(process.version)" — should be >= v14');
    console.error('    • If behind a corporate proxy that does SSL inspection, the proxy\'s CA cert');
    console.error('      must be trusted. Set NODE_EXTRA_CA_CERTS env variable to your CA bundle.');
  } else if (msg.includes('econnrefused')) {
    console.error('💡  DIAGNOSIS: Connection refused');
    console.error('    • The server is reachable but actively refusing connections');
    console.error('    • Cluster may be paused or the port may be wrong');
  } else {
    console.error('💡  Could not auto-diagnose. Common fixes:');
    console.error('    1. Whitelist your IP in Atlas → Network Access → Add IP (0.0.0.0/0 for dev)');
    console.error('    2. Verify credentials in Atlas → Database Access');
    console.error('    3. Ensure the cluster is not paused in the Atlas console');
    console.error('    4. Try from a different network (no VPN/proxy)');
  }
  console.error('');
}

// ── Run ───────────────────────────────────────────────────────
testConnection();
