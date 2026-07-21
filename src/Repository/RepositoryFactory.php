<?php

namespace Repository;

use Config\Config;
use InvalidArgumentException;

class RepositoryFactory {
    /**
     * Creates and returns a repository instance based on entity type and active driver.
     *
     * @param string $entity Type of entity ('lead', 'user', 'blog', 'faq', 'process', 'news')
     * @return object Repository instance matching requested contract
     */
    public static function create(string $entity = 'lead'): object {
        $driver = strtolower(Config::DB_DRIVER);
        $isMySql = ($driver === 'mysql');

        switch (strtolower($entity)) {
            case 'lead':
            case 'leads':
                return $isMySql ? new MySqlLeadRepository() : new JsonFileLeadRepository();

            case 'user':
            case 'users':
                return $isMySql ? new MySqlUserRepository() : new JsonFileUserRepository();

            case 'blog':
            case 'blogs':
                return $isMySql ? new MySqlBlogRepository() : new JsonFileBlogRepository();

            case 'faq':
            case 'faqs':
                return $isMySql ? new MySqlFaqRepository() : new JsonFileFaqRepository();

            case 'process':
            case 'solar_process':
                return $isMySql ? new MySqlProcessRepository() : new JsonFileProcessRepository();

            case 'news':
            case 'daily_updates':
            case 'updates':
                return $isMySql ? new MySqlNewsRepository() : new JsonFileNewsRepository();

            default:
                throw new InvalidArgumentException("Unknown repository entity type: {$entity}");
        }
    }
}
