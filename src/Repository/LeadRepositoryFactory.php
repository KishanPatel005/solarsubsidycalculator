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
        /** @var ILeadRepository */
        return RepositoryFactory::create('lead');
    }
}
