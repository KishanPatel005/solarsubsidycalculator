<?php

namespace Repository;

interface INewsRepository {
    public function getAll(bool $featuredOnly = false, int $limit = 0): array;
    public function getBySlug(string $slug): ?array;
    public function getById(string $id): ?array;
    public function save(array $newsData): bool;
    public function delete(string $id): bool;
}
