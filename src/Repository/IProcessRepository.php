<?php

namespace Repository;

interface IProcessRepository {
    public function getAll(bool $activeOnly = true): array;
    public function getById(string $id): ?array;
    public function save(array $processData): bool;
    public function delete(string $id): bool;
}
