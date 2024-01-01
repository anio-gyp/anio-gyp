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

---

## Example output (library)

```
📝 Preparation phase

    Type of project               Library
    Scan of src/export            Found 19 exports with 2 sub-modules
    Files to auto-generate        9 files will be auto-generated
    Files to build                3 files will be built

    Scan of src/auto              Found 0 out of date files or folders
    Scan of build                 Found 0 out of date files or folders

🔍 Reporting phase

    Information about the bundler:

        Version of bundler        v0.4.0
        Version of utilities      v0.6.0
        Version of runtime        v0.2.0

    The following files will be updated or created:

        src/auto/library.mjs                                      lib:createLibraryFile
        src/auto/dict.mjs                                         lib:createDictionaryFile
        src/auto/importWithContextAsync.mjs                       lib:createImportFile
        src/auto/index.mjs                                        lib:createIndexFile
        src/auto/NOTICE.txt                                       lib:createNoticeFile
        src/auto/support_files/createModifierFunction.mjs         lib:copySupportFile [synthetic]
        src/auto/support_files/createNamedAnonymousFunction.mjs   lib:copySupportFile [synthetic]
        src/auto/support_files/wrapFactory.mjs                    lib:copySupportFile [synthetic]
        src/auto/support_files/wrapFunction.mjs                   lib:copySupportFile [synthetic]
        build/library.mjs                                         lib:bundleLibraryFile
        build/submodule/fs.mjs                                    lib:createSubModuleFile
        build/submodule/util.mjs                                  lib:createSubModuleFile

    The following files will be included in the bundle:

        bundle.resources/a/p.mj
        bundle.resources/test.txt

    The bundle id was calculated to be : ba7b77fb759da573541467bef9ec82bd885cf15c (from 27 files)

🧹 Housekeeping phase

    No files to remove!

🌳 Tree generation phase

    Create src/auto
    Create src/auto/support_files
    Create build
    Create build/submodule

🧼 Scrubbing phase

    Scrub src/auto/library.mjs
    Scrub src/auto/dict.mjs
    Scrub src/auto/importWithContextAsync.mjs
    Scrub src/auto/index.mjs
    Scrub src/auto/NOTICE.txt
    Scrub src/auto/support_files/createModifierFunction.mjs
    Scrub src/auto/support_files/createNamedAnonymousFunction.mjs
    Scrub src/auto/support_files/wrapFactory.mjs
    Scrub src/auto/support_files/wrapFunction.mjs
    Scrub build/library.mjs
    Scrub build/submodule/fs.mjs
    Scrub build/submodule/util.mjs

⚙️  Generation phase

    Generate src/auto/library.mjs
    Generate src/auto/dict.mjs
    Generate src/auto/importWithContextAsync.mjs
    Generate src/auto/index.mjs
    Generate src/auto/NOTICE.txt
    Generate src/auto/support_files/createModifierFunction.mjs
    Generate src/auto/support_files/createNamedAnonymousFunction.mjs
    Generate src/auto/support_files/wrapFactory.mjs
    Generate src/auto/support_files/wrapFunction.mjs
    Build    build/library.mjs
    Build    build/submodule/fs.mjs
    Build    build/submodule/util.mjs

✅ Bundling complete with no warnings

    Generated 12 files in 0.105 second(s)

```
