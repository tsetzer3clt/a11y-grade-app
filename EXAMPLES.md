# 📝 Code Examples

Examples of how to use the Accessibility Code Grader with different languages.

## HTML

Direct HTML markup analysis:

```html
<div>
  <img src="photo.jpg" />
  <button>Click me</button>
  <a>Link without href</a>
  <input type="text" />
</div>
```

**Issues found:**
- Missing alt text on image
- Missing button type
- Missing href on anchor
- Missing label for input

## JSX/TSX

React/TypeScript JSX code:

```jsx
function Component() {
  return (
    <div>
      <img src="photo.jpg" />
      <button onClick={handleClick}>Click me</button>
      <a>Link</a>
      <input type="text" />
    </div>
  );
}
```

**Issues found:**
- Missing alt text on image
- Missing button type
- Missing href on anchor
- Missing label for input

## JavaScript

JavaScript code with HTML in template literals or strings:

### Template Literals

```javascript
const html = `
  <div>
    <img src="${imageUrl}" />
    <button>Click me</button>
  </div>
`;

document.getElementById('app').innerHTML = html;
```

### String Literals

```javascript
const button = '<button>Submit</button>';
const form = '<form><input type="text" /></form>';
```

### JSX in .js Files

```javascript
function MyComponent() {
  return (
    <div>
      <img src="photo.jpg" />
      <button onClick={handleClick}>Click</button>
    </div>
  );
}
```

**Note:** The analyzer will:
- Extract HTML from template literals (backticks)
- Extract HTML from string literals
- Detect and analyze JSX syntax in JavaScript files

## Python

Python code with HTML in string literals:

### Triple-Quoted Strings (Most Common)

```python
html = """
<div>
  <img src="photo.jpg" />
  <button>Click me</button>
  <a>Link</a>
</div>
"""
```

### Single Triple Quotes

```python
template = '''
<div>
  <h1>Title</h1>
  <p>Content</p>
</div>
'''
```

### Regular Strings

```python
button = '<button type="submit">Submit</button>'
form = "<form><input type='text' /></form>"
```

### F-Strings

```python
name = "John"
html = f"""
<div>
  <h1>Hello {name}</h1>
  <img src="photo.jpg" />
</div>
"""
```

### Flask/Django Templates

```python
from flask import Flask, render_template_string

app = Flask(__name__)

template = """
<div>
  <img src="{{ url_for('static', filename='logo.png') }}" />
  <button>Click</button>
</div>
"""

@app.route('/')
def index():
    return render_template_string(template)
```

**Note:** The analyzer will:
- Extract HTML from triple-quoted strings (`"""` or `'''`)
- Extract HTML from regular strings (`'` or `"`)
- Extract HTML from f-strings (removing Python expressions)
- Analyze the extracted HTML for accessibility issues

## What Gets Analyzed

The analyzers look for:
- **HTML tags** in strings (e.g., `<div>`, `<img>`, `<button>`)
- **JSX syntax** in JavaScript/TypeScript files
- **Accessibility attributes** (alt, href, type, aria-*, etc.)

## What Doesn't Get Analyzed

- Pure Python/JavaScript code without HTML
- Comments (unless they contain HTML)
- Variables and functions (only HTML content is analyzed)

If no HTML is found, you'll get a warning message.

## PHP

PHP code with HTML in strings or mixed PHP/HTML files:

### Direct HTML (Template Files)

```php
<!DOCTYPE html>
<html>
<body>
  <div>
    <img src="photo.jpg" />
    <button>Click me</button>
  </div>
  <?php echo $content; ?>
</body>
</html>
```

### Echo/Print Statements

```php
<?php
echo '<div><img src="photo.jpg" /><button>Click</button></div>';
print "<div><h1>Title</h1></div>";
?>
```

### String Variables

```php
<?php
$html = '<div><img src="photo.jpg" /></div>';
$button = "<button type='submit'>Submit</button>";
?>
```

### Double-Quoted Strings (with variables)

```php
<?php
$name = "John";
$html = "<div><h1>Hello $name</h1><img src='photo.jpg' /></div>";
?>
```

### Heredoc Syntax

```php
<?php
$html = <<<EOF
<div>
  <img src="photo.jpg" />
  <button>Click</button>
</div>
EOF;
?>
```

### Nowdoc Syntax

```php
<?php
$html = <<<'EOF'
<div>
  <img src="photo.jpg" />
  <button>Click</button>
</div>
EOF;
?>
```

### Mixed PHP/HTML (Common in Templates)

```php
<?php if ($loggedIn): ?>
  <div>
    <img src="<?php echo $avatar; ?>" />
    <button>Logout</button>
  </div>
<?php endif; ?>
```

**Note:** The analyzer will:
- Extract HTML outside PHP tags (<?php ... ?>)
- Extract HTML from single-quoted strings
- Extract HTML from double-quoted strings (removing PHP variables)
- Extract HTML from heredoc/nowdoc syntax
- Extract HTML from echo/print statements
- Analyze the extracted HTML for accessibility issues

## Tips

1. **For Python**: Use triple-quoted strings for multi-line HTML
2. **For JavaScript**: Use template literals for dynamic HTML
3. **For JSX**: Make sure your file has JSX syntax (even in .js files)
4. **For PHP**: Use heredoc for multi-line HTML, or mix HTML directly in template files
5. **Best Practice**: Extract HTML into separate template files when possible

## Testing Your Code

1. Copy your code
2. Select the appropriate language in the web interface
3. Paste and click "Analyze Code"
4. Review the grade and detailed report

Happy coding! 🚀

