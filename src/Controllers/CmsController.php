<?php

namespace Controllers;

use Core\AuthManager;
use Repository\RepositoryFactory;

class CmsController {
    public static function handleRequest(): void {
        AuthManager::requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return;
        }

        $action = $_POST['action'] ?? '';
        $redirectUrl = $_SERVER['HTTP_REFERER'] ?? url('admin/index.php');

        switch ($action) {
            // BLOG CRUD
            case 'save_blog':
                self::saveBlog();
                break;
            case 'delete_blog':
                self::deleteBlog();
                break;

            // FAQ CRUD
            case 'save_faq':
                self::saveFaq();
                break;
            case 'delete_faq':
                self::deleteFaq();
                break;

            // PROCESS CRUD
            case 'save_process':
                self::saveProcess();
                break;
            case 'delete_process':
                self::deleteProcess();
                break;

            // DAILY UPDATES CRUD
            case 'save_update':
                self::saveUpdate();
                break;
            case 'delete_update':
                self::deleteUpdate();
                break;

            // LEAD DELETE
            case 'delete_lead':
                self::deleteLead();
                break;
        }

        header("Location: {$redirectUrl}");
        exit();
    }

    private static function saveBlog(): void {
        $blogRepo = RepositoryFactory::create('blog');
        $title = trim($_POST['title'] ?? '');
        $slug = trim($_POST['slug'] ?? '');

        if (empty($title)) return;
        if (empty($slug)) {
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title), '-'));
        }

        $data = [
            'id' => $_POST['id'] ?? '',
            'title' => $title,
            'slug' => $slug,
            'category' => trim($_POST['category'] ?? 'General'),
            'description' => trim($_POST['description'] ?? ''),
            'content' => $_POST['content'] ?? '',
            'cover_image' => trim($_POST['cover_image'] ?? ''),
            'reading_time' => trim($_POST['reading_time'] ?? '5 min'),
            'author' => trim($_POST['author'] ?? 'Solar Expert'),
            'is_published' => isset($_POST['is_published']) ? 1 : 0,
        ];

        $blogRepo->save($data);
    }

    private static function deleteBlog(): void {
        $id = $_POST['id'] ?? '';
        if (!empty($id)) {
            $blogRepo = RepositoryFactory::create('blog');
            $blogRepo->delete($id);
        }
    }

    private static function saveFaq(): void {
        $faqRepo = RepositoryFactory::create('faq');
        $question = trim($_POST['question'] ?? '');
        $answer = trim($_POST['answer'] ?? '');

        if (empty($question) || empty($answer)) return;

        $data = [
            'id' => $_POST['id'] ?? '',
            'question' => $question,
            'answer' => $answer,
            'display_order' => (int)($_POST['display_order'] ?? 0),
            'category' => trim($_POST['category'] ?? 'General'),
            'is_active' => isset($_POST['is_active']) ? 1 : 0
        ];

        $faqRepo->save($data);
    }

    private static function deleteFaq(): void {
        $id = $_POST['id'] ?? '';
        if (!empty($id)) {
            $faqRepo = RepositoryFactory::create('faq');
            $faqRepo->delete($id);
        }
    }

    private static function saveProcess(): void {
        $procRepo = RepositoryFactory::create('process');
        $title = trim($_POST['title'] ?? '');

        if (empty($title)) return;

        $data = [
            'id' => $_POST['id'] ?? '',
            'step_number' => (int)($_POST['step_number'] ?? 1),
            'title' => $title,
            'short_description' => trim($_POST['short_description'] ?? ''),
            'detailed_content' => trim($_POST['detailed_content'] ?? ''),
            'icon_name' => trim($_POST['icon_name'] ?? 'check'),
            'is_active' => isset($_POST['is_active']) ? 1 : 0
        ];

        $procRepo->save($data);
    }

    private static function deleteProcess(): void {
        $id = $_POST['id'] ?? '';
        if (!empty($id)) {
            $procRepo = RepositoryFactory::create('process');
            $procRepo->delete($id);
        }
    }

    private static function saveUpdate(): void {
        $newsRepo = RepositoryFactory::create('news');
        $title = trim($_POST['title'] ?? '');
        $slug = trim($_POST['slug'] ?? '');

        if (empty($title)) return;
        if (empty($slug)) {
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title), '-'));
        }

        $data = [
            'id' => $_POST['id'] ?? '',
            'title' => $title,
            'slug' => $slug,
            'category' => trim($_POST['category'] ?? 'Industry News'),
            'snippet' => trim($_POST['snippet'] ?? ''),
            'content' => $_POST['content'] ?? '',
            'image_url' => trim($_POST['image_url'] ?? ''),
            'is_featured' => isset($_POST['is_featured']) ? 1 : 0,
            'published_at' => !empty($_POST['published_at']) ? date('Y-m-d H:i:s', strtotime($_POST['published_at'])) : date('Y-m-d H:i:s')
        ];

        $newsRepo->save($data);
    }

    private static function deleteUpdate(): void {
        $id = $_POST['id'] ?? '';
        if (!empty($id)) {
            $newsRepo = RepositoryFactory::create('news');
            $newsRepo->delete($id);
        }
    }

    private static function deleteLead(): void {
        $id = $_POST['id'] ?? '';
        if (!empty($id)) {
            $leadRepo = RepositoryFactory::create('lead');
            $leadRepo->delete($id);
        }
    }
}
