/**
 * Centralized API Base URL Configuration
 * Jayasri Kannan Foundation
 *
 * Local dev  → http://localhost:5000
 * Production → https://api.jayasrikannanfoundation.org
 *
 * To switch environments update the PRODUCTION_API_URL below.
 */

const PRODUCTION_API_URL = 'https://api.jayasrikannanfoundation.org';

const API_BASE = (
  window.location.protocol === 'file:' ||
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
)
  ? 'http://localhost:5000'
  : PRODUCTION_API_URL;
