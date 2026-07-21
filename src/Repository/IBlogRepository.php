<?php

namespace Repository;

interface IBlogRepository {
    public function getAll(bool $publishedOnly = true): array;
    public function getBySlug(string $slug): ?array;
    public function getById(string $id): ?array;
    public function save(array $blogData): bool;
    public function delete(string $id): bool;
    public function getRelated(string $currentSlug, int $limit = 3): array;
}
