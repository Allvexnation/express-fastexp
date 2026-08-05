module.exports.startPage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to fastexp</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://fastexp-init.netlify.app/animation.js"></script>
    <link rel="stylesheet" href="https://fastexp-init.netlify.app/animation.css">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-black text-white min-h-screen">
    <div class="grid-bg"></div>
    <div id="config-message-source" class="hidden">
        <span class="bg-zinc-800 text-gray-300 text-xs px-3 py-1.5 rounded-full">You can configure and remove this in <span class="bg-white text-black px-1.5 py-0.5 rounded font-semibold">index.js</span></span>
    </div>
    <div id="app"></div>
    <script src="https://fastexp-init.netlify.app/script.js"></script>
</body>
</html>`;
