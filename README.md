# LogHunter
Webpack loader that warns and/or removes forgotten console.log statments

## Install
npm install log_hunter

## Usage
Add to webpack config loaders:
```
module: {
  loaders: [{
    test: /\.js.?/,
    loader: 'log_warner'
  }
}
```
To emit error messages:
```
module: {
  loaders: [{
    test: /\.js.?/,
    loader: 'log_warner?emitError=true'
  }
}
```

### Exceptions
Create an exceptions file in the root directory named `log-exceptions.json`. It
contains an array of exceptions with file name and line numbers:
```
[
  {
    "filename": "/components/notifier.js.jsx",
    "lines": [18, 19]
  }, {
    "filename": "/components/team_profile/team_profile.js.jsx",
    "lines": [76, 117]
  }
]
```
