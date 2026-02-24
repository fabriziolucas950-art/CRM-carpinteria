const { execSync } = require('child_process');

/**
 * git-push.js
 * Hace add + commit + push automático al repositorio GitHub.
 * Uso: node git-push.js "mensaje opcional"
 */

function run(cmd) {
    console.log(`> ${cmd}`);
    const output = execSync(cmd, { stdio: 'pipe' }).toString().trim();
    if (output) console.log(output);
    return output;
}

function getTimestamp() {
    const now = new Date();
    return now.toLocaleString('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

try {
    const mensaje = process.argv[2] || `Actualización automática - ${getTimestamp()}`;

    console.log('\n🚀 Iniciando push automático a GitHub...\n');

    // Agregar todos los cambios
    run('git add .');

    // Ver si hay algo para commitear
    let status = '';
    try {
        status = execSync('git diff --cached --name-only', { stdio: 'pipe' }).toString().trim();
    } catch (e) {}

    if (!status) {
        console.log('✅ No hay cambios nuevos para commitear.');
        process.exit(0);
    }

    console.log(`📝 Archivos modificados:\n${status}\n`);

    // Commit
    run(`git commit -m "${mensaje}"`);

    // Push
    run('git push origin main');

    console.log(`\n✅ ¡Push exitoso! Cambios subidos a GitHub con mensaje: "${mensaje}"\n`);

} catch (err) {
    console.error('\n❌ Error al hacer push:', err.message);
    process.exit(1);
}
