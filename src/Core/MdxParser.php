<?php

namespace Core;

class MdxParser {
    /**
     * Parses a blog MDX file and returns its front-matter meta and rendered HTML content.
     *
     * @param string $filepath
     * @return array|null
     */
    public static function parse(string $filepath): ?array {
        if (!file_exists($filepath)) {
            return null;
        }

        $content = file_get_contents($filepath);
        // Normalize line endings
        $content = str_replace("\r\n", "\n", $content);

        // Regex split on front-matter boundaries
        if (preg_match('/^---\n(.*?)\n---\n(.*)$/s', $content, $matches)) {
            $frontMatterRaw = $matches[1];
            $body = $matches[2];

            $meta = [];
            foreach (explode("\n", $frontMatterRaw) as $line) {
                $parts = explode(":", $line, 2);
                if (count($parts) === 2) {
                    $key = trim($parts[0]);
                    $val = trim($parts[1]);
                    // Strip enclosing quotes
                    if (preg_match('/^["\'](.*)["\']$/', $val, $m)) {
                        $val = $m[1];
                    }
                    // Handle array parsing
                    if (strpos($val, '[') === 0 && strpos($val, ']') === (strlen($val) - 1)) {
                        $cleaned = str_replace(['[', ']', '"', "'"], '', $val);
                        $val = array_map('trim', explode(',', $cleaned));
                    }
                    $meta[$key] = $val;
                }
            }

            $html = self::renderHtml($body);

            return [
                'meta' => $meta,
                'html' => $html
            ];
        }

        return null;
    }

    /**
     * Translates custom MDX tags and basic markdown lines into valid HTML markup.
     */
    private static function renderHtml(string $body): string {
        $html = $body;

        // 1) Replace InfoBox
        $html = preg_replace_callback('/<InfoBox>\s*(.*?)\s*<\/InfoBox>/s', function($m) {
            return '<div class="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-500 text-blue-700 my-5 text-sm leading-relaxed">' . trim($m[1]) . '</div>';
        }, $html);

        // 2) Replace WarningBox
        $html = preg_replace_callback('/<WarningBox>\s*(.*?)\s*<\/WarningBox>/s', function($m) {
            return '<div class="p-4 rounded-lg bg-amber-50 border-l-4 border-amber-500 text-amber-700 my-5 text-sm leading-relaxed">' . trim($m[1]) . '</div>';
        }, $html);

        // 3) Replace StepBox
        $html = preg_replace_callback('/<StepBox\s+number=\{\s*(\d+)\s*\}\s+title=\s*["\'](.*?)["\']\s*>\s*(.*?)\s*<\/StepBox>/s', function($m) {
            $num = $m[1];
            $title = $m[2];
            $desc = $m[3];
            return '<div class="p-5 rounded-lg border border-slate-100 bg-white shadow-sm flex items-start gap-4 mb-4 my-5">
                        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-800">' . $num . '</div>
                        <div class="flex-1">
                            <h3 class="text-sm font-semibold text-slate-800 uppercase tracking-wider">Step ' . $num . ': ' . $title . '</h3>
                            <p class="mt-1 text-sm text-slate-500 leading-relaxed">' . trim($desc) . '</p>
                        </div>
                    </div>';
        }, $html);

        // 4) Replace CheckList
        $html = preg_replace_callback('/<CheckList\s+items=\{\[\s*(.*?)\s*\]\}\s*\/>/s', function($m) {
            $itemsRaw = $m[1];
            preg_match_all('/"(.*?)"/s', $itemsRaw, $itemsMatches);
            $items = $itemsMatches[1] ?? [];
            if (empty($items)) {
                preg_match_all('/\'(.*?)\'/s', $itemsRaw, $itemsMatches);
                $items = $itemsMatches[1] ?? [];
            }

            $listHtml = '<ul class="space-y-2.5 my-5 text-sm text-slate-600">';
            foreach ($items as $item) {
                $listHtml .= '<li class="flex items-start gap-2.5">
                                <span class="text-emerald-600 mt-0.5">✔️</span>
                                <span class="leading-relaxed">' . htmlspecialchars($item) . '</span>
                              </li>';
            }
            $listHtml .= '</ul>';
            return $listHtml;
        }, $html);

        // 5) Render H2 Headers with automatic ID anchoring
        $html = preg_replace_callback('/^##\s+(.*?)$/m', function($m) {
            $title = trim($m[1]);
            $slug = strtolower(preg_replace('/[^A-Za-z0-9-]+/', '-', $title));
            return '<h2 id="' . $slug . '" class="text-xl font-bold text-slate-800 mt-8 mb-4 border-b pb-2">' . $title . '</h2>';
        }, $html);

        // Render H3 Headers
        $html = preg_replace_callback('/^###\s+(.*?)$/m', function($m) {
            $title = trim($m[1]);
            return '<h3 class="text-lg font-semibold text-slate-800 mt-6 mb-3">' . $title . '</h3>';
        }, $html);

        // 6) Strong/Bold formatting
        $html = preg_replace('/\*\*(.*?)\*\*/', '<strong>$1</strong>', $html);

        // 7) List elements formatting
        $html = preg_replace_callback('/^\s*-\s+(.*?)$/m', function($m) {
            return '<li class="list-disc ml-5 pl-1 my-1 text-slate-600 text-sm">' . trim($m[1]) . '</li>';
        }, $html);

        // Paragraph wrapper flow
        $lines = explode("\n", $html);
        $processed = [];
        $inList = false;

        foreach ($lines as $line) {
            $lineTrim = trim($line);
            if (empty($lineTrim)) {
                if ($inList) {
                    $processed[] = '</ul>';
                    $inList = false;
                }
                continue;
            }

            if (strpos($lineTrim, '<li') === 0) {
                if (!$inList) {
                    $processed[] = '<ul class="my-4 space-y-1.5">';
                    $inList = true;
                }
                $processed[] = $line;
            } elseif (strpos($lineTrim, '<h') === 0 || strpos($lineTrim, '<div') === 0 || strpos($lineTrim, '</div') === 0 || strpos($lineTrim, '<ul') === 0 || strpos($lineTrim, '</ul') === 0) {
                if ($inList) {
                    $processed[] = '</ul>';
                    $inList = false;
                }
                $processed[] = $line;
            } else {
                if ($inList) {
                    $processed[] = '</ul>';
                    $inList = false;
                }
                $processed[] = '<p class="my-4 text-sm text-slate-600 leading-relaxed">' . $lineTrim . '</p>';
            }
        }

        if ($inList) {
            $processed[] = '</ul>';
        }

        return implode("\n", $processed);
    }
}
