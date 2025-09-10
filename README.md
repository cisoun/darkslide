# Darkslide

Darkslide is a picture slideshow that you can embed in your web page.

- :white_check_mark: No dependencies.
- :white_check_mark: Mobile / desktop support.
- :white_check_mark: Themes (light, dark, auto).
- :white_check_mark: Minimal.

## Usage

```js
import { Darkslide } from 'darkslide';
const container = document.querySelector('#photos');
Darkslide(container);

// With specific configuration:
Darkslide(container, {
  theme: 'auto', // light, dark, auto
});
```

## Installation

```sh
npm install github:cisoun/darkslide
```

## License

[The Unlicense](https://unlicense.org/)