
document.addEventListener('DOMContentLoaded', function (params) {

    require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs' } });

    require(['vs/editor/editor.main'], function () {


        const editor = monaco.editor.create(document.querySelector('.container-monaco'), {
            value: `{{publication.title}} `,
            language: 'javascript',
            theme: 'vs-dark',
            fontFamily: "'Cascadia Code PL', 'Menlo', 'Monaco', 'Courier New', 'monospace'",
            fontLigatures: 'on',
            fontSize: 18,
            lineNumbers: 'off',
            tabSize: 2,
            minimap: false,
            wordWrap: 'on',
            minimap: {
                enabled: false
            },
            cursorBlinking: 'blink',
            cursorSmoothCaretAnimation: 'off'
        });
    })
})