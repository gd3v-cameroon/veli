# Veli - Form Validation Library

A robust, dependency-free form validation library for JavaScript applications. Define validation rules directly in your HTML attributes.

## Official Documentation

For complete documentation, visit **[veli.gd3v.com](https://veli.gd3v.com/)**.

## Features

-   **Zero Dependencies**: Lightweight and fast.
-   **HTML-First**: Define rules in `data-veli-rules` attributes.
-   **TypeScript Support**: Written in TypeScript with full type definitions.
-   **Security Scanner**: Built-in protection against XSS, SQL Injection, and more.
-   **Customizable**: Easy to configure themes and add custom rules.

## Installation

```bash
npm install @gd3v/veli
```

## 🛠 Usage

### 1. HTML Setup

Add `data-veli-rules` to your input fields:

```html
<form id="myForm" data-veli-design="classic">
  <div class="veli-field-wrapper">
    <label>Name</label>
    <input 
      type="text" 
      name="username" 
      data-veli-rules='{"type":"text", "name":"username", "minChar":"3", "required":"true"}' 
    />
    <span class="veli-error"></span>
  </div>
  <button type="submit">Submit</button>
</form>
```

### 2. Validation Response

Get the validation response in your JavaScript file:

```javascript
const form = document.getElementById('myForm');

form.addEventListener('onCompleteValidation', () => {
  // Access the global validationResponse object
  // The key is the form's ID
  const result = validationResponse.myForm;
  console.log(result);
});
```

##  Development

To contribute or modify the library:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/gd3v-cameroon/veli.git
    cd veli/source-code
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start development server** (watches TS and SCSS changes):
    ```bash
    npm run dev
    ```

4.  **Build for production**:
    ```bash
    npm run build
    ```

## 📄 License

MIT
