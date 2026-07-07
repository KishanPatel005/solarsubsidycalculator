<?php

namespace Config;

class Config {
    // Site base URL settings
    public const SITE_URL = 'http://localhost/solarsubsidycalculator';

    // Database Driver ('json' or 'mysql')
    public const DB_DRIVER = 'json';

    // MySQL connection settings
    public const DB_HOST = 'localhost';
    public const DB_PORT = '3306';
    public const DB_NAME = 'solarsubsidy';
    public const DB_USER = 'root';
    public const DB_PASS = '';

    // File backup path for JSON lead database
    public const JSON_LEADS_PATH = __DIR__ . '/../leads.json';

    // EmailJS credentials
    public const EMAILJS_SERVICE_ID = '';
    public const EMAILJS_TEMPLATE_ID = '';
    public const EMAILJS_PUBLIC_KEY = '';

    // Admin passcode settings
    public const ADMIN_PIN = '5498';
}
