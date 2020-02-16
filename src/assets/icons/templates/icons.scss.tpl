@font-face {
    font-family: '<%= fontName %>';
    font-style: normal;
    font-weight: normal;
    src: url('<%= fontPath %><%= fontName %>.woff2') format('woff2'),
        url('<%= fontPath %><%= fontName %>.woff') format('woff');
}

%icon {
    display: inline-block;
    font-family: '<%= fontName %>';
    -webkit-font-smoothing: antialiased;
    font-style: normal;
    font-variant: normal;
    font-weight: normal;
    line-height: 1;
    text-decoration: inherit;
    text-transform: none;
}

$icons: (
    <%= glyphs.map(g => `${g.fileName.slice(4)}: '\\${g.codePoint}'`).slice(0,-1).join(',\n    ') %>,
);
<% '\n' %>
