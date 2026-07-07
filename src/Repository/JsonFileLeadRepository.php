<?php

namespace Repository;

use Config\Config;

class JsonFileLeadRepository implements ILeadRepository {
    private $filePath;

    public function __construct() {
        $this->filePath = Config::JSON_LEADS_PATH;
    }

    public function save(array $leadData): bool {
        try {
            $leads = $this->getAll();
            $leads[] = $leadData;

            // Atomic file write
            $tempFile = tempnam(sys_get_temp_dir(), 'lead');
            if (file_put_contents($tempFile, json_encode($leads, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n") === false) {
                return false;
            }

            if (!is_dir(dirname($this->filePath))) {
                mkdir(dirname($this->filePath), 0755, true);
            }

            // On Windows, rename doesn't overwrite if destination exists, so we delete or use copy+unlink
            if (file_exists($this->filePath)) {
                @unlink($this->filePath);
            }
            $result = rename($tempFile, $this->filePath);
            if (!$result) {
                $result = copy($tempFile, $this->filePath);
                @unlink($tempFile);
            }
            return $result;
        } catch (\Throwable $e) {
            return false;
        }
    }

    public function getAll(): array {
        if (!file_exists($this->filePath)) {
            return [];
        }
        try {
            $raw = file_get_contents($this->filePath);
            $decoded = json_decode($raw, true);
            return is_array($decoded) ? $decoded : [];
        } catch (\Throwable $e) {
            return [];
        }
    }
}
