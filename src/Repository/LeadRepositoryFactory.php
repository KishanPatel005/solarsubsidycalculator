<?php

namespace Repository;

use Config\Config;

class LeadRepositoryFactory {
    /**
     * Instantiates the active repository driver.
     *
     * @return ILeadRepository
     */
    public static function create(): ILeadRepository {
        $driver = strtolower(Config::DB_DRIVER);
        if ($driver === 'mysql') {
            return new MySqlLeadRepository();
        }
        return new JsonFileLeadRepository();
    }
}
