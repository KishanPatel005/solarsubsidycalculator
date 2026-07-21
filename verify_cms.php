<?php
require_once __DIR__ . '/bootstrap.php';

use Config\Config;
use Core\AuthManager;
use Repository\RepositoryFactory;

echo "=========================================\n";
echo "Solar Subsidy Platform - CMS Test Suite\n";
echo "=========================================\n\n";

$passCount = 0;
$totalTests = 0;

function assertTest($condition, $description) {
    global $passCount, $totalTests;
    $totalTests++;
    if ($condition) {
        echo "✅ [Pass] {$description}\n";
        $passCount++;
    } else {
        echo "❌ [FAIL] {$description}\n";
    }
}

// 1. User Repository Test
$userRepo = RepositoryFactory::create('user');
$adminUser = $userRepo->getByUsername(Config::DEFAULT_ADMIN_USER);
assertTest($adminUser !== null, "User Repository retrieves default admin user ('" . Config::DEFAULT_ADMIN_USER . "')");
if ($adminUser) {
    assertTest(password_verify(Config::DEFAULT_ADMIN_PASS, $adminUser['password_hash']), "Default admin password hash verifies correctly");
}

// 2. AuthManager Test
$loginSuccess = AuthManager::loginWithUsername(Config::DEFAULT_ADMIN_USER, Config::DEFAULT_ADMIN_PASS);
assertTest($loginSuccess === true, "AuthManager successfully authenticates admin credentials");
assertTest(AuthManager::isAuthenticated() === true, "AuthManager session is authenticated");

$pinSuccess = AuthManager::loginWithPin(Config::ADMIN_PIN);
assertTest($pinSuccess === true, "AuthManager successfully authenticates with PIN passcode (" . Config::ADMIN_PIN . ")");

// 3. FAQ Repository CRUD Test
$faqRepo = RepositoryFactory::create('faq');
$testFaqId = 'faq_test_' . time();
$faqSaveSuccess = $faqRepo->save([
    'id' => $testFaqId,
    'question' => 'Is solar maintenance expensive?',
    'answer' => 'Solar panels require minimal maintenance, mostly occasional water cleaning.',
    'display_order' => 99,
    'category' => 'Maintenance',
    'is_active' => 1
]);
assertTest($faqSaveSuccess === true, "FAQ Repository saves new FAQ entry");

$fetchedFaq = $faqRepo->getById($testFaqId);
assertTest($fetchedFaq && $fetchedFaq['question'] === 'Is solar maintenance expensive?', "FAQ Repository retrieves saved FAQ by ID");

$allFaqs = $faqRepo->getAll(true);
assertTest(count($allFaqs) > 0, "FAQ Repository retrieves non-empty list of active FAQs (" . count($allFaqs) . " found)");

$faqDeleteSuccess = $faqRepo->delete($testFaqId);
assertTest($faqDeleteSuccess === true, "FAQ Repository deletes test FAQ entry");

// 4. Process Repository CRUD Test
$procRepo = RepositoryFactory::create('process');
$testProcId = 'proc_test_' . time();
$procSaveSuccess = $procRepo->save([
    'id' => $testProcId,
    'step_number' => 99,
    'title' => 'Test Process Step',
    'short_description' => 'Test short description',
    'detailed_content' => 'Test detailed guidance',
    'icon_name' => 'check',
    'is_active' => 1
]);
assertTest($procSaveSuccess === true, "Process Repository saves new step entry");

$fetchedProc = $procRepo->getById($testProcId);
assertTest($fetchedProc && $fetchedProc['title'] === 'Test Process Step', "Process Repository retrieves saved step by ID");

$procDeleteSuccess = $procRepo->delete($testProcId);
assertTest($procDeleteSuccess === true, "Process Repository deletes test step entry");

// 5. Daily Solar Updates (News) Repository CRUD Test
$newsRepo = RepositoryFactory::create('news');
$testNewsId = 'news_test_' . time();
$testNewsSlug = 'test-solar-policy-update-' . time();
$newsSaveSuccess = $newsRepo->save([
    'id' => $testNewsId,
    'title' => 'Test Solar Policy Update',
    'slug' => $testNewsSlug,
    'category' => 'Testing',
    'snippet' => 'Test snippet brief',
    'content' => '<p>Test full HTML content</p>',
    'is_featured' => 1
]);
assertTest($newsSaveSuccess === true, "News Repository saves new daily solar update");

$fetchedNews = $newsRepo->getBySlug($testNewsSlug);
assertTest($fetchedNews && $fetchedNews['title'] === 'Test Solar Policy Update', "News Repository retrieves update by slug");

$newsDeleteSuccess = $newsRepo->delete($testNewsId);
assertTest($newsDeleteSuccess === true, "News Repository deletes test solar update");

// 6. Dynamic Blog Repository CRUD & Recommendation Test
$blogRepo = RepositoryFactory::create('blog');
$testBlogId = 'blog_test_' . time();
$testBlogSlug = 'test-dynamic-ckeditor-blog-' . time();
$blogSaveSuccess = $blogRepo->save([
    'id' => $testBlogId,
    'title' => 'Test Dynamic CKEditor Blog',
    'slug' => $testBlogSlug,
    'category' => 'Testing',
    'description' => 'Test excerpt description',
    'content' => '<h2>Testing Header</h2><p>This is dynamic HTML content created via CKEditor.</p>',
    'is_published' => 1
]);
assertTest($blogSaveSuccess === true, "Blog Repository saves dynamic CKEditor blog post");

$fetchedBlog = $blogRepo->getBySlug($testBlogSlug);
assertTest($fetchedBlog && $fetchedBlog['title'] === 'Test Dynamic CKEditor Blog', "Blog Repository retrieves post by slug");

$relatedBlogs = $blogRepo->getRelated($testBlogSlug, 3);
assertTest(is_array($relatedBlogs), "Blog Repository returns array of related blog recommendations");

$blogDeleteSuccess = $blogRepo->delete($testBlogId);
assertTest($blogDeleteSuccess === true, "Blog Repository deletes test blog post");

echo "\n-----------------------------------------\n";
if ($passCount === $totalTests) {
    echo "✅ ALL {$totalTests} CMS UNIT & INTEGRATION TESTS PASSED!\n";
} else {
    echo "⚠️ {$passCount}/{$totalTests} TESTS PASSED.\n";
}
echo "-----------------------------------------\n";
