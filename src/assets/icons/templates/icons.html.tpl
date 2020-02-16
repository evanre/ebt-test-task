<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Font icon</title>
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css" rel="stylesheet">
    <style type="text/css">
        * {
            box-sizing: border-box;
        }

        body {
            font-family: 'Roboto', sans-serif;
            padding: 40px;
        }

        ul {
            border: 1px solid #ddd;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            list-style: none;
            padding: 10px;
        }

        li {
            align-self: flex-end;
            font-size: 1.2em;
            margin-bottom: 20px;
            padding: 10px;
            text-align: center;
            width: 170px;
        }

        input {
            border: 1px solid #ddd;
            border-radius: 2px;
            font-family: 'Roboto', sans-serif;
            margin-top: 0.8em;
            padding: 4px;
            text-align: center;
            width: 150px;
        }

        @font-face {
            font-family: '<%= fontName %>';
            src: url('./assets/<%= fontName %>.woff2') format('woff2'),
                url('./assets/<%= fontName %>.woff') format('woff');
        }

        .<%= cssClass %>::before {
            display: inline-block;
            font-family: '<%= fontName %>';
            font-size: 1.5em;
            -webkit-font-smoothing: antialiased;
            font-style: normal;
            font-variant: normal;
            font-weight: normal;
            line-height: 1;
            text-decoration: inherit;
            text-transform: none;
        }
        <% _.each(glyphs, function(glyph) { %>
        .<%= cssClass %>-<%= glyph.fileName %>::before {
            content: '\<%= glyph.codePoint %>';
        }
        <% }); %>
    </style>
</head>
<body>
<ul><% _.each(glyphs, function(glyph) { %>
    <li>
        <i class="<%= cssClass %> <%= cssClass %>-<%= glyph.fileName %>"></i>
        <input id="<%= glyph.fileName %>" name="<%= glyph.fileName %>" type="text" value="<%= glyph.fileName %>" readonly/>
        <input id="<%= glyph.codePoint %>" name="<%= glyph.codePoint %>" type="text" value="\<%= glyph.codePoint %>" readonly/>
    </li><% }); %>
</ul>
<script>
    Array.prototype.slice.call(document.querySelectorAll('ul')).forEach(function(ul) {
        ul.addEventListener('click', function(e) {
            if(e.target.tagName === 'INPUT') {
                e.target.select();
            }
        });
    });
</script>
</body>
</html>
