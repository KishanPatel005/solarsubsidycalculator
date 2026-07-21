<?php

namespace Repository;

interface IFaqRepository {
    public function getAll(bool $activeOnly = true): array;
    public function getById(string $id): ?array;
    public function save(array $faqData): bool;
    public function delete(string $id): bool;
}
