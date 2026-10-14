param([int]$Port = 3000)

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
try {
    $listener.Start()
    Write-Host "NÅD Dev Server körs på http://localhost:$Port/" -ForegroundColor Green
} catch {
    $Port = 8080
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$Port/")
    $listener.Start()
    Write-Host "NÅD Dev Server körs på http://localhost:$Port/" -ForegroundColor Green
}

$baseDir = $PSScriptRoot

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".png"  = "image/png"
    ".svg"  = "image/svg+xml"
    ".webp" = "image/webp"
}

# Starta webbläsaren direkt
Start-Process "http://localhost:$Port"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $path = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($path) -or $path -eq "/") {
            $path = "index.html"
        }

        $filePath = Join-Path $baseDir $path

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    } catch {
        # Fortsätt lyssna om fel uppstår
    }
}
