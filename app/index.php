<?php

require_once __DIR__.'/vendor/autoload.php';


$app = new Silex\Application();
$app['debug']=true;
error_reporting(1);
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use Symfony\Component\HttpFoundation\ParameterBag;

$app->before(function (Request $request) {
    if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
        $data = json_decode($request->getContent(), true);
        $request->request->replace(is_array($data) ? $data : array());
    }
});

$dataFile = __DIR__.'/library/js/data/postcard-data.json';
$imgDir = __DIR__.'/library/images/postcards';
$data = array();

use \Heartsentwined\FileSystemManager\FileSystemManager;

$app['data'] = $data;

$app['findEntry'] = $app->protect(function( $id ) use ($app) {

    $data = $app['data'];

    if (!$id){
        return false;
    }

    foreach( $data as $entry ){
        if ($entry['id'] === $id){
            return $entry;
        }
    }

    return false;
});
    
if (is_file($dataFile)){
    $data = $app['data'] = json_decode(file_get_contents($dataFile), true);
}
    
foreach (FileSystemManager::fileIterator($imgDir) as $file) {
    
    if (! $app['findEntry'](basename($file)) ){

        $data[] = array(
            'id' => basename($file)
        );
    }
}

$app['data'] = $data;

file_put_contents($dataFile, json_encode($app['data']));

$app['writeData'] = $app->protect(function( $new ) use ($dataFile, $app){

    if (!$new){
        return false;
    }

    $data = $app['data'];

    foreach( $data as $idx => $entry ){
        if ($entry['id'] === $new['id']){
            
            $data[$idx] = $new;
            break;
        }
    }

    file_put_contents($dataFile, json_encode($data));
    $app['data'] = $data;
});

/**
 * Main Site
 */
$app->get('/data/', function(Silex\Application $app) {

    return $app->json( $app['data'] );
});

$app->get('/data/{id}', function (Request $request, $id) use ($app){

    $entry = $app['findEntry']($id);
    
    if (!$entry){
        return $app->abort(404, "Entry not found for file: $id");
    }

    return $app->json( $entry );
});

$app->put('/data/{id}', function (Request $request, $id) use ($app){

    $entry = $app['findEntry']($id);
    
    if (!$entry){
        return $app->abort(404, "Entry not found for file: $id");
    }

    $entry['title'] = $request->request->get('title');
    $entry['lat'] = $request->request->get('lat');
    $entry['lng'] = $request->request->get('lng');
    
    $app['writeData']( $entry );

    return $app->json( $entry );
});

/**
 * Start App
 */
$app->run();
