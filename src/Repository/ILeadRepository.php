<?php

namespace Repository;

interface ILeadRepository {
    /**
     * Saves a lead into persistence.
     *
     * @param array $leadData
     * @return bool
     */
    public function save(array $leadData): bool;

    /**
     * Retrieves all stored leads.
     *
     * @return array
     */
    public function getAll(): array;
}
