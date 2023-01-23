<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Metowolf\Meting;

function handler($server, $type, $id)
{
    if (empty($id)) {
        throw new Exception('require id.');
    }

    if (!in_array($server, ['netease', 'tencent', 'baidu', 'xiami', 'kugou', 'kuwo'])) {
        throw new Exception('unsupported server.');
    }

    if (!in_array($type, ['song', 'album', 'search', 'artist', 'playlist', 'lrc', 'url', 'pic'])) {
        throw new Exception('unsupported type.');
    }

    $api = new Meting($server);
    $api->format(true);
    if (getenv('METING_PROXY')) {
        $api->proxy(getenv('METING_PROXY'));
    }
    if (!empty($_SERVER['HTTP_COOKIE'])) {
        $api->cookie($_SERVER['HTTP_COOKIE']);
    }

    if ($type == 'lrc') {
        $type = 'lyric';
    }

    $data = $api->$type($id);
    $data = json_decode($data, true);

    return $data;
}

function main()
{
    $server = $_GET['server'] ?? 'netease';
    $type = $_GET['type'] ?? 'search';
    $id = $_GET['id'] ?? 'hello';

    try {
        $data = handler($server, $type, $id);
        $result = [
            'success' => true,
            'message' => $data
        ];
    } catch (Exception $e) {
        $result = [
            'success' => false,
            'message' => $e->getMessage()
        ];
    }

    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    echo json_encode($result);
}

main();
