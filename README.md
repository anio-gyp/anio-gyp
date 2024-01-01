# anio-jsbundler

```
Usage: anio-jsbundler <project-root> [...flags]

    Possible flags and their meaning:

        -no-scrub
             Disable scrubbing of auto-generated files

        -no-remove
             Disable removal of obsolete auto-generated files

        -no-autogen
             Disable auto-generation of files
```

## Types of projects

### CLI

A command line project will need to have the following root structure:

```
/build/
/anio_project.mjs

/src/cli.mjs <- entry point for CLI application (auto shebang in build)
```

### Library

A library project will need to have the following root structure:

```
/build/
/anio_project.mjs

/src/export/ <- functions that get exposed to the outside world
/src/auto/ <- automatically generated code by anio-jsbundler
```

Optional directories:
```
/bundle.resources/
```

`/src/export/` contains all library functions that should be exposed in the final build.

Sub-directories _can_ be utilized but are discouraged since their import names get changed:

`/src/export/fs/func.mjs` will be exported as `fs$func`. (the slash gets replaced by a dollar sign)

Dots are discouraged too and get replaced by an underscore (i.e. `fs/func.test.mjs` is `fs$func_test`).

`/src/auto/` contains automatically generated functions by the bundler.

A library must expose a factory function for each exported function.

However, factory functions can (in some cases) be automatically generated.
