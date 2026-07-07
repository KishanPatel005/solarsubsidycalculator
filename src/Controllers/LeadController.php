<?php

namespace Controllers;

use Config\Config;
use Repository\LeadRepositoryFactory;

class LeadController {
    /**
     * Handles the creation of a new lead.
     *
     * @param array $inputData
     * @return array Response payload with 'ok' boolean and optional error message.
     */
    public function submitLead(array $inputData): array {
        // Validation rules matching Zod schema
        $name = trim($inputData['name'] ?? '');
        $phone = trim($inputData['phone'] ?? '');
        $city = trim($inputData['city'] ?? '');
        $bill = isset($inputData['bill']) ? (float)$inputData['bill'] : null;
        $callTime = $inputData['callTime'] ?? '';
        $calculatorType = $inputData['calculatorType'] ?? '';

        if (strlen($name) < 2 || strlen($name) > 50) {
            return ['ok' => false, 'error' => 'Invalid name length (min 2, max 50)'];
        }

        if (!preg_match('/^[6-9]\d{9}$/', $phone)) {
            return ['ok' => false, 'error' => 'Invalid Indian phone number (10 digits starting with 6-9)'];
        }

        if (strlen($city) < 2 || strlen($city) > 80) {
            return ['ok' => false, 'error' => 'Invalid city length (min 2, max 80)'];
        }

        if ($bill === null || $bill < 0 || $bill > 50000) {
            return ['ok' => false, 'error' => 'Invalid bill amount (range 0 to 50,000)'];
        }

        $allowedCallTimes = ['morning', 'afternoon', 'evening'];
        if (!in_array($callTime, $allowedCallTimes)) {
            return ['ok' => false, 'error' => 'Invalid call time selection'];
        }

        $allowedCalculatorTypes = ['subsidy', 'emi', 'loan', 'savings'];
        if (!in_array($calculatorType, $allowedCalculatorTypes)) {
            return ['ok' => false, 'error' => 'Invalid calculator type'];
        }

        // Prepare storage object
        $lead = [
            'id' => $this->generateUUID(),
            'timestamp' => gmdate("Y-m-d\TH:i:s\Z"),
            'name' => $name,
            'phone' => $phone,
            'city' => $city,
            'bill' => $bill,
            'callTime' => $callTime,
            'calculatorType' => $calculatorType,
            'subsidyAmount' => isset($inputData['subsidyAmount']) ? (float)$inputData['subsidyAmount'] : null,
            'finalCost' => isset($inputData['finalCost']) ? (float)$inputData['finalCost'] : null,
            'monthlySavings' => isset($inputData['monthlySavings']) ? (float)$inputData['monthlySavings'] : null,
            'state' => $inputData['state'] ?? null,
            'ipAddress' => $this->getClientIp()
        ];

        // Persist lead
        $repo = LeadRepositoryFactory::create();
        $saved = $repo->save($lead);

        if (!$saved) {
            return ['ok' => false, 'error' => 'Failed to save lead in database'];
        }

        // Send EmailJS notification
        $this->sendEmailJsNotification($lead);

        return ['ok' => true];
    }

    private function generateUUID(): string {
        return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }

    private function getClientIp(): ?string {
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $parts = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            return trim($parts[0]);
        }
        if (!empty($_SERVER['HTTP_X_REAL_IP'])) {
            return $_SERVER['HTTP_X_REAL_IP'];
        }
        return $_SERVER['REMOTE_ADDR'] ?? null;
    }

    private function sendEmailJsNotification(array $lead): void {
        $serviceId = Config::EMAILJS_SERVICE_ID;
        $templateId = Config::EMAILJS_TEMPLATE_ID;
        $publicKey = Config::EMAILJS_PUBLIC_KEY;

        if (empty($serviceId) || empty($templateId) || empty($publicKey)) {
            return;
        }

        $subsidy = $lead['subsidyAmount'] ?? 0;
        $subject = "New Solar Lead — {$lead['city']} — ₹" . round($subsidy);

        $payload = [
            'service_id' => $serviceId,
            'template_id' => $templateId,
            'user_id' => $publicKey,
            'template_params' => [
                'subject' => $subject,
                'id' => $lead['id'],
                'name' => $lead['name'],
                'phone' => $lead['phone'],
                'city' => $lead['city'],
                'bill' => $lead['bill'],
                'callTime' => $lead['callTime'],
                'calculatorType' => $lead['calculatorType'],
                'subsidyAmount' => $lead['subsidyAmount'] ?? '',
                'finalCost' => $lead['finalCost'] ?? '',
                'monthlySavings' => $lead['monthlySavings'] ?? '',
                'state' => $lead['state'] ?? '',
                'timestamp' => $lead['timestamp'],
                'ipAddress' => $lead['ipAddress'] ?? ''
            ]
        ];

        $ch = curl_init('https://api.emailjs.com/api/v1.0/email/send');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_TIMEOUT, 5); // 5 second timeout

        curl_exec($ch);
        curl_close($ch);
    }
}
