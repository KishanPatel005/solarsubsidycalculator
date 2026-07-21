<?php

namespace Repository;

interface IUserRepository {
    public function getByUsername(string $username): ?array;
    public function getById(string $id): ?array;
    public function save(array $userData): bool;
    public function delete(string $id): bool;
    public function getAll(): array;
}
