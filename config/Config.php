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

    // File backup paths for JSON database storage
    public const JSON_LEADS_PATH = __DIR__ . '/../leads.json';
    public const JSON_BLOGS_PATH = __DIR__ . '/../blogs.json';
    public const JSON_FAQS_PATH = __DIR__ . '/../faqs.json';
    public const JSON_PROCESS_PATH = __DIR__ . '/../process.json';
    public const JSON_NEWS_PATH = __DIR__ . '/../updates.json';
    public const JSON_USERS_PATH = __DIR__ . '/../users.json';

    // EmailJS credentials
    public const EMAILJS_SERVICE_ID = '';
    public const EMAILJS_TEMPLATE_ID = '';
    public const EMAILJS_PUBLIC_KEY = '';

    // Admin passcode & login settings
    public const ADMIN_PIN = '5498';
    public const DEFAULT_ADMIN_USER = 'admin';
    public const DEFAULT_ADMIN_PASS = 'admin123';

    // Third-party CDN integrations
    public const CKEDITOR_CDN = 'https://cdn.ckeditor.com/ckeditor5/40.0.0/classic/ckeditor.js';
}
