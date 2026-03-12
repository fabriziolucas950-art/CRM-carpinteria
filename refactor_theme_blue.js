const fs = require('fs');

let html = fs.readFileSync('z:/Desktop/Proyecto 2/FabrizioCRM/index.html.bak', 'utf8');

// 1. Add Tailwind config and dark mode class on html
if (!html.includes("darkMode: 'class'")) {
    html = html.replace('<!-- Tailwind CSS for styling -->\r\n    <script src="https://cdn.tailwindcss.com"></script>',
        `<!-- Tailwind CSS for styling -->\r\n    <script src="https://cdn.tailwindcss.com"></script>\r\n    <script>\r\n        tailwind.config = {\r\n            darkMode: 'class',\r\n            theme: {\r\n                extend: {\r\n                    colors: {\r\n                        primary: '#0ea5e9',\r\n                        secondary: '#38bdf8',\r\n                    }\r\n                }\r\n            }\r\n        }\r\n    </script>`);
}

// 2. Add id="html-root" to html tag if not exists
html = html.replace('<html lang="es">', '<html lang="es" class="dark">');

// 3. Remove hardcoded body styles
html = html.replace(/body\s*\{[\s\S]*?\}/, `body {
            font-family: 'Inter', sans-serif;
            @apply bg-zinc-50 dark:bg-[#0d0d0d] text-zinc-900 dark:text-slate-50 transition-colors duration-300;
        }`);

html = html.replace('.glass {', '.glass {\n            @apply bg-white dark:bg-[#1A1A1A] border-zinc-200 dark:border-white/5 transition-colors duration-300;');
html = html.replace('background: #1A1A1A;', '');
html = html.replace('border: 1px solid rgba(255, 255, 255, 0.05);', '');

html = html.replace('.bg-card {', '.bg-card { @apply bg-white dark:bg-[#1A1A1A] transition-colors duration-300;');
html = html.replace(/background-color: #1A1A1A;/g, '');

// 4. Blue and Orange removal (Change to sky for a calmer blue)
html = html.replace(/blue-/g, 'sky-');
html = html.replace(/orange-/g, 'sky-');
html = html.replace(/#0055FF/g, '#0ea5e9'); // sky-500
html = html.replace(/#FF6B00/g, '#0ea5e9'); // sky-500
html = html.replace(/#3388FF/g, '#38bdf8'); // sky-400
html = html.replace(/255, 107, 0/g, '14, 165, 233');
html = html.replace(/0, 85, 255/g, '14, 165, 233');


// Extra: Ensure that #331500 and #4D2000 are not dark orange
html = html.replace(/#331500/g, '#0c4a6e'); // sky-900 tint
html = html.replace(/#4D2000/g, '#075985'); // sky-800 tint

// 5. Replace background, text, and border classes carefully
const classMap = {
    'bg-slate-900': 'bg-zinc-50 dark:bg-slate-900',
    'bg-slate-800': 'bg-white dark:bg-slate-800',
    'bg-\\[#1A1A1A\\]': 'bg-white dark:bg-[#1A1A1A]',
    'bg-\\[#0d0d0d\\]': 'bg-zinc-50 dark:bg-[#0d0d0d]',
    'text-slate-200': 'text-zinc-800 dark:text-slate-200',
    'text-slate-300': 'text-zinc-700 dark:text-slate-300',
    'text-slate-400': 'text-zinc-600 dark:text-slate-400',
    'border-slate-700': 'border-zinc-300 dark:border-slate-700',
    'border-white\\/10': 'border-zinc-200 dark:border-white/10',
    'border-white\\/5': 'border-zinc-200 dark:border-white/5',
    'bg-sky-500\\/20': 'bg-sky-500/10 dark:bg-sky-500/20'
};

// Replace classes inside className="..." accurately
let modifiedHtml = html.replace(/className=(["'])(.*?)\1/g, (match, quote, classes) => {
    let classArray = classes.split(' ');

    // Process text-white specially: if it is inside a solid button or pill, keep it white. Else make it responsive.
    const hasSolidBg = classArray.some(c => c.startsWith('bg-') && !c.includes('/10') && !c.includes('/20') && !c.includes('bg-transparent'));
    if (!hasSolidBg && classArray.includes('text-white')) {
        classArray = classArray.map(c => c === 'text-white' ? 'text-zinc-900 dark:text-white' : c);
    }

    for (const [oldClass, newClass] of Object.entries(classMap)) {
        const regex = new RegExp(`(?<!dark:|^)${oldClass.replace(/\\[/g, '\\\\[').replace(/\\]/g, '\\\\]')}(?!/\\d+|-[\\w]+)`);
        classArray = classArray.map(c => {
            if (c === oldClass.replace(/\\\\/g, '')) {
                return newClass;
            }
            return c;
        });
    }

    return `className=${quote}${classArray.join(' ')}${quote}`;
});

// 6. Inject Theme Toggle Moon/Sun
if (!modifiedHtml.includes('<Icon name="sun" size={18}')) {
    modifiedHtml = modifiedHtml.replace(/(<div className="flex items-center gap-1\.5">\s*<Icon name="clock" size=\{14\} \/>\s*\{new Date\(\)\.toLocaleDateString\(\)\}\s*<\/div>)/,
        `<button onClick={() => { 
                                    const root = document.documentElement; 
                                    const isDark = root.classList.contains('dark');
                                    if(isDark) { 
                                        root.classList.remove('dark'); 
                                        localStorage.setItem('theme', 'light'); 
                                    } else { 
                                        root.classList.add('dark'); 
                                        localStorage.setItem('theme', 'dark'); 
                                    } 
                                }} className="p-2 rounded-lg bg-zinc-200 dark:bg-slate-800 hover:bg-zinc-300 dark:hover:bg-slate-700 transition-colors mr-3" title="Cambiar tema">
                                    <Icon name="sun" size={18} className="hidden dark:block text-yellow-500" />
                                    <Icon name="moon" size={18} className="block dark:hidden text-sky-600" />
                                </button>
                                $1`);
}

// 6.5 If the first regex fail, let's catch it with a broader match over the older backup date snippet
if (!modifiedHtml.includes('<Icon name="sun" size={18}')) {
    modifiedHtml = modifiedHtml.replace(/(<div className="flex items-center gap-2 text-sm text-\[\#A1A1AA\]">\s*<Icon name="clock" size=\{14\} \/>\s*\{new Date\(\)\.toLocaleDateString\(\)\}\s*<\/div>)/,
        `<div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-slate-400">
    <button onClick={() => { 
        const root = document.documentElement; 
        if(root.classList.contains('dark')) { 
            root.classList.remove('dark'); 
            localStorage.setItem('theme', 'light'); 
        } else { 
            root.classList.add('dark'); 
            localStorage.setItem('theme', 'dark'); 
        } 
    }} className="p-2 rounded-lg bg-zinc-200 dark:bg-slate-800 hover:bg-zinc-300 dark:hover:bg-slate-700 transition-colors" title="Cambiar tema">
        <Icon name="sun" size={18} className="hidden dark:block text-yellow-500" />
        <Icon name="moon" size={18} className="block dark:hidden text-sky-600" />
    </button>
    <div className="flex items-center gap-1.5"><Icon name="clock" size={14} />{new Date().toLocaleDateString()}</div>
</div>`);
}


// Initialize theme from local storage inside the head
if (!modifiedHtml.includes("prefers-color-scheme: dark")) {
    modifiedHtml = modifiedHtml.replace('</head>', `
    <script>
        // Check local storage for theme
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    </script>
</head>`);
}


fs.writeFileSync('z:/Desktop/Proyecto 2/FabrizioCRM/index.html', modifiedHtml);
console.log("Done");
