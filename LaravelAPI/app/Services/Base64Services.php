<?php

namespace App\Services;

use Illuminate\Support\Facades\File;

class Base64Services
{
    // Example for base64 string header: data:image/png;base64,
    public function fileExtension(String $base64String): String
    {
        return strtolower(explode('/', explode(':', substr($base64String, 0, strpos($base64String, ';')))[1])[1]);
    }

    public function mimeType(String $base64String): String
    {
        return strtolower(explode(':', substr($base64String, 0, strpos($base64String, ';')))[1]);
    }

    public function saveFile(String $base64String, String $targetDir, String $nameWithoutExtension): String
    {
        $fileName = $nameWithoutExtension . '.' . $this->fileExtension($base64String);
        $base64_str = substr($base64String, strpos($base64String, ",") + 1);
        // decode base64 string to the content to store on the file
        $content = base64_decode($base64_str);
        File::put($targetDir . '/' . $fileName, $content);
        return $fileName;
    }
}
